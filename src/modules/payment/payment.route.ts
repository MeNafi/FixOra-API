import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { paymentController } from "./payment.controller";
import { paymentValidation } from "./payment.validation";

const router = Router();

// Stripe calls this one. No auth guard: authenticity is proven by the
// stripe-signature header, which is verified inside the service.
router.post("/webhook", paymentController.handleWebhook);

router.post(
  "/create",
  auth(Role.CUSTOMER),
  validateRequest(paymentValidation.createPaymentSchema),
  paymentController.createPayment,
);

router.post(
  "/confirm",
  validateRequest(paymentValidation.confirmPaymentSchema),
  paymentController.confirmPayment,
);

router.get("/", auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN), paymentController.getMyPayments);

router.get(
  "/:id",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  paymentController.getPaymentById,
);

export const paymentRoutes = router;
