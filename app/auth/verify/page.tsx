import Link from "next/link";

type AuthVerifyPageProps = {
  searchParams: Promise<{
    email?: string;
    next?: string;
    error?: string;
    claimSlug?: string;
    claimToken?: string;
  }>;
};

export default async function AuthVerifyPage({ searchParams }: AuthVerifyPageProps) {
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

        .auth-inline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: var(--muted);
        }

        .auth-form input {
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

        .auth-error {
          margin: 0;
          color: var(--danger);
        }

        .auth-resend {
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: var(--muted);
        }

        .auth-resend p {
          margin: 0;
        }

        .auth-resend button {
          width: fit-content;
          padding: 0;
          border: 0;
          background: transparent;
          color: var(--text);
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 0.18em;
        }
      `}</style>

      <div className="auth-frame">
        <nav>
          <Link href="/">mdshare</Link>
          <Link href="/auth/start">back</Link>
        </nav>

        <div className="auth-head">
          <h1>Enter your code</h1>
          <p>
            Sent to <strong>{params.email ?? "your email"}</strong>. If it does not show up,
            go back and send a new one.
          </p>
        </div>

        {params.error ? <p className="auth-error">{params.error}</p> : null}

        <form action="/api/auth/verify-code" method="post" className="auth-form">
          <input name="email" readOnly required type="email" value={params.email ?? ""} />
          <input
            name="code"
            inputMode="numeric"
            pattern="[0-9]{6}"
            placeholder="123456"
            required
          />
          <input name="next" type="hidden" value={params.next ?? "/dashboard/sites"} />
          <input name="claimSlug" type="hidden" value={params.claimSlug ?? ""} />
          <input name="claimToken" type="hidden" value={params.claimToken ?? ""} />
          <button type="submit">Continue</button>
        </form>

        <form action="/api/auth/request-code" className="auth-resend" method="post">
          <input name="email" type="hidden" value={params.email ?? ""} />
          <input name="next" type="hidden" value={params.next ?? "/dashboard/sites"} />
          <input name="claimSlug" type="hidden" value={params.claimSlug ?? ""} />
          <input name="claimToken" type="hidden" value={params.claimToken ?? ""} />
          <div className="auth-inline">
            <p>Need another code?</p>
            <button type="submit">Send a new one</button>
          </div>
          <p>Check spam if it does not land quickly.</p>
        </form>
      </div>
    </main>
  );
}
