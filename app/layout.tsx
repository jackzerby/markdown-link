import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "markdown.link — your markdown, as a URL",
  description:
    "Publish any markdown file to a shareable URL from the terminal. One command, no account required. Free links expire, Pro keeps them permanent.",
  openGraph: {
    title: "markdown.link",
    description: "Your markdown, as a URL. One command, no account.",
    url: "https://markdown.link",
    siteName: "markdown.link",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "markdown.link",
    description: "Your markdown, as a URL. One command, no account.",
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
