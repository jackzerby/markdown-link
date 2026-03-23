import Link from "next/link";

import { MarkdownShell } from "@/components/markdown-shell";
import { env } from "@/lib/env";

const siteUrl = env.APP_URL.replace(/\/$/, "");
const siteHost = new URL(siteUrl).host;

const demoMarkdown = `# project status update

this page was published with one command:

\`mdshare ./status.md\`

## what you're looking at

a rendered markdown page hosted at a clean URL. no account required to publish.

## features

- **headers, lists, code** — standard markdown, cleanly rendered
- **password protection** — optional, per-publish
- **raw view** — toggle to see the source markdown
- **expiration** — free links expire after 7 days. pro keeps them permanent.

## try it

\`\`\`
curl -fsSL ${siteUrl}/install.sh | bash
mdshare ./notes.md
\`\`\`

published with [${siteHost}](${siteUrl}).`;

export default function DemoPage() {
  return (
    <main className="viewer stack">
      <div className="viewer-meta stack">
        <p>public demo</p>
        <p>A published markdown page. Toggle raw markdown to see the source.</p>
        <div className="inline-actions">
          <Link href="/p/demo/raw">raw</Link>
          <Link href="/">home</Link>
        </div>
      </div>
      <MarkdownShell source={demoMarkdown} />
    </main>
  );
}
