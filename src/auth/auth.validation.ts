import { z } from "zod";

const registerUserSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .min(3, "Name must be at least 3 characters long")
    .max(255, "Name can not be longer than 255 characters"),

  email: z.email("Please provide a valid email address"),

  password: z
    .string({ error: "Password is required" })
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Za-z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),

  phone: z
    .string()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Please provide a valid phone number")
    .optional(),

  address: z.string().max(500, "Address is too long").optional(),
  profilePhoto: z.url("Profile photo must be a valid URL").optional(),

  // ADMIN can never be created from the public register route
  role: z
    .enum(["CUSTOMER", "TECHNICIAN"], {
      error: "Role must be either CUSTOMER or TECHNICIAN",
    })
    .optional(),

  bio: z.string().max(1000, "Bio is too long").optional(),
  skills: z.array(z.string().min(1, "A skill can not be empty")).optional(),
  experienceYears: z
    .number()
    .int("Experience years must be a whole number")
    .min(0, "Experience years can not be negative")
    .max(70, "Experience years looks unrealistic")
    .optional(),
  hourlyRate: z.number().min(0, "Hourly rate can not be negative").optional(),
  location: z.string().max(255, "Location is too long").optional(),
});

const loginUserSchema = z.object({
  email: z.email("Please provide a valid email address"),
  password: z.string({ error: "Password is required" }).min(1, "Password is required"),
});

const changePasswordSchema = z.object({
  oldPassword: z.string({ error: "Old password is required" }).min(1, "Old password is required"),
  newPassword: z
    .string({ error: "New password is required" })
    .min(6, "New password must be at least 6 characters long")
    .regex(/[A-Za-z]/, "New password must contain at least one letter")
    .regex(/[0-9]/, "New password must contain at least one number"),
});

export const authValidation = {
  registerUserSchema,
  loginUserSchema,
  changePasswordSchema,
};
