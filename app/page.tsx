import Link from "next/link";

import { MarkdownShell } from "@/components/markdown-shell";

const homeMarkdown = `# markdown.link

your markdown, as a URL.

## install

\`curl -fsSL https://markdown.link/install.sh | bash\`

## publish

\`markdown.link ./plan.md\`

\`→ https://markdown.link/p/f7x2k\`

## why

- no account needed to publish
- no editor — just your terminal
- clean rendered page, not a raw paste

## use cases

- share a project brief with your team
- publish release notes from CI
- send a draft without signing anyone up

## links

- [see a demo](/p/demo)
- [sign in](/auth/start)
- [dashboard](/dashboard/sites)`;

export default function HomePage() {
  return (
    <main className="home-page">
      <MarkdownShell source={homeMarkdown} />
      <p className="muted">
        free links expire after 7 days.{" "}
        <Link href="/dashboard/plan">pro keeps them live — $5/mo.</Link>
      </p>
    </main>
  );
}
