import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { hashSecret } from "@/lib/hash";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, { params }: RouteProps) {
  const user = await getCurrentUser();
  const { slug } = await params;
  const payload = await request.json();
  const token = String(payload.token ?? "");

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const site = await db.site.findUnique({
    where: { slug },
    include: { claim: true },
  });

  if (!site || !site.claim) {
    return NextResponse.json({ error: "Claim not available." }, { status: 404 });
  }

  if (site.claim.claimedAt) {
    return NextResponse.json({ error: "Already claimed." }, { status: 400 });
  }

  if (site.claim.claimTokenHash !== hashSecret(token, env.SESSION_SECRET)) {
    return NextResponse.json({ error: "Invalid token." }, { status: 400 });
  }

  await db.$transaction([
    db.anonymousClaim.update({
      where: { id: site.claim.id },
      data: { claimedAt: new Date(), claimedByUserId: user.id },
    }),
    db.site.update({
      where: { id: site.id },
      data: { ownerUserId: user.id, claimedAt: new Date(), expiresAt: null },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
