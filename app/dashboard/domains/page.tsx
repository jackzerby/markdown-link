import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

type DashboardDomainsPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

function isLikelyApexDomain(hostname: string) {
  return hostname.split(".").length <= 2;
}

function getChallengeHost(hostname: string) {
  return `_markdown-link.${hostname}`;
}

export default async function DashboardDomainsPage({
  searchParams,
}: DashboardDomainsPageProps) {
  const user = await requireUser();
  const params = searchParams ? await searchParams : {};
  const domains = await db.domain.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="stack">
      <div className="section-head">
        <h1>domains</h1>
        <p>add a domain, set the dns records below, then click verify.</p>
      </div>

      {params.error ? <p className="error">{params.error}</p> : null}
      {params.success ? <p>{params.success}</p> : null}

      <form action="/api/dashboard/domains" className="stack" method="post">
        <input name="hostname" placeholder="docs.example.com" required />
        <button className="button" type="submit">
          add domain
        </button>
      </form>

      <div className="list">
        {domains.length === 0 ? <p>no domains yet.</p> : null}
        {domains.map((domain) => (
          <article key={domain.id} className="site-card stack">
            <div className="site-head">
              <h2>{domain.hostname}</h2>
              <p>{domain.status.toLowerCase()}</p>
            </div>

            <div className="viewer-meta stack">
              <p>TXT {getChallengeHost(domain.hostname)} = {domain.verificationToken}</p>
              {isLikelyApexDomain(domain.hostname) ? (
                <p>ALIAS or ANAME {domain.hostname} = {domain.dnsTarget ?? "domains.mdshare.link"}</p>
              ) : (
                <p>CNAME {domain.hostname} = {domain.dnsTarget ?? "domains.mdshare.link"}</p>
              )}
              <p>{domain.verifiedAt ? `verified ${domain.verifiedAt.toISOString()}` : "pending verification"}</p>
            </div>

            <form action="/api/dashboard/domains/verify" className="stack" method="post">
              <input name="hostname" type="hidden" value={domain.hostname} />
              <button className="button" type="submit">
                check dns
              </button>
            </form>
          </article>
        ))}
      </div>
    </section>
  );
}
