import { NextResponse } from "next/server";

import { uploadPendingVersionFile } from "@/lib/publishes";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function PUT(request: Request, { params }: RouteProps) {
  const { slug } = await params;
  const url = new URL(request.url);
  const versionId = url.searchParams.get("versionId");
  const filePath = url.searchParams.get("path");
  const token = url.searchParams.get("token");

  if (!versionId || !filePath || !token) {
    return NextResponse.json({ error: "Missing upload parameters." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await request.arrayBuffer());
    await uploadPendingVersionFile({
      slug,
      versionId,
      uploadToken: token,
      filePath,
      contents: buffer,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 400 },
    );
  }
}
