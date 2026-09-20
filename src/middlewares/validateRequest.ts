import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

/**
 * Server-side validation middleware.
 *
 * Every route that accepts a body passes its zod schema through here, so no
 * controller ever sees unvalidated input. Parsed (and coerced) data is written
 * back onto req.body so services always receive clean, typed values.
 *
 * ZodErrors are handed to globalErrorHandler, which turns them into the standard
 * { success, message, errorDetails } response with one entry per invalid field.
 */
export const validateRequest = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Same idea, but for query strings (search, filter and pagination params).
export const validateQuery = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.query);
      next();
    } catch (error) {
      next(error);
    }
  };
};
