import { z } from "zod";

const createBookingSchema = z.object({
  serviceId: z.uuid("serviceId must be a valid uuid"),

  scheduledAt: z
    .string({ error: "scheduledAt is required" })
    .refine((value) => !Number.isNaN(Date.parse(value)), "scheduledAt must be a valid ISO date")
    .refine((value) => new Date(value).getTime() > Date.now(), "scheduledAt must be in the future"),

  address: z
    .string({ error: "Service address is required" })
    .min(5, "Address must be at least 5 characters long")
    .max(500, "Address is too long"),

  note: z.string().max(1000, "Note is too long").optional(),
});

const cancelBookingSchema = z.object({
  reason: z.string().max(500, "Reason is too long").optional(),
});



export const bookingValidation = {
  createBookingSchema,
  cancelBookingSchema,
};
