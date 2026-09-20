import { Request, Response } from "express";
import httpStatus from "http-status";

// keeps the same { success, message, errorDetails } shape as every other error
export const notFound = (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    statusCode: httpStatus.NOT_FOUND,
    message: "Route not found",
    errorDetails: [
      {
        path: req.originalUrl,
        message: `The requested route '${req.method} ${req.originalUrl}' does not exist on this server`,
      },
    ],
  });
};
