import { z } from "zod";

// 1. Admin Registration Validation
const createAdminSchema = z.object({
  name: z.string({ message: "Name must be a string" }).min(1, "Name is required"),
  email: z
    .string({ message: "Email must be a string" })
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string({ message: "Password must be a string" })
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

// 2. Admin Login Validation
const adminLoginSchema = z.object({
  email: z
    .string({ message: "Email must be a string" })
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string({ message: "Password must be a string" })
    .min(1, "Password is required"),
});

// 3. User Status Update Validation
const updateUserStatusSchema = z.object({
  activeStatus: z.enum(["ACTIVE", "BLOCKED"], {
    message: "activeStatus must be either ACTIVE or BLOCKED",
  }),
});

// 4. Technician Verification Validation
const verifyTechnicianSchema = z.object({
  isVerified: z.boolean({
    message: "isVerified must be true or false",
  }),
});

export const adminValidation = {
  createAdminSchema,
  adminLoginSchema,
  updateUserStatusSchema,
  verifyTechnicianSchema,
};