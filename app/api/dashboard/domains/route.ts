import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { randomToken } from "@/lib/hash";
import { absoluteUrlFromRequest } from "@/lib/utils";

export async function POST(request: Request) {
  const user = await requireUser();
  const formData = await request.formData();
  const hostname = String(formData.get("hostname") ?? "").trim().toLowerCase();
  const redirectWith = (params: Record<string, string>) =>
    NextResponse.redirect(absoluteUrlFromRequest(`/dashboard/domains?${new URLSearchParams(params).toString()}`, request));

  if (!hostname) {
    return redirectWith({ error: "Hostname is required." });
  }

  const existing = await db.domain.findUnique({
    where: { hostname },
  });

  if (existing && existing.userId !== user.id) {
    return redirectWith({
      error: "That domain is already claimed.",
      hostname,
    });
  }

  if (existing) {
    await db.domain.update({
      where: { id: existing.id },
      data: {
        status: "PENDING",
        verifiedAt: null,
        verificationToken: randomToken(16),
        dnsTarget: "domains.mdshare.link",
      },
    });
  } else {
    await db.domain.create({
      data: {
        userId: user.id,
        hostname,
        verificationToken: randomToken(16),
        dnsTarget: "domains.mdshare.link",
      },
    });
  }

  return redirectWith({
    success: existing ? "DNS instructions refreshed." : "Domain added.",
    hostname,
  });
}
