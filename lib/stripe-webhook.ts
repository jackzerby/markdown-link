import { readFileSync } from "node:fs";
import { join } from "node:path";

import { env } from "@/lib/env";

export function getStripeWebhookSecret() {
  if (env.STRIPE_WEBHOOK_SECRET) {
    return env.STRIPE_WEBHOOK_SECRET;
  }

  if (env.NODE_ENV !== "development") {
    return null;
  }

  const secretFile =
    env.STRIPE_WEBHOOK_SECRET_FILE ||
    join(/* turbopackIgnore: true */ process.cwd(), ".stripe-webhook-secret");

  try {
    const secret = readFileSync(secretFile, "utf8").trim();
    return secret || null;
  } catch {
    return null;
  }
}
