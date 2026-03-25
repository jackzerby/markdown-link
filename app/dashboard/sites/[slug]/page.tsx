import Link from "next/link";
import { notFound } from "next/navigation";

import { MarkdownShell } from "@/components/markdown-shell";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { relativeDate } from "@/lib/utils";

type SiteDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ claimed?: string }>;
};

export default async function SiteDetailPage({ params, searchParams }: SiteDetailPageProps) {
  const user = await requireUser();
  const { slug } = await params;
  const { claimed } = await searchParams;
  const site = await db.site.findFirst({
    where: {
      slug,
      ownerUserId: user.id,
    },
    include: {
      currentVersion: true,
      claim: true,
      versions: {
        orderBy: { versionNumber: "desc" },
      },
    },
  });

  if (!site) {
    notFound();
  }

  const planParams = new URLSearchParams({
    source: "site",
    slug: site.slug,
    title: site.title ?? site.slug,
  });
  if (site.expiresAt) {
    planParams.set("expiresAt", site.expiresAt.toISOString());
  }

  return (
    <section className="stack">
      <div className="site-head">
        <h1>{site.title ?? slug}</h1>
        <p>{site.description ?? "markdown publish"}</p>
      </div>

      {claimed === "1" && (
        <div className="notice stack">
          {user.planTier === "HOBBY" ? (
            <p>publish claimed. it is now tied to your account and will not expire.</p>
          ) : (
            <>
              <p>publish claimed. it is now tied to your account.</p>
              <p>
                free links still expire.{" "}
                <Link href={`/dashboard/plan?${planParams.toString()}`}>upgrade to pro</Link>{" "}
                to keep important ones permanent.
              </p>
            </>
          )}
        </div>
      )}

      <div className="viewer-meta stack">
        <p>slug: {site.slug}</p>
        <p>{site.expiresAt ? `expires ${relativeDate(site.expiresAt)}` : "permanent"}</p>
        <p>{site.visibility === "PASSWORD" ? "password protected" : site.claim?.claimedAt ? "claimed" : "owned"}</p>
        <div className="inline-actions">
          <Link href={`/p/${site.slug}`}>public</Link>
          <Link href={`/p/${site.slug}/raw`}>raw</Link>
          {user.planTier !== "HOBBY" ? (
            <Link href={`/dashboard/plan?${planParams.toString()}`}>see pro</Link>
          ) : null}
        </div>
      </div>

      <form action={`/api/publishes/${site.slug}/password`} className="stack" method="post">
        <input name="password" placeholder="set password" type="password" />
        <input name="intent" type="hidden" value="set" />
        <button className="button" type="submit">
          save password
        </button>
      </form>

      <form action={`/api/publishes/${site.slug}/password`} method="post">
        <input name="intent" type="hidden" value="clear" />
        <button className="button secondary" type="submit">
          clear password
        </button>
      </form>

      <MarkdownShell
        source={site.currentVersion?.markdown ?? ""}
        targetId={`dashboard-site-${site.slug}`}
      />
    </section>
  );
}
