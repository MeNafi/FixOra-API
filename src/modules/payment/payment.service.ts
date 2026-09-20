import httpStatus from "http-status";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { AppError } from "../../utils/AppError";
import { buildMeta, calculatePagination } from "../../utils/pagination";
import { generateTransactionId } from "../../utils/transactionId";
import {
  BookingStatus,
  PaymentProvider,
  PaymentStatus,
  Role,
} from "../../../generated/prisma/enums";
import { PaymentWhereInput } from "../../../generated/prisma/models";
import { IPaymentQuery } from "./payment.interface";
import { markPaymentCompleted, markPaymentFailed } from "./payment.utils";

/**
 * CUSTOMER : start a real Stripe Checkout session for an ACCEPTED booking.
 *
 * The amount comes from booking.totalAmount, which was frozen when the booking
 * was created - never from the request body, so a client can't choose its own price.
 */
const createPayment = async (customerId: string, bookingId: string) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: {
      service: true,
      payment: true,
      customer: { select: { id: true, name: true, email: true } },
    },
  });

  if (booking.customerId !== customerId) {
    throw new AppError(httpStatus.FORBIDDEN, "You can only pay for your own bookings");
  }

  if (booking.status !== BookingStatus.ACCEPTED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      booking.status === BookingStatus.REQUESTED
        ? "The technician has not accepted this booking yet"
        : `Payment is only possible for ACCEPTED bookings. This booking is ${booking.status}`,
    );
  }

  if (booking.payment?.status === PaymentStatus.COMPLETED) {
    throw new AppError(httpStatus.BAD_REQUEST, "This booking has already been paid for");
  }

  const currency = config.stripe_currency;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: booking.customer.email,
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: booking.service.title,
            ...(booking.service.description
              ? { description: booking.service.description.slice(0, 250) }
              : {}),
          },
          // Stripe works in the smallest currency unit
          unit_amount: Math.round(booking.totalAmount * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${config.app_url}/payment/success?bookingId=${booking.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.app_url}/payment/cancel?bookingId=${booking.id}`,
    metadata: {
      bookingId: booking.id,
      customerId: booking.customerId,
    },
  });

  // upsert, so a customer who abandoned checkout and came back reuses one payment row
  const payment = await prisma.payment.upsert({
    where: { bookingId: booking.id },
    create: {
      transactionId: generateTransactionId(),
      bookingId: booking.id,
      customerId: booking.customerId,
      amount: booking.totalAmount,
      currency: currency.toUpperCase(),
      provider: PaymentProvider.STRIPE,
      status: PaymentStatus.PENDING,
      gatewaySessionId: session.id,
    },
    update: {
      amount: booking.totalAmount,
      currency: currency.toUpperCase(),
      status: PaymentStatus.PENDING,
      gatewaySessionId: session.id,
    },
  });

  return {
    paymentId: payment.id,
    transactionId: payment.transactionId,
    amount: payment.amount,
    currency: payment.currency,
    sessionId: session.id,
    paymentUrl: session.url,
  };
};

/**
 * Stripe -> server. The raw body plus the stripe-signature header prove the call
 * really came from Stripe, so this route needs no JWT.
 */
const handleWebhook = async (payload: Buffer, signature: string) => {
  if (!signature) {
    throw new AppError(httpStatus.BAD_REQUEST, "Missing stripe-signature header");
  }

  const event = stripe.webhooks.constructEvent(payload, signature, config.stripe_webhook_secret);

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      await markPaymentCompleted(event.data.object);
      break;

    case "checkout.session.expired":
    case "checkout.session.async_payment_failed":
      await markPaymentFailed(event.data.object);
      break;

    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
      break;
  }
};

/**
 * Fallback verification used by the success redirect, for when the webhook is
 * not running (for example during a local demo without the Stripe CLI).
 *
 * It asks Stripe directly whether the session was paid - a client claiming
 * success is never enough on its own.
 */
const confirmPayment = async (sessionId?: string, transactionId?: string) => {
  let resolvedSessionId = sessionId;

  if (!resolvedSessionId) {
    const existing = await prisma.payment.findUnique({ where: { transactionId } });

    if (!existing?.gatewaySessionId) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "No Stripe checkout session is linked to this transaction",
      );
    }

    resolvedSessionId = existing.gatewaySessionId;
  }

  const session = await stripe.checkout.sessions.retrieve(resolvedSessionId);

  if (session.payment_status !== "paid") {
    await markPaymentFailed(session);
    throw new AppError(httpStatus.BAD_REQUEST, "This payment has not been completed yet");
  }

  await markPaymentCompleted(session);

  const payment = await prisma.payment.findUniqueOrThrow({
    where: { bookingId: session.metadata?.bookingId as string },
    include: {
      booking: { include: { service: { select: { id: true, title: true } } } },
    },
  });

  return payment;
};

// ---------- payment history ----------
const getMyPayments = async (userId: string, role: Role, query: IPaymentQuery) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(query);

  const andConditions: PaymentWhereInput[] = [];

  if (role === Role.CUSTOMER) {
    andConditions.push({ customerId: userId });
  } else if (role === Role.TECHNICIAN) {
    // a technician sees the payments made against their own jobs
    const profile = await prisma.technicianProfile.findUnique({ where: { userId } });

    if (!profile) {
      throw new AppError(httpStatus.NOT_FOUND, "No technician profile exists for this account");
    }

    andConditions.push({ booking: { technicianId: profile.id } });
  }

  if (query.status) {
    andConditions.push({ status: query.status as PaymentStatus });
  }

  const where = { AND: andConditions };

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      take: limit,
      skip,
      orderBy: { [sortBy]: sortOrder },
      include: {
        booking: {
          include: { service: { select: { id: true, title: true, price: true } } },
        },
      },
    }),
    prisma.payment.count({ where }),
  ]);

  return { data: payments, meta: buildMeta(page, limit, total) };
};

const getPaymentById = async (paymentId: string, userId: string, role: Role) => {
  const payment = await prisma.payment.findUniqueOrThrow({
    where: { id: paymentId },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      booking: {
        include: {
          service: { include: { category: true } },
          technician: { include: { user: { select: { id: true, name: true } } } },
        },
      },
    },
  });

  const isOwner = payment.customerId === userId;
  const isAssignedTechnician = payment.booking.technician.userId === userId;

  if (role !== Role.ADMIN && !isOwner && !isAssignedTechnician) {
    throw new AppError(httpStatus.FORBIDDEN, "You don't have permission to view this payment");
  }

  return payment;
};

export const paymentService = {
  createPayment,
  handleWebhook,
  confirmPayment,
  getMyPayments,
  getPaymentById,
};
