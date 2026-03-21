import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="checkout-page stack">
      <div className="section-head">
        <h1>payment received</h1>
        <p>your plan will update as soon as the webhook lands.</p>
      </div>
      <Link href="/dashboard/plan">back to plan</Link>
    </main>
  );
}
