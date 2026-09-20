import { z } from "zod";

const createCategorySchema = z.object({
  name: z
    .string({ error: "Category name is required" })
    .min(2, "Category name must be at least 2 characters long")
    .max(120, "Category name can not be longer than 120 characters"),

  description: z.string().max(1000, "Description is too long").optional(),
  icon: z.string().max(255, "Icon is too long").optional(),
  isActive: z.boolean().optional(),
});

const updateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters long")
    .max(120, "Category name can not be longer than 120 characters")
    .optional(),

  description: z.string().max(1000, "Description is too long").optional(),
  icon: z.string().max(255, "Icon is too long").optional(),
  isActive: z.boolean().optional(),
});

export const categoryValidation = {
  createCategorySchema,
  updateCategorySchema,
};
