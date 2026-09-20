import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { bookingService } from "./booking.service";
import { Role } from "../../../generated/prisma/enums";

// POST /api/bookings
const createBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await bookingService.createBooking(req.user?.id as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Booking created successfully",
    data: result,
  });
});

// GET /api/bookings
const getMyBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await bookingService.getMyBookings(
    req.user?.id as string,
    req.user?.role as Role,
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Bookings retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

// GET /api/bookings/:id
const getBookingById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await bookingService.getBookingById(
    req.params.id as string,
    req.user?.id as string,
    req.user?.role as Role,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking retrieved successfully",
    data: result,
  });
});

// PATCH /api/bookings/:id/cancel
const cancelBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await bookingService.cancelBooking(
    req.params.id as string,
    req.user?.id as string,
    req.body?.reason,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking cancelled successfully",
    data: result,
  });
});

export const bookingController = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};
