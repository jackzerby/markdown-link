import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import { env } from "@/lib/env";
import { absoluteUrl } from "@/lib/utils";
import { getOrCreateStripeCustomer, stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const user = await requireUser();

  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured yet." },
      { status: 500 },
    );
  }

  const customerId = await getOrCreateStripeCustomer(user);
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: absoluteUrl("/dashboard/plan"),
    configuration: env.STRIPE_CUSTOMER_PORTAL_CONFIGURATION_ID || undefined,
  });

  return NextResponse.redirect(new URL(session.url, request.url));
}
