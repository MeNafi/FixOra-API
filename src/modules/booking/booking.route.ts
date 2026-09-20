import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { bookingController } from "./booking.controller";
import { bookingValidation } from "./booking.validation";

const router = Router();

// create booking part
router.post(
  "/",
  auth(Role.CUSTOMER),
  validateRequest(bookingValidation.createBookingSchema),
  bookingController.createBooking,
);

router.get("/", auth(Role.CUSTOMER, Role.TECHNICIAN), bookingController.getMyBookings);

// booking details using booking id 
router.get(
  "/:id",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  bookingController.getBookingById,
);

// booking cancel part
router.patch(
  "/:id/cancel",
  auth(Role.CUSTOMER),
  validateRequest(bookingValidation.cancelBookingSchema),
  bookingController.cancelBooking,
);

export const bookingRoutes = router;
