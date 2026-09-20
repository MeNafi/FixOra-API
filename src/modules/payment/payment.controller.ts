import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";
import { Role } from "../../../generated/prisma/enums";

// POST /api/payments/create
const createPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await paymentService.createPayment(req.user?.id as string, req.body.bookingId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Payment session created. Redirect the customer to paymentUrl to pay",
    data: result,
  });
});

// POST /api/payments/webhook  (called by Stripe, raw body)
const handleWebhook = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const signature = req.headers["stripe-signature"] as string;

  await paymentService.handleWebhook(req.body as Buffer, signature);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Webhook handled successfully",
    data: null,
  });
});

// POST /api/payments/confirm
const confirmPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { sessionId, transactionId } = req.body;

  const result = await paymentService.confirmPayment(sessionId, transactionId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment verified with Stripe and the booking is now PAID",
    data: result,
  });
});

// GET /api/payments
const getMyPayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await paymentService.getMyPayments(
    req.user?.id as string,
    req.user?.role as Role,
    req.query,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment history retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

// GET /api/payments/:id
const getPaymentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await paymentService.getPaymentById(
    req.params.id as string,
    req.user?.id as string,
    req.user?.role as Role,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment retrieved successfully",
    data: result,
  });
});

export const paymentController = {
  createPayment,
  handleWebhook,
  confirmPayment,
  getMyPayments,
  getPaymentById,
};
