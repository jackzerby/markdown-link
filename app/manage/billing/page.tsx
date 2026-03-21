import Link from "next/link";

import { requireUser } from "@/lib/auth";

export default async function BillingManagementPage() {
  await requireUser();

  return (
    <main className="checkout-page stack">
      <div className="section-head">
        <h1>billing</h1>
        <p>open the customer portal.</p>
      </div>

      <form action="/api/stripe/customer-portal" method="post">
        <button className="button" type="submit">
          open stripe portal
        </button>
      </form>

      <Link href="/dashboard/plan">back</Link>
    </main>
  );
}
