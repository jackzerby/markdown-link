import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { hashSecret, randomToken } from "@/lib/hash";

export async function POST() {
  const user = await requireUser();
  const secret = `mdl_${randomToken(20)}`;
  const prefix = secret.slice(0, 12);

  await db.apiKey.create({
    data: {
      userId: user.id,
      name: "default",
      prefix,
      secretHash: hashSecret(secret, env.API_KEY_PEPPER),
    },
  });

  return NextResponse.json({ ok: true, apiKey: secret });
}
