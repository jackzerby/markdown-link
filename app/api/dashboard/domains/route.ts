import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { randomToken } from "@/lib/hash";

export async function POST(request: Request) {
  const user = await requireUser();
  const formData = await request.formData();
  const hostname = String(formData.get("hostname") ?? "").trim().toLowerCase();

  if (!hostname) {
    return NextResponse.json({ error: "Hostname is required." }, { status: 400 });
  }

  const existing = await db.domain.findUnique({
    where: { hostname },
  });

  if (existing && existing.userId !== user.id) {
    return NextResponse.json({ error: "That domain is already claimed." }, { status: 409 });
  }

  if (existing) {
    await db.domain.update({
      where: { id: existing.id },
      data: {
        status: "PENDING",
        verifiedAt: null,
        verificationToken: randomToken(16),
        dnsTarget: "domains.markdown.link",
      },
    });
  } else {
    await db.domain.create({
      data: {
        userId: user.id,
        hostname,
        verificationToken: randomToken(16),
        dnsTarget: "domains.markdown.link",
      },
    });
  }

  return NextResponse.redirect(new URL("/dashboard/domains", request.url));
}
