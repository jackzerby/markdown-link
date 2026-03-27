import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { TerminalFrame } from "@/components/terminal-frame";

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
  const user = await getCurrentUser();
  if (user) {
    redirect(params.next ?? "/dashboard/sites");
  }

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
          padding: 10px 16px;
          border: 2px solid var(--btn-border);
          border-radius: 6px;
          background: var(--btn-bg);
          color: var(--btn-text);
          cursor: pointer;
          box-shadow: 4px 4px 0 var(--btn-shadow);
          transition: transform 80ms ease, box-shadow 80ms ease;
        }

        .auth-form button:hover {
          transform: translate(-1px, -1px);
          box-shadow: 5px 5px 0 var(--btn-shadow);
        }

        .auth-form button:active {
          transform: translate(2px, 2px);
          box-shadow: 1px 1px 0 var(--btn-shadow);
        }

        .auth-notice {
          margin: 0;
          color: var(--muted);
        }
      `}</style>

      <TerminalFrame>
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
      </TerminalFrame>
    </main>
  );
}
