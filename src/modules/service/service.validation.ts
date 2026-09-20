import { z } from "zod";

const createServiceSchema = z.object({
  title: z
    .string({ error: "Service title is required" })
    .min(3, "Title must be at least 3 characters long")
    .max(255, "Title can not be longer than 255 characters"),

  description: z.string().max(2000, "Description is too long").optional(),

  price: z
    .number({ error: "Price is required and must be a number" })
    .positive("Price must be greater than 0"),

  durationMin: z
    .number()
    .int("Duration must be a whole number of minutes")
    .min(15, "Duration must be at least 15 minutes")
    .max(1440, "Duration can not exceed 24 hours")
    .optional(),

  categoryId: z.uuid("categoryId must be a valid uuid"),

  isActive: z.boolean().optional(),
});

const updateServiceSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(255, "Title can not be longer than 255 characters")
    .optional(),

  description: z.string().max(2000, "Description is too long").optional(),
  price: z.number().positive("Price must be greater than 0").optional(),
  durationMin: z
    .number()
    .int("Duration must be a whole number of minutes")
    .min(15, "Duration must be at least 15 minutes")
    .max(1440, "Duration can not exceed 24 hours")
    .optional(),
  categoryId: z.uuid("categoryId must be a valid uuid").optional(),
  isActive: z.boolean().optional(),
});

export const serviceValidation = {
  createServiceSchema,
  updateServiceSchema,
};
