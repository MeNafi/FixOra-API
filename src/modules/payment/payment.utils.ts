import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { BookingStatus, PaymentStatus } from "../../../generated/prisma/enums";

/**
 * Marks a payment (and its booking) as paid.
 *
 * Both the Stripe webhook and the manual /payments/confirm route funnel through
 * here, so the outcome is identical whichever path Stripe takes to reach us.
 * It is deliberately idempotent: Stripe retries webhooks, and the browser may
 * hit the success URL at the same time the webhook arrives.
 */
export const markPaymentCompleted = async (session: Stripe.Checkout.Session) => {
  const bookingId = session.metadata?.bookingId;

  if (!bookingId) {
    console.log("Webhook: checkout session has no bookingId in its metadata");
    return;
  }

  const payment = await prisma.payment.findUnique({ where: { bookingId } });

  if (!payment) {
    console.log(`Webhook: no payment record exists for booking ${bookingId}`);
    return;
  }

  // already processed - nothing left to do
  if (payment.status === PaymentStatus.COMPLETED) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.COMPLETED,
        paidAt: new Date(),
        method: session.payment_method_types?.[0] ?? "card",
        gatewayResponse: {
          sessionId: session.id,
          paymentIntent: (session.payment_intent as string) ?? null,
          paymentStatus: session.payment_status,
          amountTotal: session.amount_total,
          currency: session.currency,
        },
      },
    });

    await tx.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.PAID },
    });
  });
};

// Called when a checkout session expires or the payment is rejected.
export const markPaymentFailed = async (session: Stripe.Checkout.Session) => {
  const bookingId = session.metadata?.bookingId;

  if (!bookingId) return;

  const payment = await prisma.payment.findUnique({ where: { bookingId } });

  // never downgrade a payment that already succeeded
  if (!payment || payment.status === PaymentStatus.COMPLETED) return;

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: PaymentStatus.FAILED,
      gatewayResponse: {
        sessionId: session.id,
        paymentStatus: session.payment_status,
      },
    },
  });
};
