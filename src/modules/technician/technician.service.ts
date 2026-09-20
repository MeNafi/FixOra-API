import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { calculatePagination, buildMeta } from "../../utils/pagination";
import { BookingStatus } from "../../../generated/prisma/enums";
import { TechnicianProfileWhereInput } from "../../../generated/prisma/models";
import {
  IAvailabilitySlot,
  ITechnicianQuery,
  IUpdateBookingStatus,
  IUpdateTechnicianProfile,
} from "./technician.interface";

// every technician-only action starts here: resolve the profile that belongs to the logged-in user
const getMyProfileOrThrow = async (userId: string) => {
  const profile = await prisma.technicianProfile.findUnique({ where: { userId } });

  if (!profile) {
    throw new AppError(httpStatus.NOT_FOUND, "No technician profile exists for this account");
  }

  return profile;
};

// ---------- PUBLIC : browse technicians ----------
const getAllTechnicians = async (query: ITechnicianQuery) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(query, "avgRating");

  const andConditions: TechnicianProfileWhereInput[] = [
    // never surface technicians whose account has been banned
    { user: { activeStatus: "ACTIVE" } },
  ];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        { user: { name: { contains: query.searchTerm, mode: "insensitive" } } },
        { bio: { contains: query.searchTerm, mode: "insensitive" } },
        { location: { contains: query.searchTerm, mode: "insensitive" } },
        { skills: { has: query.searchTerm } },
      ],
    });
  }

  if (query.skill) {
    andConditions.push({ skills: { has: query.skill } });
  }

  if (query.location) {
    andConditions.push({ location: { contains: query.location, mode: "insensitive" } });
  }

  if (query.minRating) {
    andConditions.push({ avgRating: { gte: Number(query.minRating) } });
  }

  if (query.minRate) {
    andConditions.push({ hourlyRate: { gte: Number(query.minRate) } });
  }

  if (query.maxRate) {
    andConditions.push({ hourlyRate: { lte: Number(query.maxRate) } });
  }

  if (query.isAvailable) {
    andConditions.push({ isAvailable: query.isAvailable === "true" });
  }

  const where = { AND: andConditions };

  const [technicians, total] = await Promise.all([
    prisma.technicianProfile.findMany({
      where,
      take: limit,
      skip,
      orderBy: { [sortBy]: sortOrder },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, profilePhoto: true } },
        services: { where: { isActive: true }, include: { category: true } },
        availabilities: { where: { isActive: true } },
        _count: { select: { reviews: true, bookings: true } },
      },
    }),
    prisma.technicianProfile.count({ where }),
  ]);

  return { data: technicians, meta: buildMeta(page, limit, total) };
};

// ---------- PUBLIC : one technician with services + reviews ----------
const getTechnicianById = async (technicianId: string) => {
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: { id: technicianId },
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true, address: true, profilePhoto: true },
      },
      services: { where: { isActive: true }, include: { category: true } },
      availabilities: { where: { isActive: true }, orderBy: { startTime: "asc" } },
      reviews: {
        orderBy: { createdAt: "desc" },
        include: {
          customer: { select: { id: true, name: true, profilePhoto: true } },
          booking: { select: { id: true, service: { select: { title: true } } } },
        },
      },
    },
  });

  return technician;
};

// ---------- TECHNICIAN : profile ----------
const updateMyProfile = async (userId: string, payload: IUpdateTechnicianProfile) => {
  await getMyProfileOrThrow(userId);

  const updated = await prisma.technicianProfile.update({
    where: { userId },
    data: payload,
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  return updated;
};

// ---------- TECHNICIAN : availability ----------
// Slots are replaced wholesale inside a transaction, so the technician's calendar
// is never left half-written if one of the inserts fails.
const updateMyAvailability = async (userId: string, slots: IAvailabilitySlot[]) => {
  const profile = await getMyProfileOrThrow(userId);

  // reject two slots for the same day that overlap each other
  const byDay = new Map<string, IAvailabilitySlot[]>();

  for (const slot of slots) {
    const existing = byDay.get(slot.dayOfWeek) ?? [];

    for (const other of existing) {
      if (slot.startTime < other.endTime && other.startTime < slot.endTime) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Overlapping availability slots on ${slot.dayOfWeek}: ${other.startTime}-${other.endTime} and ${slot.startTime}-${slot.endTime}`,
        );
      }
    }

    existing.push(slot);
    byDay.set(slot.dayOfWeek, existing);
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.availability.deleteMany({ where: { technicianId: profile.id } });

    await tx.availability.createMany({
      data: slots.map((slot) => ({
        technicianId: profile.id,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isActive: slot.isActive ?? true,
      })),
    });

    return tx.availability.findMany({
      where: { technicianId: profile.id },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
  });

  return result;
};

const getMyAvailability = async (userId: string) => {
  const profile = await getMyProfileOrThrow(userId);

  return prisma.availability.findMany({
    where: { technicianId: profile.id },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });
};

// ---------- TECHNICIAN : bookings ----------
const getMyBookings = async (userId: string, status?: BookingStatus) => {
  const profile = await getMyProfileOrThrow(userId);

  const bookings = await prisma.booking.findMany({
    where: {
      technicianId: profile.id,
      ...(status ? { status } : {}),
    },
    orderBy: { scheduledAt: "desc" },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      service: { include: { category: true } },
      payment: true,
      review: true,
    },
  });

  return bookings;
};

/**
 * The booking state machine, enforced server-side:
 *
 *   REQUESTED -> ACCEPTED | DECLINED
 *   ACCEPTED  -> PAID          (only the payment module may do this)
 *   PAID      -> IN_PROGRESS
 *   IN_PROGRESS -> COMPLETED
 *
 * A technician can never skip payment by jumping straight to IN_PROGRESS.
 */
const updateBookingStatus = async (
  userId: string,
  bookingId: string,
  payload: IUpdateBookingStatus,
) => {
  const profile = await getMyProfileOrThrow(userId);
  const { status, reason } = payload;

  const booking = await prisma.booking.findUniqueOrThrow({ where: { id: bookingId } });

  if (booking.technicianId !== profile.id) {
    throw new AppError(httpStatus.FORBIDDEN, "This booking is not assigned to you");
  }

  const allowedTransitions: Record<string, BookingStatus[]> = {
    REQUESTED: [BookingStatus.ACCEPTED, BookingStatus.DECLINED],
    PAID: [BookingStatus.IN_PROGRESS],
    IN_PROGRESS: [BookingStatus.COMPLETED],
  };

  const allowed = allowedTransitions[booking.status] ?? [];

  if (!allowed.includes(status as BookingStatus)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      booking.status === BookingStatus.ACCEPTED
        ? "This booking is waiting for the customer's payment before work can start"
        : `A booking with status ${booking.status} can not be changed to ${status}`,
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: status as BookingStatus,
        ...(status === "DECLINED" ? { declineReason: reason } : {}),
        ...(status === "COMPLETED" ? { completedAt: new Date() } : {}),
      },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        service: { include: { category: true } },
        payment: true,
      },
    });

    // a finished job counts towards the technician's job total
    if (status === "COMPLETED") {
      await tx.technicianProfile.update({
        where: { id: profile.id },
        data: { totalJobs: { increment: 1 } },
      });
    }

    return updated;
  });

  return result;
};

export const technicianService = {
  getAllTechnicians,
  getTechnicianById,
  updateMyProfile,
  updateMyAvailability,
  getMyAvailability,
  getMyBookings,
  updateBookingStatus,
};
