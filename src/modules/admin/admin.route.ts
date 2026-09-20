import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { adminController } from "./admin.controller";
import { adminValidation } from "./admin.validation";
import { categoryController } from "../category/category.controller";
import { categoryValidation } from "../category/category.validation";

const router = Router();

// ==========================================
// 1. PUBLIC ROUTES 
// ==========================================

// POST /api/admin/register
router.post(
  "/register",
  validateRequest(adminValidation.createAdminSchema),
  adminController.createAdmin
);

// POST /api/admin/login
router.post(
  "/login",
  validateRequest(adminValidation.adminLoginSchema),
  adminController.loginAdmin
);

// POST /api/admin/logout
router.post("/logout", adminController.logoutAdmin);


// ====================
// 2. PROTECTED ROUTES 
// =====================

// one guard for the whole file - every route below is admin-only
router.use(auth(Role.ADMIN));

router.get("/stats", adminController.getDashboardStats);

// ---------- user management ----------
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.patch(
  "/users/:id",
  validateRequest(adminValidation.updateUserStatusSchema),
  adminController.updateUserStatus,
);

router.patch(
  "/technicians/:id/verify",
  validateRequest(adminValidation.verifyTechnicianSchema),
  adminController.verifyTechnician,
);

// ---------- oversight ----------
router.get("/bookings", adminController.getAllBookings);
router.get("/payments", adminController.getAllPayments);

// ---------- service categories ----------
router.get("/categories", categoryController.getAllCategoriesForAdmin);
router.post(
  "/categories",
  validateRequest(categoryValidation.createCategorySchema),
  categoryController.createCategory,
);
router.patch(
  "/categories/:id",
  validateRequest(categoryValidation.updateCategorySchema),
  categoryController.updateCategory,
);
router.delete("/categories/:id", categoryController.deleteCategory);

export const adminRoutes = router;
