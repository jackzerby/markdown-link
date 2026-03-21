import { NextResponse } from "next/server";

import { getRequestUser } from "@/lib/auth";
import { finalizePublish } from "@/lib/publishes";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, { params }: RouteProps) {
  const user = await getRequestUser(request);
  const { slug } = await params;
  const payload = await request.json().catch(() => ({}));
  const versionId =
    typeof payload.versionId === "string" && payload.versionId.length > 0
      ? payload.versionId
      : null;

  try {
    const result = await finalizePublish(slug, user?.id, versionId);
    return NextResponse.json({ ok: true, slug: result.site.slug });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not finalize publish." },
      { status: 400 },
    );
  }
}
