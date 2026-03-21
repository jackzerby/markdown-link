import Link from "next/link";

import { MarkdownShell } from "@/components/markdown-shell";

const homeMarkdown = `# markdown.link

your markdown, as a URL.

## install

\`curl -fsSL https://markdown.link/install.sh | bash\`

## publish

\`markdown.link ./plan.md\`

\`→ https://markdown.link/p/f7x2k\`

## links

- [sign in](/auth/start)
- [dashboard](/dashboard/sites)`;

export default function HomePage() {
  return (
    <main className="home-page">
      <MarkdownShell source={homeMarkdown} />
      <p className="muted">
        free links expire.{" "}
        <Link href="/dashboard/plan">hobby keeps them live.</Link>
      </p>
    </main>
  );
}
