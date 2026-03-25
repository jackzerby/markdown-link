import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { formatBytes, getUsageSnapshot } from "@/lib/usage";

export default async function DashboardPlanPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await requireUser();
  const params = searchParams ? await searchParams : {};
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const source = Array.isArray(params.source) ? params.source[0] : params.source;
  const contextSlug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const contextTitle = Array.isArray(params.title) ? params.title[0] : params.title;
  const expiresAtParam = Array.isArray(params.expiresAt) ? params.expiresAt[0] : params.expiresAt;
  const usage = await getUsageSnapshot(user.id, user.planTier);
  const isPro = user.planTier === "HOBBY";
  const siteUsageLabel = usage.siteLimit
    ? `${usage.activeSites} / ${usage.siteLimit}`
    : `${usage.activeSites}`;
  const storageUsageLabel = `${formatBytes(usage.storageBytes)} / ${formatBytes(
    usage.storageLimitBytes,
  )}`;
  const contextExpiresAt =
    expiresAtParam && !Number.isNaN(Date.parse(expiresAtParam))
      ? formatPlanExpiry(expiresAtParam)
      : null;
  const contextName = contextTitle || contextSlug;

  return (
    <section className="dashboard-section">
      <div className="section-head">
        <h1>{isPro ? "Pro" : "Plan"}</h1>
        <p>
          {isPro
            ? "Your links are permanent. Manage billing and usage below."
            : "Free links expire in 7 days. Pro ($5/mo) removes expiry."}
        </p>
      </div>

      {error ? <p className="error">{error}</p> : null}

      {!isPro && contextSlug && contextName ? (
        <div className="dashboard-panel stack">
          <p className="dashboard-panel-label">The link you came from</p>
          <div className="dashboard-list">
            <p>{contextName}</p>
            <p>
              {contextExpiresAt
                ? `This link expires ${contextExpiresAt}.`
                : source === "claim"
                  ? "This is the link you were about to claim."
                  : "This is the link you were just looking at."}
            </p>
            <p>Upgrade so this link never expires.</p>
          </div>
          <div className="inline-actions">
            <Link href={`/p/${contextSlug}`}>open link</Link>
            {source === "site" ? <Link href={`/dashboard/sites/${contextSlug}`}>back to site</Link> : null}
          </div>
        </div>
      ) : null}

      <div className="dashboard-stat-grid">
        <article className="dashboard-stat">
          <p className="dashboard-stat-label">active links</p>
          <p className="dashboard-stat-value">{siteUsageLabel}</p>
          <p className="muted">{isPro ? "Permanent links" : "Free tier cap"}</p>
        </article>
        <article className="dashboard-stat">
          <p className="dashboard-stat-label">storage</p>
          <p className="dashboard-stat-value">{storageUsageLabel}</p>
          <p className="muted">{isPro ? "Pro storage" : "Free storage"}</p>
        </article>
        <article className="dashboard-stat">
          <p className="dashboard-stat-label">publishes this month</p>
          <p className="dashboard-stat-value">{usage.monthlyPublishes}</p>
          <p className="muted">{usage.expiringSites} expiring</p>
        </article>
        <article className="dashboard-stat">
          <p className="dashboard-stat-label">api keys</p>
          <p className="dashboard-stat-value">{usage.apiKeys}</p>
          <p className="muted">CLI publishing without signing in each time</p>
        </article>
      </div>

      <div className="dashboard-panel stack">
        <p className="dashboard-panel-label">{isPro ? "current plan" : "pro includes"}</p>
        <div className="dashboard-list">
          <p>Permanent links</p>
          <p>Higher storage and active link limits</p>
        </div>
      </div>

      {!isPro && (
        <div className="dashboard-panel stack">
          <p className="dashboard-panel-label">why people upgrade</p>
          <div className="dashboard-list">
            <p>Keep a launch note, plan, or memo on the same URL</p>
            <p>Publish from the CLI without thinking about expiry</p>
            <p>Publish daily without worrying about links expiring</p>
          </div>
        </div>
      )}

      <div className="dashboard-actions">
        {isPro ? (
          <Link className="button" href="/manage/billing">
            Manage billing
          </Link>
        ) : (
          <form action="/api/stripe/checkout" method="post">
            <button className="button" type="submit">
              Upgrade to Pro
            </button>
          </form>
        )}
        <Link className="dashboard-text-link" href="/dashboard/sites">
          Back to links
        </Link>
      </div>

      {!isPro && (
        <p className="muted">Free is great for quick shares. Pro is for links you need to keep.</p>
      )}
    </section>
  );
}

function formatPlanExpiry(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}
