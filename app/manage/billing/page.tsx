import Link from "next/link";

import { requireUser } from "@/lib/auth";

export default async function BillingManagementPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireUser();
  const params = searchParams ? await searchParams : {};
  const error = Array.isArray(params.error) ? params.error[0] : params.error;

  return (
    <main className="page billing-view">
      <style>{`
        .billing-view {
          width: min(760px, calc(100vw - 32px));
          padding-top: 32px;
        }

        .billing-view .billing-nav {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 28px;
          color: var(--muted);
        }

        .billing-view .billing-links {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .billing-view .billing-links a {
          text-decoration: none;
        }

        .billing-view .billing-links a:hover {
          color: var(--text);
        }

        @media (max-width: 820px) {
          .billing-view {
            width: calc(100vw - 24px);
            padding-top: 20px;
          }
        }
      `}</style>

      <section className="stack">
        <div className="billing-nav">
          <span>billing</span>
          <div className="billing-links">
            <Link href="/dashboard/sites">workspace</Link>
            <Link href="/dashboard/plan">plan</Link>
          </div>
        </div>

        <div className="section-head">
          <h1>Billing</h1>
          <p>Managed through Stripe. Update payment, view invoices, or cancel.</p>
        </div>

        {error ? <p className="error">{error}</p> : null}

        <form action="/api/stripe/customer-portal" method="post">
          <button className="button" type="submit">
            Open billing portal
          </button>
        </form>

        <div className="dashboard-actions">
          <Link className="dashboard-text-link" href="/dashboard/plan">
            Back to plan
          </Link>
          <Link className="dashboard-text-link" href="/dashboard/sites">
            Back to workspace
          </Link>
        </div>
      </section>
    </main>
  );
}
