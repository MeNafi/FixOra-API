import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { technicianService } from "./technician.service";
import { BookingStatus } from "../../../generated/prisma/enums";

// GET /api/technicians
const getAllTechnicians = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await technicianService.getAllTechnicians(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technicians retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

// GET /api/technicians/:id
const getTechnicianById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await technicianService.getTechnicianById(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technician profile retrieved successfully",
    data: result,
  });
});

// PUT /api/technician/profile
const updateMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await technicianService.updateMyProfile(req.user?.id as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Technician profile updated successfully",
    data: result,
  });
});

// PUT /api/technician/availability
const updateMyAvailability = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await technicianService.updateMyAvailability(
    req.user?.id as string,
    req.body.slots,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Availability updated successfully",
    data: result,
  });
});

// GET /api/technician/availability
const getMyAvailability = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await technicianService.getMyAvailability(req.user?.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Availability retrieved successfully",
    data: result,
  });
});

// GET /api/technician/bookings
const getMyBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const status = req.query.status as BookingStatus | undefined;

  const result = await technicianService.getMyBookings(req.user?.id as string, status);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings retrieved successfully",
    data: result,
  });
});

// PATCH /api/technician/bookings/:id
const updateBookingStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await technicianService.updateBookingStatus(
    req.user?.id as string,
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `Booking marked as ${req.body.status} successfully`,
    data: result,
  });
});

export const technicianController = {
  getAllTechnicians,
  getTechnicianById,
  updateMyProfile,
  updateMyAvailability,
  getMyAvailability,
  getMyBookings,
  updateBookingStatus,
};
