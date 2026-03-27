import Link from "next/link";
import { notFound } from "next/navigation";

import { TerminalFrame } from "@/components/terminal-frame";
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

  const planParams = new URLSearchParams({
    source: "claim",
    slug,
    title: site.title ?? slug,
  });
  if (site.expiresAt) {
    planParams.set("expiresAt", site.expiresAt.toISOString());
  }

  return (
    <main className="claim-page stack">
      <TerminalFrame>
      <div className="section-head">
        <h1>Keep this link live</h1>
        <p>{site.title ?? slug}</p>
      </div>
      <div className="notice stack">
        <p>Free links expire after 7 days. Sign in to claim this one, then upgrade to Pro to keep it permanently.</p>
        <p>Expires {relativeDate(site.expiresAt) ?? "soon"}</p>
      </div>
      <Link
        className="button"
        href={`/auth/start?claimSlug=${slug}&claimToken=${token ?? ""}&next=${encodeURIComponent(`/dashboard/sites/${slug}?claimed=1`)}`}
      >
        Sign in to claim this link
      </Link>
      <div className="inline-actions">
        <Link href={`/p/${slug}`}>View link</Link>
        <Link href={`/dashboard/plan?${planParams.toString()}`}>See Pro plan</Link>
      </div>
      </TerminalFrame>
    </main>
  );
}
