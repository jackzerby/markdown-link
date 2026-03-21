import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import { env } from "@/lib/env";
import { absoluteUrl } from "@/lib/utils";
import { getOrCreateStripeCustomer, stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const user = await requireUser();

  if (!stripe || !env.STRIPE_PRICE_HOBBY_MONTHLY) {
    return NextResponse.json(
      { error: "Stripe is not configured yet." },
      { status: 500 },
    );
  }

  const customerId = await getOrCreateStripeCustomer(user);
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [
      {
        price: env.STRIPE_PRICE_HOBBY_MONTHLY,
        quantity: 1,
      },
    ],
    success_url: absoluteUrl("/checkout/success"),
    cancel_url: absoluteUrl("/dashboard/plan"),
    metadata: {
      userId: user.id,
    },
    subscription_data: {
      metadata: {
        userId: user.id,
      },
    },
  });

  return NextResponse.redirect(new URL(session.url ?? "/dashboard/plan", request.url));
}
