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
        <h1>claim publish</h1>
        <p>{site.title ?? slug}</p>
      </div>
      <p>expires {relativeDate(site.expiresAt) ?? "soon"}.</p>
      <div className="inline-actions">
        <Link
          href={`/auth/start?claimSlug=${slug}&claimToken=${token ?? ""}&next=/dashboard/sites/${slug}`}
        >
          sign in to claim
        </Link>
        <Link href={`/p/${slug}`}>open publish</Link>
      </div>
    </main>
  );
}
