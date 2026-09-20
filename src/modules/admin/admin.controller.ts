import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";

// POST /api/admin/register
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.createAdmin(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Admin account registered successfully",
    data: result,
  });
});

// POST /api/admin/login
const loginAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.loginAdmin(req.body);

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin logged in successfully",
    data: result,
  });
});

// POST /api/admin/logout
const logoutAdmin = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken");

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Admin logged out successfully",
    data: null,
  });
});

// GET /api/admin/users
const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await adminService.getAllUsers(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

// GET /api/admin/users/:id
const getUserById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await adminService.getUserById(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: result,
  });
});

// PATCH /api/admin/users/:id
const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await adminService.updateUserStatus(
    req.params.id as string,
    req.body.activeStatus,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `User status updated to ${req.body.activeStatus} successfully`,
    data: result,
  });
});

// PATCH /api/admin/technicians/:id/verify
const verifyTechnician = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await adminService.verifyTechnician(req.params.id as string, req.body.isVerified);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: req.body.isVerified
      ? "Technician verified successfully"
      : "Technician verification removed",
    data: result,
  });
});

// GET /api/admin/bookings
const getAllBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await adminService.getAllBookings(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All bookings retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

// GET /api/admin/payments
const getAllPayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await adminService.getAllPayments(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All payments retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

// GET /api/admin/stats
const getDashboardStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await adminService.getDashboardStats();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Dashboard stats retrieved successfully",
    data: result,
  });
});

export const adminController = {
  createAdmin,
  loginAdmin,
  logoutAdmin,
  getAllUsers,
  getUserById,
  updateUserStatus,
  verifyTechnician,
  getAllBookings,
  getAllPayments,
  getDashboardStats,
};