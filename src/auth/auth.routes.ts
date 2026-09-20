import { Router } from "express";
import { authController } from "./auth.controller";
import { authValidation } from "./auth.validation";
import { validateRequest } from "../middlewares/validateRequest";
import { auth } from "../middlewares/auth";
import { Role } from "../../generated/prisma/enums";

const router = Router();

// register a new customer or technician
router.post(
  "/register",
  validateRequest(authValidation.registerUserSchema),
  authController.registerUser,
);

// login and receive a JWT
router.post("/login", validateRequest(authValidation.loginUserSchema), authController.loginUser);

// issue a new access token from the refresh token
router.post("/refresh-token", authController.refreshToken);

// current authenticated user
router.get(
  "/me",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  authController.getMe,
);

router.post(
  "/change-password",
  auth(Role.CUSTOMER, Role.TECHNICIAN, Role.ADMIN),
  validateRequest(authValidation.changePasswordSchema),
  authController.changePassword,
);

router.post("/logout", authController.logout);

export const authRoutes = router;
