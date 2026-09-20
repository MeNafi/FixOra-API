import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { ICreateCategory, IUpdateCategory } from "./category.interface";

// "Appliance Repair" -> "appliance-repair"
const toSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// public - only active categories are browsable
const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: { _count: { select: { services: true } } },
  });

  return categories;
};

// admin - includes inactive categories too
const getAllCategoriesForAdmin = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { services: true } } },
  });

  return categories;
};

const createCategory = async (payload: ICreateCategory) => {
  const slug = toSlug(payload.name);

  const isExist = await prisma.category.findFirst({
    where: { OR: [{ name: payload.name }, { slug }] },
  });

  if (isExist) {
    throw new AppError(httpStatus.CONFLICT, "A category with this name already exists");
  }

  const category = await prisma.category.create({
    data: { ...payload, slug },
  });

  return category;
};

const updateCategory = async (categoryId: string, payload: IUpdateCategory) => {
  await prisma.category.findUniqueOrThrow({ where: { id: categoryId } });

  // renaming a category must keep its slug in sync
  const slug = payload.name ? toSlug(payload.name) : undefined;

  if (slug) {
    const clash = await prisma.category.findFirst({
      where: { slug, NOT: { id: categoryId } },
    });

    if (clash) {
      throw new AppError(httpStatus.CONFLICT, "Another category already uses this name");
    }
  }

  const category = await prisma.category.update({
    where: { id: categoryId },
    data: { ...payload, ...(slug ? { slug } : {}) },
  });

  return category;
};

// a category that still has services is deactivated rather than destroyed,
// so existing bookings never lose their reference
const deleteCategory = async (categoryId: string) => {
  const category = await prisma.category.findUniqueOrThrow({
    where: { id: categoryId },
    include: { _count: { select: { services: true } } },
  });

  if (category._count.services > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This category still has services attached. Deactivate it instead of deleting it",
    );
  }

  await prisma.category.delete({ where: { id: categoryId } });
};

export const categoryService = {
  getAllCategories,
  getAllCategoriesForAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
};
