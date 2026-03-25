import type { Metadata } from "next";

import "@/app/globals.css";
import { env } from "@/lib/env";

const siteUrl = env.APP_URL;
const siteHost = new URL(siteUrl).host;

export const metadata: Metadata = {
  title: `${siteHost} — publish markdown, get a link`,
  description:
    "Publish any markdown file to a shareable URL with one command. Free for 7 days, $5/mo to keep.",
  openGraph: {
    title: `${siteHost} — publish markdown, get a link`,
    description: "One command turns any .md file into a clean, shareable URL.",
    url: siteUrl,
    siteName: siteHost,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${siteHost} — publish markdown, get a link`,
    description: "One command turns any .md file into a clean, shareable URL.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
