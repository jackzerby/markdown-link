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
            : "Free links expire in 7 days. Pro ($5/mo) keeps important links live, branded, and ready to share."}
        </p>
      </div>

      {error ? <p className="error">{error}</p> : null}

      {!isPro && contextSlug && contextName ? (
        <div className="dashboard-panel stack">
          <p className="dashboard-panel-label">the link you care about</p>
          <div className="dashboard-list">
            <p>{contextName}</p>
            <p>
              {contextExpiresAt
                ? `This link expires ${contextExpiresAt}.`
                : source === "claim"
                  ? "This is the link you were about to claim."
                  : "This is the link you were just looking at."}
            </p>
            <p>Pro keeps important links live on the same URL.</p>
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
          <p className="muted">{isPro ? "permanent links" : "free tier cap"}</p>
        </article>
        <article className="dashboard-stat">
          <p className="dashboard-stat-label">storage</p>
          <p className="dashboard-stat-value">{storageUsageLabel}</p>
          <p className="muted">{isPro ? "pro storage" : "free storage"}</p>
        </article>
        <article className="dashboard-stat">
          <p className="dashboard-stat-label">publishes this month</p>
          <p className="dashboard-stat-value">{usage.monthlyPublishes}</p>
          <p className="muted">{usage.expiringSites} expiring</p>
        </article>
        <article className="dashboard-stat">
          <p className="dashboard-stat-label">api keys + domains</p>
          <p className="dashboard-stat-value">
            {usage.apiKeys} keys / {usage.domains} domains
          </p>
          <p className="muted">automation + branded links</p>
        </article>
      </div>

      <div className="dashboard-panel stack">
        <p className="dashboard-panel-label">{isPro ? "current plan" : "pro includes"}</p>
        <div className="dashboard-list">
          <p>Permanent links</p>
          <p>Higher storage and publish limits</p>
          <p>{isPro ? "Billing via Stripe" : "Custom domains"}</p>
        </div>
      </div>

      {!isPro && (
        <div className="dashboard-panel stack">
          <p className="dashboard-panel-label">why people upgrade</p>
          <div className="dashboard-list">
            <p>Keep a launch note, plan, or memo on the same URL</p>
            <p>Share on your own domain when the link matters</p>
            <p>Use mdshare as part of your daily workflow without expiry anxiety</p>
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
              Upgrade to pro
            </button>
          </form>
        )}
        <Link className="dashboard-text-link" href="/dashboard/sites">
          Back to sites
        </Link>
      </div>

      {!isPro && (
        <p className="muted">Best for quick shares: free expires. Best for docs you care about: Pro keeps them live.</p>
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
