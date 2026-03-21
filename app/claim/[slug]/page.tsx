import Link from "next/link";
import { notFound } from "next/navigation";

import { db } from "@/lib/db";
import { relativeDate } from "@/lib/utils";

type ClaimPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function ClaimPage({ params, searchParams }: ClaimPageProps) {
  const { slug } = await params;
  const { token } = await searchParams;
  const site = await db.site.findUnique({
    where: { slug },
    include: { claim: true, currentVersion: true },
  });

  if (!site || !site.claim || site.claim.claimedAt) {
    notFound();
  }

  return (
    <main className="claim-page stack">
      <div className="section-head">
        <h1>keep this publish</h1>
        <p>{site.title ?? slug}</p>
      </div>
      <div className="notice stack">
        <p>free publishes expire. claiming this one ties it to your account so you can keep it live by upgrading to Pro.</p>
        <p>expires {relativeDate(site.expiresAt) ?? "soon"}.</p>
      </div>
      <Link
        className="button"
        href={`/auth/start?claimSlug=${slug}&claimToken=${token ?? ""}&next=${encodeURIComponent(`/dashboard/sites/${slug}?claimed=1`)}`}
      >
        sign in to claim
      </Link>
      <div className="inline-actions">
        <Link href={`/p/${slug}`}>open publish</Link>
        <Link href="/dashboard/plan">see plans</Link>
      </div>
    </main>
  );
}
