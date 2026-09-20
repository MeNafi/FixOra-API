import { z } from "zod";

const createReviewSchema = z.object({
  bookingId: z.uuid("bookingId must be a valid uuid"),

  rating: z
    .number({ error: "Rating is required and must be a number" })
    .int("Rating must be a whole number")
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),

  comment: z.string().max(1000, "Comment can not be longer than 1000 characters").optional(),
});

const updateReviewSchema = z.object({
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5")
    .optional(),

  comment: z.string().max(1000, "Comment can not be longer than 1000 characters").optional(),
});

export const reviewValidation = {
  createReviewSchema,
  updateReviewSchema,
};
