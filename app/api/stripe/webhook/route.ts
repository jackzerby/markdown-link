import { PlanStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { syncSubscriptionFromStripe, stripe } from "@/lib/stripe";

function toPlanStatus(status: string | null | undefined): PlanStatus {
  switch (status) {
    case "active":
    case "trialing":
      return PlanStatus.ACTIVE;
    case "past_due":
      return PlanStatus.PAST_DUE;
    case "incomplete":
      return PlanStatus.INCOMPLETE;
    case "canceled":
    case "unpaid":
      return PlanStatus.CANCELED;
    default:
      return PlanStatus.NONE;
  }
}

function isDuplicatePrismaError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "P2002";
}

async function resolveUserIdFromCustomer(customer: string | Stripe.Customer | Stripe.DeletedCustomer | null | undefined) {
  if (!customer || typeof customer !== "string") {
    return null;
  }

  const user = await db.user.findFirst({
    where: { stripeCustomerId: customer },
    select: { id: true },
  });

  return user?.id ?? null;
}

async function syncSubscriptionById(subscriptionId: string) {
  if (!stripe) {
    throw new Error("Stripe is not configured.");
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata.userId || (await resolveUserIdFromCustomer(subscription.customer));
  if (!userId) {
    throw new Error(`Unable to resolve user for subscription ${subscription.id}.`);
  }

  await syncSubscriptionFromStripe({
    userId,
    stripeSubscriptionId: subscription.id,
    stripePriceId: subscription.items.data[0]?.price.id ?? null,
    status: toPlanStatus(subscription.status),
    currentPeriodStart: subscription.items.data[0]?.current_period_start
      ? new Date(subscription.items.data[0].current_period_start * 1000)
      : null,
    currentPeriodEnd: subscription.items.data[0]?.current_period_end
      ? new Date(subscription.items.data[0].current_period_end * 1000)
      : null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });
}

async function handleStripeEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = typeof session.subscription === "string" ? session.subscription : null;
      if (subscriptionId) {
        await syncSubscriptionById(subscriptionId);
      }
      return;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata.userId || (await resolveUserIdFromCustomer(subscription.customer));

      if (!userId) {
        throw new Error(`Unable to resolve user for subscription ${subscription.id}.`);
      }

      await syncSubscriptionFromStripe({
        userId,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0]?.price.id ?? null,
        status: toPlanStatus(subscription.status),
        currentPeriodStart: subscription.items.data[0]?.current_period_start
          ? new Date(subscription.items.data[0].current_period_start * 1000)
          : null,
        currentPeriodEnd: subscription.items.data[0]?.current_period_end
          ? new Date(subscription.items.data[0].current_period_end * 1000)
          : null,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      });
      return;
    }
    case "invoice.paid":
    case "invoice.payment_failed": {
      const invoice = event.data.object as { subscription?: string | Stripe.Subscription | null };
      const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : null;
      if (subscriptionId) {
        await syncSubscriptionById(subscriptionId);
      }
      return;
    }
    default:
      return;
  }
}

export async function POST(request: Request) {
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid signature." },
      { status: 400 },
    );
  }

  const userId =
    event.type === "checkout.session.completed"
      ? ((event.data.object as Stripe.Checkout.Session).metadata?.userId ?? null)
      : event.type.startsWith("customer.subscription.")
        ? ((event.data.object as Stripe.Subscription).metadata.userId ?? null)
        : event.type.startsWith("invoice.")
          ? null
          : null;

  try {
    await db.billingEvent.create({
      data: {
        userId,
        stripeEventId: event.id,
        type: event.type,
        payloadJson: event.data.object as object,
      },
    });
  } catch (error) {
    if (isDuplicatePrismaError(error)) {
      return NextResponse.json({ received: true, duplicate: true });
    }
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not reserve webhook event.",
      },
      { status: 500 },
    );
  }

  try {
    await handleStripeEvent(event);
    return NextResponse.json({ received: true });
  } catch (error) {
    await db.billingEvent.deleteMany({
      where: { stripeEventId: event.id },
    });
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Webhook processing failed.",
      },
      { status: 500 },
    );
  }
}
