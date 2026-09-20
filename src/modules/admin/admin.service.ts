import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import config from "../../config";
import { buildMeta, calculatePagination } from "../../utils/pagination";
import {
  ActiveStatus,
  BookingStatus,
  PaymentStatus,
  Role,
} from "../../../generated/prisma/enums";
import { BookingWhereInput, PaymentWhereInput, UserWhereInput } from "../../../generated/prisma/models";
import { IAdminBookingQuery, ICreateAdmin, IAdminLogin, IUserQuery } from "./admin.interface";

// ---------- auth ----------
const createAdmin = async (payload: ICreateAdmin) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const admin = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
      role: Role.ADMIN,
    },
    omit: { password: true },
  });

  return admin;
};

const loginAdmin = async (payload: IAdminLogin) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user || user.role !== Role.ADMIN) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials or not an admin");
  }

  if (user.activeStatus === ActiveStatus.BLOCKED) {
    throw new AppError(httpStatus.FORBIDDEN, "This admin account is blocked");
  }

  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  const jwtPayload = { id: user.id, role: user.role, email: user.email };
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "1d",
  });

  return { accessToken };
};

// ---------- users ----------
const getAllUsers = async (query: IUserQuery) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(query);

  const andConditions: UserWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: query.searchTerm, mode: "insensitive" } },
        { email: { contains: query.searchTerm, mode: "insensitive" } },
        { phone: { contains: query.searchTerm, mode: "insensitive" } },
      ],
    });
  }

  if (query.role) {
    andConditions.push({ role: query.role as Role });
  }

  if (query.activeStatus) {
    andConditions.push({ activeStatus: query.activeStatus as ActiveStatus });
  }

  const where = { AND: andConditions };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      take: limit,
      skip,
      orderBy: { [sortBy]: sortOrder },
      omit: { password: true },
      include: {
        technicianProfile: true,
        _count: { select: { bookings: true, payments: true, reviews: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { data: users, meta: buildMeta(page, limit, total) };
};

const getUserById = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: { password: true },
    include: {
      technicianProfile: {
        include: { services: { include: { category: true } }, availabilities: true },
      },
      _count: { select: { bookings: true, payments: true, reviews: true } },
    },
  });

  return user;
};

// ban / unban. Admin accounts are deliberately untouchable so the platform
// can never be locked out of its own dashboard.
const updateUserStatus = async (userId: string, activeStatus: ActiveStatus) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  if (user.role === Role.ADMIN) {
    throw new AppError(httpStatus.BAD_REQUEST, "An admin account can not be blocked");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { activeStatus },
    omit: { password: true },
  });

  return updated;
};

// mark a technician as verified after checking their documents
const verifyTechnician = async (technicianId: string, isVerified: boolean) => {
  await prisma.technicianProfile.findUniqueOrThrow({ where: { id: technicianId } });

  const updated = await prisma.technicianProfile.update({
    where: { id: technicianId },
    data: { isVerified },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return updated;
};

// ---------- bookings ----------
const getAllBookings = async (query: IAdminBookingQuery) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(query);

  const andConditions: BookingWhereInput[] = [];

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
        customer: { select: { id: true, name: true, email: true } },
        technician: { include: { user: { select: { id: true, name: true, email: true } } } },
        service: { include: { category: true } },
        payment: true,
        review: true,
      },
    }),
    prisma.booking.count({ where }),
  ]);

  return { data: bookings, meta: buildMeta(page, limit, total) };
};

// ---------- payments ----------
const getAllPayments = async (query: IAdminBookingQuery) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(query);

  const andConditions: PaymentWhereInput[] = [];

  if (query.status) {
    andConditions.push({ status: query.status as PaymentStatus });
  }

  const where = { AND: andConditions };

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      take: limit,
      skip,
      orderBy: { [sortBy]: sortOrder },
      include: {
        customer: { select: { id: true, name: true, email: true } },
        booking: {
          select: { id: true, status: true, service: { select: { title: true } } },
        },
      },
    }),
    prisma.payment.count({ where }),
  ]);

  return { data: payments, meta: buildMeta(page, limit, total) };
};

// ---------- dashboard ----------
const getDashboardStats = async () => {
  const stats = await prisma.$transaction(async (tx) => {
    const [
      totalUsers,
      totalCustomers,
      totalTechnicians,
      blockedUsers,
      totalCategories,
      totalServices,
      totalBookings,
      completedBookings,
      cancelledBookings,
      revenue,
    ] = await Promise.all([
      tx.user.count(),
      tx.user.count({ where: { role: Role.CUSTOMER } }),
      tx.user.count({ where: { role: Role.TECHNICIAN } }),
      tx.user.count({ where: { activeStatus: ActiveStatus.BLOCKED } }),
      tx.category.count(),
      tx.service.count(),
      tx.booking.count(),
      tx.booking.count({ where: { status: BookingStatus.COMPLETED } }),
      tx.booking.count({ where: { status: BookingStatus.CANCELLED } }),
      tx.payment.aggregate({
        where: { status: PaymentStatus.COMPLETED },
        _sum: { amount: true },
        _count: { id: true },
      }),
    ]);

    return {
      totalUsers,
      totalCustomers,
      totalTechnicians,
      blockedUsers,
      totalCategories,
      totalServices,
      totalBookings,
      completedBookings,
      cancelledBookings,
      successfulPayments: revenue._count.id,
      totalRevenue: revenue._sum.amount ?? 0,
    };
  });

  return stats;
};

export const adminService = {
  createAdmin,
  loginAdmin,
  getAllUsers,
  getUserById,
  updateUserStatus,
  verifyTechnician,
  getAllBookings,
  getAllPayments,
  getDashboardStats,
};