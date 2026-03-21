import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { Resend } from "resend";

import { applyEmailDeliveryWebhook } from "@/lib/mailer";
import { env } from "@/lib/env";

const resend = new Resend(env.RESEND_API_KEY || "re_placeholder");

type ResendEventPayload = {
  type?: string;
  created_at?: string;
  data?: {
    email_id?: string;
  };
};

export async function POST(request: Request) {
  if (!env.RESEND_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Resend webhook secret is not configured." }, { status: 500 });
  }

  const payload = await request.text();
  const headers = {
    id: request.headers.get("svix-id") ?? "",
    timestamp: request.headers.get("svix-timestamp") ?? "",
    signature: request.headers.get("svix-signature") ?? "",
  };

  if (!headers.id || !headers.timestamp || !headers.signature) {
    return NextResponse.json({ error: "Missing webhook headers." }, { status: 400 });
  }

  let event: ResendEventPayload;
  try {
    event = resend.webhooks.verify({
      payload,
      headers,
      webhookSecret: env.RESEND_WEBHOOK_SECRET,
    }) as ResendEventPayload;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid webhook signature." },
      { status: 400 },
    );
  }

  const eventType = String(event.type ?? "");
  const providerMessageId = String(event.data?.email_id ?? "");
  if (!eventType || !providerMessageId) {
    return NextResponse.json({ received: true, ignored: true });
  }

  const result = await applyEmailDeliveryWebhook({
    eventType,
    providerMessageId,
    payload: JSON.parse(payload) as Prisma.JsonObject,
    happenedAt: event.created_at ?? null,
  });

  return NextResponse.json({ received: true, updated: result.updated });
}
