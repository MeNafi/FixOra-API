import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { technicianController } from "./technician.controller";
import { technicianValidation } from "./technician.validation";

// ---------- PUBLIC : /api/technicians ----------
const publicRouter = Router();

publicRouter.get("/", technicianController.getAllTechnicians);
publicRouter.get("/:id", technicianController.getTechnicianById);

// ---------- TECHNICIAN ONLY : /api/technician ----------
const privateRouter = Router();

privateRouter.put(
  "/profile",
  auth(Role.TECHNICIAN),
  validateRequest(technicianValidation.updateProfileSchema),
  technicianController.updateMyProfile,
);

privateRouter.get("/availability", auth(Role.TECHNICIAN), technicianController.getMyAvailability);

privateRouter.put(
  "/availability",
  auth(Role.TECHNICIAN),
  validateRequest(technicianValidation.updateAvailabilitySchema),
  technicianController.updateMyAvailability,
);

privateRouter.get("/bookings", auth(Role.TECHNICIAN), technicianController.getMyBookings);

privateRouter.patch(
  "/bookings/:id",
  auth(Role.TECHNICIAN),
  validateRequest(technicianValidation.updateBookingStatusSchema),
  technicianController.updateBookingStatus,
);

export const technicianPublicRoutes = publicRouter;
export const technicianRoutes = privateRouter;
