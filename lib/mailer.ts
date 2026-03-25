import { EmailDeliveryStatus, EmailTemplate, Prisma } from "@prisma/client";
import { Resend } from "resend";

import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { absoluteUrl } from "@/lib/utils";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

async function recordDelivery(input: {
  userId?: string | null;
  email: string;
  template: EmailTemplate;
  status: EmailDeliveryStatus;
  providerMessageId?: string | null;
  metaJson?: Prisma.InputJsonValue;
}) {
  await db.emailDelivery.create({
    data: {
      userId: input.userId ?? null,
      email: input.email,
      template: input.template,
      status: input.status,
      providerMessageId: input.providerMessageId ?? null,
      metaJson: input.metaJson,
    },
  });
}

function mergeDeliveryMeta(
  current: Prisma.JsonValue | null,
  update: Record<string, Prisma.InputJsonValue | undefined>,
): Prisma.InputJsonObject {
  const base =
    current && typeof current === "object" && !Array.isArray(current)
      ? (current as Prisma.InputJsonObject)
      : {};

  return {
    ...base,
    ...Object.fromEntries(Object.entries(update).filter(([, value]) => value !== undefined)),
  };
}

function deliveryStatusFromEventType(eventType: string) {
  switch (eventType) {
    case "email.delivered":
    case "email.opened":
    case "email.clicked":
      return EmailDeliveryStatus.SENT;
    case "email.bounced":
    case "email.complained":
    case "email.failed":
    case "email.suppressed":
      return EmailDeliveryStatus.FAILED;
    default:
      return EmailDeliveryStatus.QUEUED;
  }
}

export async function applyEmailDeliveryWebhook(input: {
  eventType: string;
  providerMessageId: string;
  payload: Prisma.InputJsonValue;
  happenedAt?: string | null;
}) {
  const delivery = await db.emailDelivery.findFirst({
    where: { providerMessageId: input.providerMessageId },
    orderBy: { createdAt: "desc" },
  });

  if (!delivery) {
    return { updated: false as const };
  }

  await db.emailDelivery.update({
    where: { id: delivery.id },
    data: {
      status: deliveryStatusFromEventType(input.eventType),
      metaJson: mergeDeliveryMeta(delivery.metaJson, {
        resend: input.payload,
        lastEventType: input.eventType,
        lastEventAt: input.happenedAt ?? undefined,
      }),
    },
  });

  return { updated: true as const, deliveryId: delivery.id };
}

export async function sendSignInCodeEmail(input: {
  email: string;
  code: string;
  claimPath?: string | null;
  userId?: string | null;
}) {
  const subject = input.claimPath
    ? "Keep your mdshare link live"
    : "Your mdshare sign-in code";

  const text = input.claimPath
    ? [
        "Sign in to claim this link and tie it to your account.",
        "",
        `Code: ${input.code}`,
        "",
        "Once claimed, upgrade to Pro to keep it live permanently.",
        "",
        `Claim here: ${absoluteUrl(input.claimPath)}`,
      ].join("\n")
    : [
        "Use this code to sign in to mdshare.",
        "",
        `Code: ${input.code}`,
        "",
        "Enter this code on the sign-in page to continue.",
      ].join("\n");

  if (!resend) {
    console.info("[mail:dev]", {
      to: input.email,
      code: input.code,
      claimPath: input.claimPath ?? null,
    });
    await recordDelivery({
      userId: input.userId,
      email: input.email,
      template: EmailTemplate.LOGIN_CODE,
      status: EmailDeliveryStatus.SENT,
      metaJson: { dev: true },
    });
    return { devMode: true };
  }

  const response = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: input.email,
    replyTo: env.RESEND_REPLY_TO || undefined,
    subject,
    text,
  });

  await recordDelivery({
    userId: input.userId,
    email: input.email,
    template: EmailTemplate.LOGIN_CODE,
    status: response.error ? EmailDeliveryStatus.FAILED : EmailDeliveryStatus.QUEUED,
    providerMessageId: response.data?.id,
    metaJson: response.error ? { error: response.error.message } : undefined,
  });

  return response;
}
