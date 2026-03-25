import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { MarkdownShell } from "@/components/markdown-shell";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { hashSecret } from "@/lib/hash";

type PublishRawPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PublishRawPage({ params }: PublishRawPageProps) {
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
    notFound();
  }

  return (
    <main className="viewer" style={{ width: "min(960px, calc(100vw - 32px))" }}>
      <MarkdownShell
        brandFooter
        mode="raw"
        rawHref={`/p/${slug}/raw`}
        renderedHref={`/p/${slug}`}
        source={site.currentVersion.markdown}
        targetId={`publish-${slug}`}
      />
    </main>
  );
}
