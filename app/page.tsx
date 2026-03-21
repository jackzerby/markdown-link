import Link from "next/link";

import { MarkdownShell } from "@/components/markdown-shell";

const homeMarkdown = `# markdown.link

publish markdown.

from the cli.

## install

\`curl -fsSL https://markdown.link/install.sh | bash\`

## publish

\`markdown.link ./plan.md\`

## links

- [sign in](/auth/start)
- [dashboard](/dashboard/sites)`;

export default function HomePage() {
  return (
    <main className="home-page">
      <MarkdownShell source={homeMarkdown} />
      <p className="muted">
        free publishes expire. hobby keeps them live.
      </p>
      <p>
        <Link href="/dashboard/plan">see plan</Link>
      </p>
    </main>
  );
}
