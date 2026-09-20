import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { reviewController } from "./review.controller";
import { reviewValidation } from "./review.validation";

const router = Router();

router.post(
  "/",
  auth(Role.CUSTOMER),
  validateRequest(reviewValidation.createReviewSchema),
  reviewController.createReview,
);

router.get("/my-reviews", auth(Role.CUSTOMER), reviewController.getMyReviews);

// public - anyone can read a technician's reviews
router.get("/technician/:technicianId", reviewController.getTechnicianReviews);

export const reviewRoutes = router;
