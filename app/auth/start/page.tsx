import Link from "next/link";

type AuthStartPageProps = {
  searchParams: Promise<{
    claimSlug?: string;
    claimToken?: string;
    next?: string;
    message?: string;
    debugCode?: string;
  }>;
};

export default async function AuthStartPage({ searchParams }: AuthStartPageProps) {
  const params = await searchParams;

  return (
    <main className="auth-shell">
      <style>{`
        .auth-shell {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
        }

        .auth-frame {
          width: min(400px, 100%);
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .auth-shell nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--muted);
        }

        .auth-shell nav a {
          color: var(--muted);
          text-decoration: none;
        }

        .auth-shell nav a:hover {
          color: var(--text);
        }

        .auth-head {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .auth-head h1 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .auth-head p {
          margin: 0;
          color: var(--muted);
          line-height: 1.7;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .auth-form input[type="email"] {
          padding: 10px 12px;
          border: 1px solid var(--line-strong);
          border-radius: 6px;
          background: var(--bg);
        }

        .auth-form button {
          padding: 10px 14px;
          border: 0;
          border-radius: 6px;
          background: var(--text);
          color: var(--bg);
          cursor: pointer;
        }

        .auth-notice {
          margin: 0;
          color: var(--muted);
        }
      `}</style>

      <div className="auth-frame">
        <nav>
          <Link href="/">mdshare</Link>
          <Link href="/p/demo">example</Link>
        </nav>

        <div className="auth-head">
          <h1>Sign in</h1>
          <p>We&apos;ll email you a 6-digit code. No password needed.</p>
        </div>

        {params.message ? <p className="auth-notice">{params.message}</p> : null}
        {params.debugCode ? <p className="auth-notice">dev code: {params.debugCode}</p> : null}

        <form action="/api/auth/request-code" method="post" className="auth-form">
          <input
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
          <input name="next" type="hidden" value={params.next ?? "/dashboard/sites"} />
          <input name="claimSlug" type="hidden" value={params.claimSlug ?? ""} />
          <input name="claimToken" type="hidden" value={params.claimToken ?? ""} />
          <button type="submit">Send code</button>
        </form>
      </div>
    </main>
  );
}
