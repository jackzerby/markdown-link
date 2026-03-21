import { NextRequest, NextResponse } from "next/server";

import { verifyLoginCode } from "@/lib/auth";
import { consumeRateLimit, getClientIdentifier } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await request.json() : Object.fromEntries((await request.formData()).entries());

  const email = String(payload.email ?? "");
  const code = String(payload.code ?? "");
  const nextPath = String(payload.next ?? "/dashboard/sites");
  const claimSlug = String(payload.claimSlug ?? "");
  const claimToken = String(payload.claimToken ?? "");
  const clientId = getClientIdentifier(request);

  const limit = consumeRateLimit({
    key: `auth:verify:${email.trim().toLowerCase() || "unknown"}:${clientId}`,
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many verification attempts. Try again later." },
      {
        status: 429,
        headers: {
          "retry-after": String(limit.retryAfterSeconds),
          "x-ratelimit-remaining": String(limit.remaining),
          "x-ratelimit-reset": String(Math.floor(limit.resetAt.getTime() / 1000)),
        },
      },
    );
  }

  const result = await verifyLoginCode({ email, code });

  if (!result.ok) {
    if (isJson) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    const params = new URLSearchParams({
      email,
      next: nextPath,
      error: result.message,
    });
    if (claimSlug) params.set("claimSlug", claimSlug);
    if (claimToken) params.set("claimToken", claimToken);
    return NextResponse.redirect(new URL(`/auth/verify?${params.toString()}`, request.url));
  }

  if (isJson) {
    return NextResponse.json({ ok: true, redirectPath: result.redirectPath });
  }

  return NextResponse.redirect(new URL(result.redirectPath, request.url));
}
