import Link from "next/link";

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
          padding: 10px 14px;
          border-radius: 6px;
          background: var(--text);
          color: var(--bg);
        }

        .auth-actions .secondary {
          color: var(--muted);
        }

        .auth-actions .secondary:hover {
          color: var(--text);
        }
      `}</style>

      <div className="auth-frame">
        <nav>
          <Link href="/">mdshare</Link>
          <Link href="/dashboard/plan">plan</Link>
        </nav>

        <div className="auth-head">
          <h1>Payment received</h1>
          <p>Your plan is updating. This usually takes a moment. Head back to your links and keep the important ones live.</p>
        </div>

        <div className="auth-actions">
          <Link href="/dashboard/sites" className="primary">
            Go keep a link live
          </Link>
          <Link href="/dashboard/plan" className="secondary">
            View plan
          </Link>
        </div>
      </div>
    </main>
  );
}
