import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { buildMeta, calculatePagination } from "../../utils/pagination";
import { ServiceWhereInput } from "../../../generated/prisma/models";
import { ICreateService, IServiceQuery, IUpdateService } from "./service.interface";

const getMyProfileOrThrow = async (userId: string) => {
  const profile = await prisma.technicianProfile.findUnique({ where: { userId } });

  if (!profile) {
    throw new AppError(httpStatus.NOT_FOUND, "No technician profile exists for this account");
  }

  return profile;
};

// ---------- PUBLIC : browse services ----------
const getAllServices = async (query: IServiceQuery) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(query);

  const andConditions: ServiceWhereInput[] = [
    { isActive: true },
    { technician: { user: { activeStatus: "ACTIVE" } } },
  ];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: query.searchTerm, mode: "insensitive" } },
        { description: { contains: query.searchTerm, mode: "insensitive" } },
        { category: { name: { contains: query.searchTerm, mode: "insensitive" } } },
        { technician: { user: { name: { contains: query.searchTerm, mode: "insensitive" } } } },
      ],
    });
  }

  if (query.categoryId) {
    andConditions.push({ categoryId: query.categoryId });
  }

  // allow filtering by category name or slug, which is friendlier in a URL
  if (query.category) {
    andConditions.push({
      category: {
        OR: [
          { name: { equals: query.category, mode: "insensitive" } },
          { slug: { equals: query.category, mode: "insensitive" } },
        ],
      },
    });
  }

  if (query.location) {
    andConditions.push({
      technician: { location: { contains: query.location, mode: "insensitive" } },
    });
  }

  if (query.minPrice) {
    andConditions.push({ price: { gte: Number(query.minPrice) } });
  }

  if (query.maxPrice) {
    andConditions.push({ price: { lte: Number(query.maxPrice) } });
  }

  if (query.minRating) {
    andConditions.push({ technician: { avgRating: { gte: Number(query.minRating) } } });
  }

  const where = { AND: andConditions };

  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      take: limit,
      skip,
      orderBy: { [sortBy]: sortOrder },
      include: {
        category: true,
        technician: {
          include: {
            user: { select: { id: true, name: true, profilePhoto: true } },
          },
        },
      },
    }),
    prisma.service.count({ where }),
  ]);

  return { data: services, meta: buildMeta(page, limit, total) };
};

// ---------- PUBLIC : one service ----------
const getServiceById = async (serviceId: string) => {
  const service = await prisma.service.findUniqueOrThrow({
    where: { id: serviceId },
    include: {
      category: true,
      technician: {
        include: {
          user: { select: { id: true, name: true, email: true, phone: true, profilePhoto: true } },
          availabilities: { where: { isActive: true }, orderBy: { startTime: "asc" } },
        },
      },
    },
  });

  return service;
};

// ---------- TECHNICIAN : create ----------
const createService = async (userId: string, payload: ICreateService) => {
  const profile = await getMyProfileOrThrow(userId);

  const category = await prisma.category.findUniqueOrThrow({
    where: { id: payload.categoryId },
  });

  if (!category.isActive) {
    throw new AppError(httpStatus.BAD_REQUEST, "This category is not accepting new services");
  }

  const service = await prisma.service.create({
    data: { ...payload, technicianId: profile.id },
    include: { category: true },
  });

  return service;
};

// ---------- TECHNICIAN : my services ----------
const getMyServices = async (userId: string) => {
  const profile = await getMyProfileOrThrow(userId);

  const services = await prisma.service.findMany({
    where: { technicianId: profile.id },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      _count: { select: { bookings: true } },
    },
  });

  return services;
};

// ---------- TECHNICIAN : update ----------
const updateService = async (userId: string, serviceId: string, payload: IUpdateService) => {
  const profile = await getMyProfileOrThrow(userId);

  const service = await prisma.service.findUniqueOrThrow({ where: { id: serviceId } });

  if (service.technicianId !== profile.id) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not the owner of this service");
  }

  if (payload.categoryId) {
    await prisma.category.findUniqueOrThrow({ where: { id: payload.categoryId } });
  }

  const updated = await prisma.service.update({
    where: { id: serviceId },
    data: payload,
    include: { category: true },
  });

  return updated;
};

// ---------- TECHNICIAN : delete ----------
// A service with live bookings is never removed, otherwise those bookings would
// lose the record of what was actually booked.
const deleteService = async (userId: string, serviceId: string) => {
  const profile = await getMyProfileOrThrow(userId);

  const service = await prisma.service.findUniqueOrThrow({ where: { id: serviceId } });

  if (service.technicianId !== profile.id) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not the owner of this service");
  }

  const activeBookings = await prisma.booking.count({
    where: {
      serviceId,
      status: { in: ["REQUESTED", "ACCEPTED", "PAID", "IN_PROGRESS"] },
    },
  });

  if (activeBookings > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This service has active bookings. Deactivate it instead of deleting it",
    );
  }

  await prisma.service.delete({ where: { id: serviceId } });
};

export const serviceService = {
  getAllServices,
  getServiceById,
  createService,
  getMyServices,
  updateService,
  deleteService,
};
