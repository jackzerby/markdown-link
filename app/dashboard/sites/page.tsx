import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { relativeDate } from "@/lib/utils";

export default async function DashboardSitesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await requireUser();
  const params = searchParams ? await searchParams : {};
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const sites = await db.site.findMany({
    where: { ownerUserId: user.id },
    include: { currentVersion: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <section className="stack">
      <div className="section-head">
        <h1>sites</h1>
        <p>create and manage markdown publishes.</p>
      </div>

      {error ? <p className="error">{error}</p> : null}

      <form action="/api/publishes" className="stack" method="post">
        <input name="title" placeholder="title" />
        <textarea name="markdown" placeholder="# plan" required />
        <input name="finalize" type="hidden" value="true" />
        <button className="button" type="submit">
          publish
        </button>
      </form>

      <div className="site-grid">
        {sites.length === 0 ? <p>no sites yet.</p> : null}
        {sites.map((site) => (
          <article key={site.id} className="site-card stack">
            <h2>
              <Link href={`/dashboard/sites/${site.slug}`}>{site.title ?? site.slug}</Link>
            </h2>
            <div className="site-meta">
              <span>{site.slug}</span>
              <span>{site.expiresAt ? `expires ${relativeDate(site.expiresAt)}` : "permanent"}</span>
            </div>
            <div className="inline-actions">
              <Link href={`/p/${site.slug}`}>view</Link>
              <Link href={`/p/${site.slug}/raw`}>raw</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
