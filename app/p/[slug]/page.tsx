import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { MarkdownShell } from "@/components/markdown-shell";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { hashSecret } from "@/lib/hash";

type PublishViewerPageProps = {
  params: Promise<{ slug: string }>;
};

const publishViewStyles = (
  <style>{`
    .publish-view {
      width: min(960px, calc(100vw - 32px));
      margin: 0 auto;
      padding: 40px 0 72px;
    }

    .publish-view .viewer-form input,
    .publish-view .viewer-form button {
      width: 100%;
    }

    .publish-view .markdown-shell {
      max-width: 860px;
    }

    @media (max-width: 900px) {
      .publish-view {
        width: calc(100vw - 24px);
        padding: 24px 0 56px;
      }
    }
  `}</style>
);

export default async function PublishViewerPage({ params }: PublishViewerPageProps) {
  const { slug } = await params;
  const site = await db.site.findUnique({
    where: { slug },
    include: { currentVersion: true, claim: true },
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
      <main className="publish-view">
        {publishViewStyles}
        <form action={`/api/publishes/${slug}/password`} className="stack viewer-form" method="post">
          <input name="password" placeholder="password" required type="password" />
          <input name="intent" type="hidden" value="unlock" />
          <button className="button" type="submit">
            Unlock
          </button>
        </form>
      </main>
    );
  }

  const now = new Date();
  const isExpired = !!site.expiresAt && site.expiresAt <= now;

  if (isExpired) {
    return (
      <main className="publish-view">
        {publishViewStyles}
        <div className="stack">
          <p>This link has expired.</p>
          <p className="muted">Free links expire after 7 days. The author can upgrade to Pro to keep links permanent.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="publish-view">
      {publishViewStyles}
      <MarkdownShell
        brandFooter
        rawHref={`/p/${slug}/raw`}
        renderedHref={`/p/${slug}`}
        source={site.currentVersion.markdown}
        targetId={`publish-${slug}`}
      />
    </main>
  );
}
