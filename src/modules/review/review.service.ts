import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { BookingStatus } from "../../../generated/prisma/enums";
import { ICreateReview } from "./review.interface";

// recalculates a technician's rating from the reviews table itself, so the
// cached avgRating/totalReviews can never drift away from reality
const recalculateTechnicianRating = async (tx: any, technicianId: string) => {
  const aggregate = await tx.review.aggregate({
    where: { technicianId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await tx.technicianProfile.update({
    where: { id: technicianId },
    data: {
      avgRating: Number((aggregate._avg.rating ?? 0).toFixed(2)),
      totalReviews: aggregate._count.rating,
    },
  });
};

// ---------- CUSTOMER : leave a review ----------
const createReview = async (customerId: string, payload: ICreateReview) => {
  const { bookingId, rating, comment } = payload;

  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: { review: true },
  });

  if (booking.customerId !== customerId) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only review your own bookings");
  }

  if (booking.status !== BookingStatus.COMPLETED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You can only leave a review once the job has been completed",
    );
  }

  if (booking.review) {
    throw new AppError(httpStatus.CONFLICT, "You have already reviewed this booking");
  }

  // creating the review and refreshing the technician's rating must succeed together
  const result = await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        bookingId,
        customerId,
        technicianId: booking.technicianId,
        rating,
        comment,
      },
      include: {
        customer: { select: { id: true, name: true, profilePhoto: true } },
      },
    });

    await recalculateTechnicianRating(tx, booking.technicianId);

    return review;
  });

  return result;
};

// ---------- PUBLIC : reviews of one technician ----------
const getTechnicianReviews = async (technicianId: string) => {
  await prisma.technicianProfile.findUniqueOrThrow({ where: { id: technicianId } });

  const reviews = await prisma.review.findMany({
    where: { technicianId },
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { id: true, name: true, profilePhoto: true } },
      booking: {
        select: { id: true, scheduledAt: true, service: { select: { title: true } } },
      },
    },
  });

  return reviews;
};

// ---------- CUSTOMER : my own reviews ----------
const getMyReviews = async (customerId: string) => {
  const reviews = await prisma.review.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    include: {
      technician: { include: { user: { select: { id: true, name: true } } } },
      booking: { select: { id: true, service: { select: { title: true } } } },
    },
  });

  return reviews;
};

export const reviewService = {
  createReview,
  getTechnicianReviews,
  getMyReviews,
};
