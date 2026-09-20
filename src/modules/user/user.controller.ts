import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { userService } from "./user.service";

// GET /api/users/me
const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await userService.getMyProfileFromDB(req.user?.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile retrieved successfully",
    data: result,
  });
});

// PUT /api/users/me
const updateMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await userService.updateMyProfileInDB(req.user?.id as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully",
    data: result,
  });
});

export const userController = {
  getMyProfile,
  updateMyProfile,
};
