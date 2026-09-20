import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { serviceService } from "./service.service";

// GET /api/services
const getAllServices = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await serviceService.getAllServices(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Services retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

// GET /api/services/:id
const getServiceById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await serviceService.getServiceById(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service retrieved successfully",
    data: result,
  });
});

// POST /api/services
const createService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await serviceService.createService(req.user?.id as string, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Service created successfully",
    data: result,
  });
});

// GET /api/services/my-services
const getMyServices = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await serviceService.getMyServices(req.user?.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Your services retrieved successfully",
    data: result,
  });
});

// PATCH /api/services/:id
const updateService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await serviceService.updateService(
    req.user?.id as string,
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service updated successfully",
    data: result,
  });
});

// DELETE /api/services/:id
const deleteService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await serviceService.deleteService(req.user?.id as string, req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Service deleted successfully",
    data: null,
  });
});

export const serviceController = {
  getAllServices,
  getServiceById,
  createService,
  getMyServices,
  updateService,
  deleteService,
};
