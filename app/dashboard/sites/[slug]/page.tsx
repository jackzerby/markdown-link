import Link from "next/link";
import { notFound } from "next/navigation";

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

  const isPro = user.planTier === "HOBBY";
  const isPasswordProtected = site.visibility === "PASSWORD";

  return (
    <section className="site-detail-view">
      <style>{`
        .site-detail-view {
          width: 100%;
          padding: 0 0 72px;
          display: grid;
          gap: 24px;
        }

        .site-detail-view .section-head h1 {
          font-size: clamp(1.2rem, 2.5vw, 1.5rem);
          letter-spacing: -0.02em;
        }

        .site-detail-meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
        }

        .site-detail-meta-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 14px 16px;
          background: var(--surface);
          border: 1px solid var(--line-strong);
          border-radius: 6px;
        }

        .site-detail-meta-label {
          margin: 0;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--muted);
        }

        .site-detail-meta-value {
          margin: 0;
          font-weight: 600;
        }

        .site-detail-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }

        .site-detail-actions .button {
          color: var(--btn-text);
        }

        .site-detail-actions .button.secondary {
          color: var(--text);
        }

        .site-detail-actions a:not(.button) {
          color: var(--accent);
        }

        .site-detail-password {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .site-detail-password input {
          max-width: 240px;
        }

        @media (max-width: 640px) {
          .site-detail-view {
            width: calc(100vw - 24px);
            padding: 20px 0 56px;
          }

          .site-detail-password {
            flex-direction: column;
          }

          .site-detail-password input {
            max-width: 100%;
          }
        }
      `}</style>

      <div className="section-head">
        <h1>{site.title ?? slug}</h1>
        <p>{site.description ?? "Published markdown file"}</p>
      </div>

      {claimed === "1" && (
        <div className="notice stack">
          {isPro ? (
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

      <div className="site-detail-meta">
        <div className="site-detail-meta-item">
          <p className="site-detail-meta-label">URL</p>
          <p className="site-detail-meta-value">{site.slug}</p>
        </div>
        <div className="site-detail-meta-item">
          <p className="site-detail-meta-label">Status</p>
          <p className="site-detail-meta-value">
            <span className={site.expiresAt ? "status-badge expiring" : "status-badge permanent"}>
              {site.expiresAt ? `expires ${relativeDate(site.expiresAt)}` : "permanent"}
            </span>
          </p>
        </div>
        <div className="site-detail-meta-item">
          <p className="site-detail-meta-label">Access</p>
          <p className="site-detail-meta-value">{isPasswordProtected ? "Password protected" : "Public"}</p>
        </div>
      </div>

      <div className="site-detail-actions">
        <Link href={`/p/${site.slug}`} className="button">View public link</Link>
        <Link href={`/p/${site.slug}/raw`} className="button secondary">View raw</Link>
        {!isPro && (
          <Link href={`/dashboard/plan?${planParams.toString()}`}>Upgrade to Pro</Link>
        )}
      </div>

      <form action={`/api/publishes/${site.slug}/password`} className="site-detail-password" method="post">
        <input name="password" placeholder="Set a password" type="password" />
        <input name="intent" type="hidden" value="set" />
        <button className="button" type="submit">Save</button>
      </form>

      {isPasswordProtected && (
        <form action={`/api/publishes/${site.slug}/password`} method="post">
          <input name="intent" type="hidden" value="clear" />
          <button className="button secondary" type="submit">Remove password</button>
        </form>
      )}
    </section>
  );
}
