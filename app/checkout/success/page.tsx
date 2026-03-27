import Link from "next/link";

import { TerminalFrame } from "@/components/terminal-frame";

export default function CheckoutSuccessPage() {
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

        .auth-actions {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .auth-actions a {
          text-decoration: none;
        }

        .auth-actions .primary {
          padding: 10px 16px;
          border: 2px solid var(--btn-border);
          border-radius: 6px;
          background: var(--btn-bg);
          color: var(--btn-text);
          box-shadow: 4px 4px 0 var(--btn-shadow);
          transition: transform 80ms ease, box-shadow 80ms ease;
        }

        .auth-actions .primary:hover {
          transform: translate(-1px, -1px);
          box-shadow: 5px 5px 0 var(--btn-shadow);
        }

        .auth-actions .primary:active {
          transform: translate(2px, 2px);
          box-shadow: 1px 1px 0 var(--btn-shadow);
        }

        .auth-actions .secondary {
          color: var(--muted);
        }

        .auth-actions .secondary:hover {
          color: var(--text);
        }
      `}</style>

      <TerminalFrame>
        <div className="auth-head">
          <h1>Payment received</h1>
          <p>Your Pro plan is now active. Your existing links will no longer expire.</p>
        </div>

        <div className="auth-actions">
          <Link href="/dashboard/sites" className="primary">
            View your links
          </Link>
          <Link href="/dashboard/plan" className="secondary">
            View plan
          </Link>
        </div>
      </TerminalFrame>
    </main>
  );
}
