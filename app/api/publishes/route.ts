import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getRequestUser } from "@/lib/auth";
import { createPendingFilePublish, createPublish } from "@/lib/publishes";
import { absoluteUrlFromRequest } from "@/lib/utils";
import { consumeRateLimit, getClientIdentifier } from "@/lib/rate-limit";

const manifestSchema = z.object({
  path: z.string().min(1),
  size: z.number().int().nonnegative(),
  contentType: z.string().min(1),
  sha256: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const user = await getRequestUser(request);
  return NextResponse.json({ ok: true, authenticated: Boolean(user) });
}

export async function POST(request: NextRequest) {
  const user = await getRequestUser(request);
  const contentType = request.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await request.json() : Object.fromEntries((await request.formData()).entries());
  const clientId = getClientIdentifier(request);
  const withRequestOrigin = (path: string) => absoluteUrlFromRequest(path, request);

  const title = String(payload.title ?? "").trim() || null;
  const description = String(payload.description ?? "").trim() || null;
  const markdown = String(payload.markdown ?? "").trim();
  const finalizeRequested = String(payload.finalize ?? "").toLowerCase() === "true";
  const filesResult = Array.isArray(payload.files)
    ? z.array(manifestSchema).safeParse(payload.files)
    : null;

  function redirectToDashboard(message: string) {
    return NextResponse.redirect(absoluteUrlFromRequest(`/dashboard/sites?error=${encodeURIComponent(message)}`, request));
  }

  if (!markdown && !filesResult?.success) {
    if (isJson) {
      return NextResponse.json({ error: "Markdown is required." }, { status: 400 });
    }
    return redirectToDashboard("Markdown is required.");
  }

  const publishLimit = consumeRateLimit({
    key: user ? `publishes:user:${user.id}` : `publishes:ip:${clientId}`,
    limit: user ? 100 : 10,
    windowMs: 60 * 60 * 1000,
  });

  if (!publishLimit.allowed) {
    if (!isJson) {
      return redirectToDashboard("Too many publishes. Try again later.");
    }
    return NextResponse.json(
      { error: "Too many publishes. Try again later." },
      {
        status: 429,
        headers: {
          "retry-after": String(publishLimit.retryAfterSeconds),
          "x-ratelimit-remaining": String(publishLimit.remaining),
          "x-ratelimit-reset": String(Math.floor(publishLimit.resetAt.getTime() / 1000)),
        },
      },
    );
  }

  try {
    if (filesResult?.success) {
      const publish = await createPendingFilePublish({
        userId: user?.id ?? null,
        planTier: user?.planTier,
        title,
        description,
        files: filesResult.data,
      });

      return NextResponse.json({
        slug: publish.site.slug,
        siteUrl: withRequestOrigin(`/p/${publish.site.slug}`),
        claimUrl: publish.claimToken
          ? withRequestOrigin(`/claim/${publish.site.slug}?token=${publish.claimToken}`)
          : null,
        expiresAt: publish.site.expiresAt,
        status: "pending",
        upload: {
          versionId: publish.version.id,
          finalizeUrl: withRequestOrigin(`/api/publishes/${publish.site.slug}/finalize`),
          uploads: filesResult.data.map((file) => ({
            path: file.path,
            method: "PUT",
            headers: {
              "Content-Type": file.contentType,
            },
            url: withRequestOrigin(
              `/api/publishes/${publish.site.slug}/files?versionId=${publish.version.id}&path=${encodeURIComponent(
                file.path,
              )}&token=${publish.uploadToken}`,
            ),
          })),
        },
      });
    }

    const finalize = payload.finalize === undefined ? true : finalizeRequested;

    const publish = await createPublish({
      userId: user?.id ?? null,
      planTier: user?.planTier,
      title,
      description,
      markdown,
      finalize,
    });

    if (isJson) {
      return NextResponse.json({
        slug: publish.site.slug,
        siteUrl: withRequestOrigin(publish.siteUrl),
        claimUrl: publish.claimPath ? withRequestOrigin(publish.claimPath) : null,
        expiresAt: publish.site.expiresAt,
        status: finalize ? "live" : "pending",
      });
    }

    if (user) {
      return NextResponse.redirect(absoluteUrlFromRequest(`/dashboard/sites/${publish.site.slug}`, request));
    }

    return NextResponse.redirect(absoluteUrlFromRequest(publish.claimPath ?? publish.siteUrl, request));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create publish.";
    if (isJson) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return redirectToDashboard(message);
  }
}
