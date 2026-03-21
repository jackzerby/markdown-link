import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { formatBytes, getUsageSnapshot } from "@/lib/usage";

export default async function DashboardPlanPage() {
  const user = await requireUser();
  const usage = await getUsageSnapshot(user.id, user.planTier);
  const siteUsageLabel = usage.siteLimit ? `${usage.activeSites} / ${usage.siteLimit}` : `${usage.activeSites}`;
  const storageUsageLabel = `${formatBytes(usage.storageBytes)} / ${formatBytes(usage.storageLimitBytes)}`;

  return (
    <section className="stack">
      <div className="section-head">
        <h1>plan</h1>
        <p>{user.planTier === "HOBBY" ? "Pro" : "free"}</p>
      </div>

      <div className="list">
        <div className="list-row">
          <span>active links</span>
          <span>{siteUsageLabel}</span>
          <span>{user.planTier === "HOBBY" ? "permanent" : "free tier cap"}</span>
        </div>
        <div className="list-row">
          <span>storage</span>
          <span>{storageUsageLabel}</span>
          <span>{user.planTier === "HOBBY" ? "paid storage" : "free storage"}</span>
        </div>
        <div className="list-row">
          <span>publishes this month</span>
          <span>{usage.monthlyPublishes}</span>
          <span>{usage.expiringSites} expiring</span>
        </div>
        <div className="list-row">
          <span>api keys</span>
          <span>{usage.apiKeys}</span>
          <span>{usage.domains} domains</span>
        </div>
        <div className="list-row">
          <span>price</span>
          <span>{user.planTier === "HOBBY" ? "$5 / mo" : "free"}</span>
          <span>{user.planTier === "HOBBY" ? "billed monthly" : "—"}</span>
        </div>
      </div>

      {user.planTier === "HOBBY" ? (
        <Link href="/manage/billing">manage billing</Link>
      ) : (
        <form action="/api/stripe/checkout" method="post">
          <button className="button" type="submit">
            upgrade to pro — $5/mo
          </button>
        </form>
      )}

      <p className="muted">
        {user.planTier === "HOBBY"
          ? "paid links stay live, support custom domains, and use the higher storage limit."
          : "free links expire automatically. upgrade to keep them live and raise limits."}
      </p>
    </section>
  );
}
