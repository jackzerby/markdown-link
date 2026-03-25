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
        <p>{site.description ?? "Published markdown file"}</p>
      </div>

      {claimed === "1" && (
        <div className="notice stack">
          {user.planTier === "HOBBY" ? (
            <p>Link claimed — it's tied to your account and will never expire.</p>
          ) : (
            <>
              <p>Link claimed — it's tied to your account.</p>
              <p>
                Free links still expire after 7 days.{" "}
                <Link href={`/dashboard/plan?${planParams.toString()}`}>Upgrade to Pro</Link>{" "}
                to keep this one permanent.
              </p>
            </>
          )}
        </div>
      )}

      <div className="viewer-meta stack">
        <p>URL path: {site.slug}</p>
        <p>{site.expiresAt ? `expires ${relativeDate(site.expiresAt)}` : "permanent"}</p>
        <p>{site.visibility === "PASSWORD" ? "Password protected" : site.claim?.claimedAt ? "Yours (claimed)" : "Yours"}</p>
        <div className="inline-actions">
          <Link href={`/p/${site.slug}`}>public</Link>
          <Link href={`/p/${site.slug}/raw`}>raw</Link>
          {user.planTier !== "HOBBY" ? (
            <Link href={`/dashboard/plan?${planParams.toString()}`}>Upgrade to Pro</Link>
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
          Remove password
        </button>
      </form>

      <MarkdownShell
        source={site.currentVersion?.markdown ?? ""}
        targetId={`dashboard-site-${site.slug}`}
      />
    </section>
  );
}
