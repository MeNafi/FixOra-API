import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { serviceController } from "./service.controller";
import { serviceValidation } from "./service.validation";

const router = Router();

// declared before "/:id" so the literal path is not swallowed by the param route
router.get("/my-services", auth(Role.TECHNICIAN), serviceController.getMyServices);

// public browsing
router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getServiceById);

// technician-owned writes
router.post(
  "/",
  auth(Role.TECHNICIAN),
  validateRequest(serviceValidation.createServiceSchema),
  serviceController.createService,
);

router.patch(
  "/:id",
  auth(Role.TECHNICIAN),
  validateRequest(serviceValidation.updateServiceSchema),
  serviceController.updateService,
);

router.delete("/:id", auth(Role.TECHNICIAN), serviceController.deleteService);

export const serviceRoutes = router;
