import { NextFunction, Request, RequestHandler, Response } from "express";

// wraps every async controller so thrown errors reach the globalErrorHandler
export const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
