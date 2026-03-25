import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

type DashboardDomainsPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
    hostname?: string;
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
    <section className="domains-view">
      <style>{`
        .domains-view {
          width: min(1040px, calc(100vw - 32px));
          margin: 0 auto;
          padding: 28px 0 72px;
          display: grid;
          gap: 24px;
        }

        .domains-view form {
          display: grid;
          gap: 12px;
          padding: 18px;
          border-radius: 8px;
          background: var(--surface);
        }

        .domains-view input,
        .domains-view button {
          border-radius: 6px;
        }

        .domains-view .button {
          border: 0;
          border-radius: 6px;
          align-self: start;
        }

        .domains-view .list {
          gap: 0;
        }

        .domains-view .site-card {
          padding: 18px 0;
          border: 0;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          background: transparent;
        }

        .domains-view .site-card:first-child {
          border-top: 0;
        }

        .domains-view .site-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 16px;
        }

        .domains-view .site-head h2,
        .domains-view .site-head p {
          margin: 0;
        }

        .domains-view .site-head p {
          color: var(--muted);
        }

        .domains-view .viewer-meta {
          border: 0;
          background: var(--surface);
          border-radius: 8px;
          padding: 16px 18px;
        }

        .domains-view .viewer-meta p {
          margin: 0;
        }

        @media (max-width: 820px) {
          .domains-view {
            width: calc(100vw - 24px);
            padding: 20px 0 56px;
          }

          .domains-view .site-head {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="section-head">
        <h1>Domains</h1>
        <p>Use your own domain for published links.</p>
      </div>

      {params.error && !params.hostname ? <p className="error">{params.error}</p> : null}
      {params.success && !params.hostname ? <p>{params.success}</p> : null}

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
              <p>
                {domain.verifiedAt && isLikelyApexDomain(domain.hostname)
                  ? "ownership verified"
                  : domain.status.toLowerCase()}
              </p>
            </div>

            {params.hostname === domain.hostname && params.error ? <p className="error">{params.error}</p> : null}
            {params.hostname === domain.hostname && params.success ? <p>{params.success}</p> : null}

            <div className="viewer-meta stack">
              <p>TXT {getChallengeHost(domain.hostname)} = {domain.verificationToken}</p>
              {isLikelyApexDomain(domain.hostname) ? (
                <p>ALIAS or ANAME {domain.hostname} = {domain.dnsTarget ?? "domains.mdshare.link"}</p>
              ) : (
                <p>CNAME {domain.hostname} = {domain.dnsTarget ?? "domains.mdshare.link"}</p>
              )}
              <p>
                {domain.verifiedAt
                  ? isLikelyApexDomain(domain.hostname)
                    ? `ownership verified ${domain.verifiedAt.toISOString()}`
                    : `verified ${domain.verifiedAt.toISOString()}`
                  : "pending verification"}
              </p>
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
