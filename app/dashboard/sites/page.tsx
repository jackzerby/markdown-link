import Link from "next/link";

import { DashboardPublishForm } from "@/components/dashboard-publish-form";
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
    <section className="dashboard-sites-view">
      <style>{`
        .dashboard-sites-view {
          width: min(1120px, calc(100vw - 32px));
          margin: 0 auto;
          padding: 28px 0 72px;
          display: grid;
          gap: 24px;
        }

        .dashboard-sites-view .section-head h1 {
          font-size: clamp(1.9rem, 3vw, 2.8rem);
          letter-spacing: -0.04em;
        }

        .dashboard-sites-view .section-head p {
          max-width: 60ch;
          color: var(--muted);
        }

        .dashboard-sites-view form {
          display: grid;
          gap: 12px;
          padding: 20px;
          background: var(--surface);
          border-radius: 8px;
        }

        .dashboard-sites-view input,
        .dashboard-sites-view textarea {
          border: 1px solid var(--line-strong);
          border-radius: 6px;
          background: var(--bg);
        }

        .dashboard-sites-view textarea {
          min-height: 220px;
        }

        .dashboard-sites-view .button {
          border-radius: 6px;
          border: 0;
          align-self: start;
        }

        .dashboard-sites-view .site-grid {
          gap: 0;
        }

        .dashboard-sites-view .site-card {
          padding: 18px 0;
          border: 0;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          background: transparent;
        }

        .dashboard-sites-view .site-card:first-child {
          border-top: 0;
        }

        .dashboard-sites-view .site-card h2 {
          font-size: 1rem;
          line-height: 1.4;
        }

        .dashboard-sites-view .site-meta {
          color: var(--muted);
        }

        .dashboard-sites-view .inline-actions {
          gap: 14px;
          font-size: 0.92rem;
        }

        @media (max-width: 820px) {
          .dashboard-sites-view {
            width: calc(100vw - 24px);
            padding: 20px 0 56px;
          }
        }
      `}</style>

      <div className="section-head">
        <h1>Links</h1>
        <p>Markdown files you've published.</p>
      </div>

      {error ? <p className="error">{error}</p> : null}

      <DashboardPublishForm initialError={error} />

      <div className="site-grid">
        {sites.length === 0 ? <p>No links yet. Publish your first markdown file above, or use the CLI.</p> : null}
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
