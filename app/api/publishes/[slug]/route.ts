import { NextRequest, NextResponse } from "next/server";

import { getRequestUser } from "@/lib/auth";
import { db } from "@/lib/db";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: NextRequest, { params }: RouteProps) {
  const { slug } = await params;
  const site = await db.site.findUnique({
    where: { slug },
    include: { currentVersion: true, claim: true },
  });

  if (!site) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json(site);
}

export async function PUT(request: NextRequest, { params }: RouteProps) {
  const user = await getRequestUser(request);
  const { slug } = await params;
  const payload = await request.json();

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const site = await db.site.findFirst({
    where: { slug, ownerUserId: user.id },
  });

  if (!site) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const updated = await db.site.update({
    where: { id: site.id },
    data: {
      title: typeof payload.title === "string" ? payload.title : undefined,
      description: typeof payload.description === "string" ? payload.description : undefined,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: RouteProps) {
  const user = await getRequestUser(request);
  const { slug } = await params;

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const site = await db.site.findFirst({
    where: { slug, ownerUserId: user.id },
  });

  if (!site) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await db.site.delete({
    where: { id: site.id },
  });

  return NextResponse.json({ ok: true });
}
