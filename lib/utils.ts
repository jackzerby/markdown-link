import { clsx } from "clsx";
import { formatDistanceToNowStrict } from "date-fns";

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export function relativeDate(date: Date | null | undefined) {
  if (!date) return null;
  return formatDistanceToNowStrict(date, { addSuffix: true });
}

export function absoluteUrl(path: string) {
  const base = process.env.APP_URL ?? "http://localhost:3000";
  return new URL(path, base).toString();
}
