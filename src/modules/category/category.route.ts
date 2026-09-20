import { Router } from "express";
import { categoryController } from "./category.controller";

const router = Router();

// public - browse active service categories
router.get("/", categoryController.getAllCategories);

export const categoryRoutes = router;
