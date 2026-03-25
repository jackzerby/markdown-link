import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import { env } from "@/lib/env";
import { absoluteUrl, absoluteUrlFromRequest } from "@/lib/utils";
import { getOrCreateStripeCustomer, stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const user = await requireUser();
  const redirectWithError = (message: string) =>
    NextResponse.redirect(
      absoluteUrlFromRequest(`/manage/billing?error=${encodeURIComponent(message)}`, request),
      { status: 303 },
    );

  if (!stripe) {
    return redirectWithError("Stripe is not configured yet.");
  }

  try {
    const customerId = await getOrCreateStripeCustomer(user);
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: absoluteUrl("/dashboard/plan"),
      configuration: env.STRIPE_CUSTOMER_PORTAL_CONFIGURATION_ID || undefined,
    });

    return NextResponse.redirect(session.url, { status: 303 });
  } catch {
    return redirectWithError("Could not open the billing portal right now.");
  }
}
