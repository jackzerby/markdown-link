import { env } from "@/lib/env";
import { clsx } from "clsx";
import { formatDistanceToNowStrict } from "date-fns";
import { NextRequest } from "next/server";

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export function relativeDate(date: Date | null | undefined) {
  if (!date) return null;
  return formatDistanceToNowStrict(date, { addSuffix: true });
}

export function absoluteUrl(path: string) {
  return new URL(path, env.APP_URL).toString();
}

export function absoluteUrlFromRequest(path: string, request: Pick<NextRequest, "url" | "headers">) {
  const forwardedHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto");

  if (forwardedHost) {
    const fallbackUrl = new URL(request.url);
    const protocol = forwardedProto ?? fallbackUrl.protocol.replace(":", "");
    return new URL(path, `${protocol}://${forwardedHost}`).toString();
  }

  return new URL(path, request.url).toString();
}
