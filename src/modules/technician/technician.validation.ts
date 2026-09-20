import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const updateProfileSchema = z.object({
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
  nidNumber: z.string().max(50, "NID number is too long").optional(),
  isAvailable: z.boolean().optional(),
});

const availabilitySlotSchema = z
  .object({
    dayOfWeek: z.enum(
      ["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
      { error: "dayOfWeek must be a valid week day in uppercase" },
    ),
    startTime: z
      .string({ error: "startTime is required" })
      .regex(timeRegex, "startTime must be in 24-hour HH:mm format"),
    endTime: z
      .string({ error: "endTime is required" })
      .regex(timeRegex, "endTime must be in 24-hour HH:mm format"),
    isActive: z.boolean().optional(),
  })
  .refine((slot) => slot.startTime < slot.endTime, {
    message: "startTime must be earlier than endTime",
    path: ["startTime"],
  });

const updateAvailabilitySchema = z.object({
  slots: z
    .array(availabilitySlotSchema)
    .min(1, "Provide at least one availability slot")
    .max(50, "Too many availability slots"),
});

const updateBookingStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "DECLINED", "IN_PROGRESS", "COMPLETED"], {
    error: "status must be one of ACCEPTED, DECLINED, IN_PROGRESS or COMPLETED",
  }),
  reason: z.string().max(500, "Reason is too long").optional(),
});

export const technicianValidation = {
  updateProfileSchema,
  updateAvailabilitySchema,
  updateBookingStatusSchema,
};
