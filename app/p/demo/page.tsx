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
    <main className="viewer demo-view">
      <style>{`
        .demo-view {
          width: min(960px, calc(100vw - 32px));
          padding-top: 24px;
        }

        .demo-back {
          display: inline-flex;
          margin-bottom: 18px;
          color: var(--muted);
          text-decoration: none;
        }

        .demo-view .markdown-shell {
          max-width: 860px;
        }

        @media (max-width: 900px) {
          .demo-view {
            width: calc(100vw - 24px);
            padding-top: 20px;
          }
        }
      `}</style>

      <Link className="demo-back" href="/">
        Home
      </Link>
      <MarkdownShell
        brandFooter
        rawHref="/p/demo/raw"
        renderedHref="/p/demo"
        source={demoMarkdown}
        targetId="demo-markdown"
      />
    </main>
  );
}
