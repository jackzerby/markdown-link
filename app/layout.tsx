import type { Metadata } from "next";

import "@/app/globals.css";
import { env } from "@/lib/env";

const siteUrl = env.APP_URL;
const siteHost = new URL(siteUrl).host;

export const metadata: Metadata = {
  title: `${siteHost} — share markdown from the terminal`,
  description:
    "Publish markdown to a clean shareable URL from the terminal. One command, no account required. Free links expire, Pro keeps them permanent.",
  openGraph: {
    title: siteHost,
    description: "Share markdown from the terminal. One command, no account.",
    url: siteUrl,
    siteName: siteHost,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: siteHost,
    description: "Share markdown from the terminal. One command, no account.",
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
