import { PlanStatus, PlanTier } from "@prisma/client";
import Stripe from "stripe";

import { db } from "@/lib/db";
import { env } from "@/lib/env";

export const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY)
  : null;

export async function getOrCreateStripeCustomer(user: {
  id: string;
  email: string;
  stripeCustomerId: string | null;
}) {
  if (!stripe) {
    throw new Error("Stripe is not configured.");
  }

  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: user.email,
    metadata: {
      userId: user.id,
    },
  });

  await db.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

export async function syncSubscriptionFromStripe(input: {
  userId: string;
  stripeSubscriptionId: string | null;
  stripePriceId?: string | null;
  status: PlanStatus;
  currentPeriodStart?: Date | null;
  currentPeriodEnd?: Date | null;
  cancelAtPeriodEnd?: boolean;
}) {
  await db.subscription.upsert({
    where: { userId: input.userId },
    update: {
      stripeSubscriptionId: input.stripeSubscriptionId,
      stripePriceId: input.stripePriceId ?? null,
      status: input.status,
      currentPeriodStart: input.currentPeriodStart ?? null,
      currentPeriodEnd: input.currentPeriodEnd ?? null,
      cancelAtPeriodEnd: input.cancelAtPeriodEnd ?? false,
    },
    create: {
      userId: input.userId,
      stripeSubscriptionId: input.stripeSubscriptionId,
      stripePriceId: input.stripePriceId ?? null,
      status: input.status,
      currentPeriodStart: input.currentPeriodStart ?? null,
      currentPeriodEnd: input.currentPeriodEnd ?? null,
      cancelAtPeriodEnd: input.cancelAtPeriodEnd ?? false,
    },
  });

  const planTier = input.status === PlanStatus.ACTIVE ? PlanTier.HOBBY : PlanTier.FREE;

  await db.user.update({
    where: { id: input.userId },
    data: {
      planTier,
      planStatus: input.status,
    },
  });

  if (planTier === PlanTier.HOBBY) {
    await db.site.updateMany({
      where: { ownerUserId: input.userId },
      data: { expiresAt: null },
    });
  }
}
