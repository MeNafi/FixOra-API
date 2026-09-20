import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";

// POST /api/reviews
const createReview = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await reviewService.createReview(req.user?.id as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Review submitted successfully",
    data: result,
  });
});

// GET /api/reviews/technician/:technicianId
const getTechnicianReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await reviewService.getTechnicianReviews(req.params.technicianId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Technician reviews retrieved successfully",
      data: result,
    });
  },
);

// GET /api/reviews/my-reviews
const getMyReviews = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await reviewService.getMyReviews(req.user?.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Your reviews retrieved successfully",
    data: result,
  });
});

export const reviewController = {
  createReview,
  getTechnicianReviews,
  getMyReviews,
};
