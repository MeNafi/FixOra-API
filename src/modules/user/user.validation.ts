import { z } from "zod";

const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(255, "Name can not be longer than 255 characters")
    .optional(),

  phone: z
    .string()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Please provide a valid phone number")
    .optional(),

  address: z.string().max(500, "Address is too long").optional(),
  profilePhoto: z.url("Profile photo must be a valid URL").optional(),
});

export const userValidation = {
  updateProfileSchema,
};
