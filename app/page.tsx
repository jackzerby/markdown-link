import Link from "next/link";

import { MarkdownShell } from "@/components/markdown-shell";
import { env } from "@/lib/env";

const siteUrl = env.APP_URL.replace(/\/$/, "");
const siteHost = new URL(siteUrl).host;
const installUrl = `${siteUrl}/install.sh`;

const homeMarkdown = `# ${siteHost}

share markdown from the terminal.

## install

\`curl -fsSL ${installUrl} | bash\`

## publish

\`mdshare ./plan.md\`

\`→ ${siteUrl}/p/f7x2k\`

## why

- no account needed to publish
- no editor — just your terminal
- free links expire after 7 days

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
