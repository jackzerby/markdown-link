import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "markdown.link",
  description: "Turn markdown files into shareable URLs from the CLI.",
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
