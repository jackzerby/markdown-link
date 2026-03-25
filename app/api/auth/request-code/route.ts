import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { requestLoginCode } from "@/lib/auth";
import { sendSignInCodeEmail } from "@/lib/mailer";
import { consumeRateLimit, getClientIdentifier } from "@/lib/rate-limit";
import { absoluteUrlFromRequest } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await request.json() : Object.fromEntries((await request.formData()).entries());

  const email = String(payload.email ?? "").trim().toLowerCase();
  const nextPath = String(payload.next ?? "/dashboard/sites");
  const claimSlug = String(payload.claimSlug ?? "");
  const claimToken = String(payload.claimToken ?? "");
  const clientId = getClientIdentifier(request);

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const emailLimit = consumeRateLimit({
    key: `auth:request:email:${email}`,
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });
  const ipLimit = consumeRateLimit({
    key: `auth:request:ip:${clientId}`,
    limit: 20,
    windowMs: 15 * 60 * 1000,
  });

  if (!emailLimit.allowed || !ipLimit.allowed) {
    const limited = emailLimit.allowed ? ipLimit : emailLimit;
    return NextResponse.json(
      { error: "Too many code requests. Try again later." },
      {
        status: 429,
        headers: {
          "retry-after": String(limited.retryAfterSeconds),
          "x-ratelimit-remaining": String(limited.remaining),
          "x-ratelimit-reset": String(Math.floor(limited.resetAt.getTime() / 1000)),
        },
      },
    );
  }

  const site = claimSlug
    ? await db.site.findUnique({
        where: { slug: claimSlug },
      })
    : null;

  const code = await requestLoginCode({
    email,
    purpose: claimSlug ? "CLAIM_SITE" : "SIGN_IN",
    redirectPath: claimSlug ? `/dashboard/sites/${claimSlug}` : nextPath,
    siteId: site?.id ?? null,
    claimToken: claimToken || null,
  });

  await sendSignInCodeEmail({
    email,
    code,
    claimPath: claimSlug ? `/claim/${claimSlug}?token=${claimToken}` : null,
  });

  if (isJson) {
    return NextResponse.json({
      ok: true,
      email,
      ...(process.env.NODE_ENV !== "production" ? { debugCode: code } : {}),
    });
  }

  const params = new URLSearchParams({
    email,
    next: nextPath,
  });
  if (claimSlug) params.set("claimSlug", claimSlug);
  if (claimToken) params.set("claimToken", claimToken);
  if (process.env.NODE_ENV !== "production") params.set("debugCode", code);
  return NextResponse.redirect(absoluteUrlFromRequest(`/auth/verify?${params.toString()}`, request));
}
