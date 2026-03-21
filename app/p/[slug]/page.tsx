import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MarkdownShell } from "@/components/markdown-shell";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { hashSecret } from "@/lib/hash";
import { relativeDate } from "@/lib/utils";

type PublishViewerPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PublishViewerPage({ params }: PublishViewerPageProps) {
  const { slug } = await params;
  const site = await db.site.findUnique({
    where: { slug },
    include: { currentVersion: true },
  });

  if (!site || !site.currentVersion) {
    notFound();
  }

  const cookieStore = await cookies();
  const accessCookie = cookieStore.get(`mdlink_access_${slug}`)?.value;
  const isUnlocked =
    site.visibility !== "PASSWORD" ||
    (site.passwordHash &&
      accessCookie === hashSecret(site.passwordHash, env.SESSION_SECRET));

  if (!isUnlocked) {
    return (
      <main className="viewer stack">
        <div className="viewer-meta stack">
          <p>{site.title ?? slug}</p>
          <p>password required.</p>
        </div>
        <form action={`/api/publishes/${slug}/password`} className="stack" method="post">
          <input name="password" placeholder="password" required type="password" />
          <input name="intent" type="hidden" value="unlock" />
          <button className="button" type="submit">
            unlock
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="viewer stack">
      <div className="viewer-meta stack">
        <p>{site.title ?? slug}</p>
        <p>{site.description ?? "markdown publish"}</p>
        <div className="inline-actions">
          <Link href={`/p/${slug}/raw`}>raw</Link>
          {site.expiresAt ? <span>expires {relativeDate(site.expiresAt)}</span> : <span>permanent</span>}
        </div>
      </div>
      <MarkdownShell source={site.currentVersion.markdown} />
    </main>
  );
}
