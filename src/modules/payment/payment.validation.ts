import { z } from "zod";

const createPaymentSchema = z.object({
  bookingId: z.uuid("bookingId must be a valid uuid"),
});

const confirmPaymentSchema = z
  .object({
    sessionId: z.string().min(1, "sessionId can not be empty").optional(),
    transactionId: z.string().min(1, "transactionId can not be empty").optional(),
  })
  .refine((data) => Boolean(data.sessionId || data.transactionId), {
    message: "Provide either sessionId or transactionId to confirm a payment",
    path: ["sessionId"],
  });

export const paymentValidation = {
  createPaymentSchema,
  confirmPaymentSchema,
};
