import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import { Prisma } from "../../generated/prisma/client";
import { AppError } from "../utils/AppError";
import config from "../config";

type TErrorDetail = {
  path: string | number;
  message: string;
};

/**
 * Single place where every error in the app becomes JSON.
 * Response shape is always:
 * { success: false, statusCode, message, errorDetails }
 */
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // keep the raw error visible in the terminal while developing
  if (config.node_env === "development") {
    console.log("Error : ", err);
  }

  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message: string = err.message || "Something went wrong!";
  let errorDetails: TErrorDetail[] = [
    {
      path: "",
      message: err.message || "Something went wrong!",
    },
  ];

  // ---------- 1. Zod validation errors ----------
  if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation Error";
    errorDetails = err.issues.map((issue) => ({
      path: issue.path[issue.path.length - 1] ?? "",
      message: issue.message,
    }));
  }

  // ---------- 2. Our own thrown AppError ----------
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = [{ path: "", message: err.message }];
  }

  // ---------- 3. Prisma validation (wrong field type / missing field) ----------
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "You have provided an incorrect field type or missing required fields";
    errorDetails = [{ path: "", message }];
  }

  // ---------- 4. Prisma known request errors ----------
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target = (err.meta?.target as string[]) || [];
      statusCode = httpStatus.CONFLICT;
      message = "Duplicate Key Error";
      errorDetails = [
        {
          path: target[0] ?? "",
          message: `A record with this ${target.join(", ") || "value"} already exists`,
        },
      ];
    } else if (err.code === "P2003") {
      statusCode = httpStatus.BAD_REQUEST;
      message = "Foreign Key constraint failed";
      errorDetails = [
        { path: "", message: "The related record you referenced does not exist" },
      ];
    } else if (err.code === "P2025") {
      statusCode = httpStatus.NOT_FOUND;
      message = "Record not found";
      errorDetails = [
        {
          path: "",
          message:
            "The operation failed because it depends on one or more records that were required but not found",
        },
      ];
    } else {
      statusCode = httpStatus.BAD_REQUEST;
      message = "Database request error";
      errorDetails = [{ path: "", message: err.message }];
    }
  }

  // ---------- 5. Prisma initialization errors ----------
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = httpStatus.UNAUTHORIZED;
      message = "Authentication failed against the database server. Please check your credentials";
    } else if (err.errorCode === "P1001") {
      statusCode = httpStatus.BAD_GATEWAY;
      message = "Can't reach the database server";
    } else {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
      message = "Database initialization failed";
    }
    errorDetails = [{ path: "", message }];
  }

  // ---------- 6. Prisma unknown request errors ----------
  else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = "An error occurred during query execution";
    errorDetails = [{ path: "", message }];
  }

  // ---------- 7. JWT errors ----------
  else if (err.name === "JsonWebTokenError") {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Invalid token. Please log in again";
    errorDetails = [{ path: "", message }];
  } else if (err.name === "TokenExpiredError") {
    statusCode = httpStatus.UNAUTHORIZED;
    message = "Your session has expired. Please log in again";
    errorDetails = [{ path: "", message }];
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorDetails,
    ...(config.node_env === "development" && { stack: err.stack }),
  });
};
