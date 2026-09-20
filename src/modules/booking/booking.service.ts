import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { buildMeta, calculatePagination } from "../../utils/pagination";
import { BookingStatus, Role } from "../../../generated/prisma/enums";
import { BookingWhereInput } from "../../../generated/prisma/models";
import { IBookingQuery, ICreateBooking } from "./booking.interface";

// statuses that mean the technician's calendar is genuinely occupied
const ACTIVE_STATUSES: BookingStatus[] = [
  BookingStatus.REQUESTED,
  BookingStatus.ACCEPTED,
  BookingStatus.PAID,
  BookingStatus.IN_PROGRESS,
];

// ---------- CUSTOMER : create a booking ----------
const createBooking = async (customerId: string, payload: ICreateBooking) => {
  const { serviceId, scheduledAt, address, note } = payload;

  const service = await prisma.service.findUniqueOrThrow({
    where: { id: serviceId },
    include: { technician: { include: { user: true } } },
  });

  if (!service.isActive) {
    throw new AppError(httpStatus.BAD_REQUEST, "This service is no longer available");
  }

  if (!service.technician.isAvailable) {
    throw new AppError(httpStatus.BAD_REQUEST, "This technician is not taking bookings right now");
  }

  if (service.technician.user.activeStatus === "BLOCKED") {
    throw new AppError(httpStatus.BAD_REQUEST, "This technician is not taking bookings right now");
  }

  if (service.technician.userId === customerId) {
    throw new AppError(httpStatus.BAD_REQUEST, "You can not book your own service");
  }

  const scheduledDate = new Date(scheduledAt);

  // the job runs from scheduledAt for durationMin, so check that window rather than
  // just the exact start time - otherwise two jobs could silently overlap
  const jobEnd = new Date(scheduledDate.getTime() + service.durationMin * 60 * 1000);

  const sameDayBookings = await prisma.booking.findMany({
    where: {
      technicianId: service.technicianId,
      status: { in: ACTIVE_STATUSES },
      scheduledAt: {
        gte: new Date(scheduledDate.getTime() - 24 * 60 * 60 * 1000),
        lte: new Date(scheduledDate.getTime() + 24 * 60 * 60 * 1000),
      },
    },
    include: { service: { select: { durationMin: true } } },
  });

  const clash = sameDayBookings.find((existing) => {
    const existingStart = existing.scheduledAt.getTime();
    const existingEnd = existingStart + existing.service.durationMin * 60 * 1000;

    return scheduledDate.getTime() < existingEnd && existingStart < jobEnd.getTime();
  });

  if (clash) {
    throw new AppError(
      httpStatus.CONFLICT,
      "This technician is already booked during the time slot you selected",
    );
  }

  const booking = await prisma.booking.create({
    data: {
      customerId,
      technicianId: service.technicianId,
      serviceId,
      scheduledAt: scheduledDate,
      address,
      note,
      // the price is frozen at booking time so a later price change never
      // alters what this customer owes
      totalAmount: service.price,
    },
    include: {
      service: { include: { category: true } },
      technician: {
        include: { user: { select: { id: true, name: true, email: true, phone: true } } },
      },
    },
  });

  return booking;
};

// ---------- CUSTOMER / TECHNICIAN : my bookings ----------
const getMyBookings = async (userId: string, role: Role, query: IBookingQuery) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(query, "scheduledAt");

  const andConditions: BookingWhereInput[] = [];

  if (role === Role.TECHNICIAN) {
    const profile = await prisma.technicianProfile.findUnique({ where: { userId } });

    if (!profile) {
      throw new AppError(httpStatus.NOT_FOUND, "No technician profile exists for this account");
    }

    andConditions.push({ technicianId: profile.id });
  } else {
    andConditions.push({ customerId: userId });
  }

  if (query.status) {
    andConditions.push({ status: query.status as BookingStatus });
  }

  const where = { AND: andConditions };

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      take: limit,
      skip,
      orderBy: { [sortBy]: sortOrder },
      include: {
        service: { include: { category: true } },
        technician: {
          include: { user: { select: { id: true, name: true, email: true, phone: true } } },
        },
        customer: { select: { id: true, name: true, email: true, phone: true } },
        payment: true,
        review: true,
      },
    }),
    prisma.booking.count({ where }),
  ]);

  return { data: bookings, meta: buildMeta(page, limit, total) };
};

// ---------- booking detail ----------
// Readable by the customer who made it, the technician assigned to it, or an admin.
const getBookingById = async (bookingId: string, userId: string, role: Role) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: {
      service: { include: { category: true } },
      technician: {
        include: { user: { select: { id: true, name: true, email: true, phone: true } } },
      },
      customer: { select: { id: true, name: true, email: true, phone: true } },
      payment: true,
      review: true,
    },
  });

  const isOwner = booking.customerId === userId;
  const isAssignedTechnician = booking.technician.userId === userId;

  if (role !== Role.ADMIN && !isOwner && !isAssignedTechnician) {
    throw new AppError(httpStatus.FORBIDDEN, "You don't have permission to view this booking");
  }

  return booking;
};

// ---------- CUSTOMER : cancel ----------
// Allowed at any point before the technician actually starts work.
const cancelBooking = async (bookingId: string, customerId: string, reason?: string) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: { payment: true },
  });

  if (booking.customerId !== customerId) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only cancel your own bookings");
  }

  const nonCancellable: BookingStatus[] = [
    BookingStatus.IN_PROGRESS,
    BookingStatus.COMPLETED,
    BookingStatus.CANCELLED,
    BookingStatus.DECLINED,
  ];

  if (nonCancellable.includes(booking.status)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      booking.status === BookingStatus.IN_PROGRESS
        ? "Work has already started, so this booking can no longer be cancelled"
        : `A booking with status ${booking.status} can no longer be cancelled`,
    );
  }

  const cancelled = await prisma.$transaction(async (tx) => {
    const updated = await tx.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CANCELLED, cancelReason: reason },
      include: { service: true, payment: true },
    });

    // a checkout that was started but never completed is closed out too
    if (booking.payment && booking.payment.status === "PENDING") {
      await tx.payment.update({
        where: { id: booking.payment.id },
        data: { status: "CANCELLED" },
      });
    }

    return updated;
  });

  return cancelled;
};

export const bookingService = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};
