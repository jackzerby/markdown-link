import { ResendCodeButton } from "@/components/resend-code-button";
import { TerminalFrame } from "@/components/terminal-frame";

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

        .auth-error {
          margin: 0;
          color: var(--danger);
        }

        .auth-resend {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 8px;
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

      <TerminalFrame>
        <div className="auth-head">
          <h1>Enter your code</h1>
          <p>
            Sent to <strong>{params.email ?? "your email"}</strong>. Check your inbox — it usually arrives within 30 seconds.
          </p>
        </div>

        {params.error ? <p className="auth-error">{params.error}</p> : null}

        <form action="/api/auth/verify-code" method="post" className="auth-form">
          <input name="email" type="hidden" value={params.email ?? ""} />
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

        <div className="auth-resend">
          <ResendCodeButton
            email={params.email ?? ""}
            next={params.next ?? "/dashboard/sites"}
            claimSlug={params.claimSlug ?? ""}
            claimToken={params.claimToken ?? ""}
          />
        </div>
      </TerminalFrame>
    </main>
  );
}
