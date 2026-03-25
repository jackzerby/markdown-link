import Link from "next/link";

import { HomePrimaryCta } from "@/components/home-primary-cta";

export default function HomePage() {
  return (
    <main className="home">
      <style>{`
        .home {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
        }

        .home-frame {
          width: min(560px, 100%);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .home-body {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .home h1 {
          margin: 0;
          font-size: clamp(2.4rem, 7vw, 4.4rem);
          line-height: 0.95;
          letter-spacing: -0.06em;
          font-weight: 600;
        }

        .home-sub {
          margin: 0;
          max-width: 38ch;
          line-height: 1.7;
          color: var(--muted);
        }

        .home-proof {
          display: grid;
          gap: 8px;
          margin-top: 2px;
          color: var(--muted);
        }

        .home-proof code {
          display: block;
          width: fit-content;
          max-width: 100%;
          padding: 8px 10px;
          border-radius: 10px;
          background: var(--surface);
          color: var(--text);
          overflow-wrap: anywhere;
        }

        .home-sample {
          display: grid;
          gap: 10px;
          margin-top: 4px;
        }

        .home-sample-label {
          margin: 0;
          color: var(--muted);
        }

        .home-sample-doc {
          display: grid;
          gap: 8px;
          padding: 18px;
          border-radius: 14px;
          background: var(--surface);
        }

        .home-sample-doc h2,
        .home-sample-doc p,
        .home-sample-doc ul {
          margin: 0;
        }

        .home-sample-doc h2 {
          font-size: 1rem;
          font-weight: 600;
        }

        .home-sample-doc p {
          max-width: 44ch;
        }

        .home-sample-doc ul {
          padding-left: 18px;
          color: var(--muted);
        }

        .home-primary {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          position: relative;
        }

        .home-copy-button {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0 20px;
          border: 0;
          border-radius: 999px;
          background: var(--text);
          color: var(--bg);
          cursor: pointer;
          transition:
            transform 120ms ease,
            opacity 120ms ease;
        }

        .home-copy-button:hover {
          transform: translateY(-1px);
        }

        .home-copy-button:active {
          transform: translateY(1px) scale(0.985);
        }

        .home-copy-button.is-copied {
          opacity: 0.96;
          animation: home-copy-pop 320ms ease;
        }

        .home-primary-note {
          margin: 0;
          color: var(--muted);
        }

        .home-burst {
          position: absolute;
          inset: 0 auto auto 0;
          width: 300px;
          height: 120px;
          pointer-events: none;
        }

        .home-burst-item {
          position: absolute;
          left: 108px;
          top: 10px;
          opacity: 0;
          transform: translate3d(0, 0, 0) scale(0.72) rotate(0deg);
        }

        .home-burst-item.is-live {
          animation: home-burst 900ms cubic-bezier(0.18, 0.78, 0.28, 1) forwards;
        }

        .home-burst .burst-1 {
          --tx: -112px;
          --ty: -42px;
          --tr: -18deg;
          animation-delay: 0ms;
        }

        .home-burst .burst-2 {
          --tx: -68px;
          --ty: -60px;
          --tr: -10deg;
          animation-delay: 10ms;
        }

        .home-burst .burst-3 {
          --tx: -22px;
          --ty: -72px;
          --tr: -4deg;
          animation-delay: 28ms;
        }

        .home-burst .burst-4 {
          --tx: 34px;
          --ty: -68px;
          --tr: 6deg;
          animation-delay: 34ms;
        }

        .home-burst .burst-5 {
          --tx: 84px;
          --ty: -48px;
          --tr: 12deg;
          animation-delay: 22ms;
        }

        .home-burst .burst-6 {
          --tx: 122px;
          --ty: -18px;
          --tr: 20deg;
          animation-delay: 45ms;
        }

        .home-burst .burst-7 {
          --tx: -94px;
          --ty: 4px;
          --tr: -12deg;
          animation-delay: 18ms;
        }

        .home-burst .burst-8 {
          --tx: -44px;
          --ty: 30px;
          --tr: -8deg;
          animation-delay: 52ms;
        }

        .home-burst .burst-9 {
          --tx: 6px;
          --ty: 42px;
          --tr: 5deg;
          animation-delay: 36ms;
        }

        .home-burst .burst-10 {
          --tx: 62px;
          --ty: 34px;
          --tr: 10deg;
          animation-delay: 58ms;
        }

        .home-burst .burst-11 {
          --tx: 112px;
          --ty: 16px;
          --tr: 16deg;
          animation-delay: 26ms;
        }

        .home-burst .burst-12 {
          --tx: 142px;
          --ty: -6px;
          --tr: 22deg;
          animation-delay: 40ms;
        }

        @keyframes home-copy-pop {
          0% {
            transform: scale(1);
          }

          45% {
            transform: scale(1.05);
          }

          100% {
            transform: scale(1);
          }
        }

        @keyframes home-burst {
          0% {
            opacity: 0;
            transform: translate3d(0, 0, 0) scale(0.72) rotate(0deg);
          }

          18% {
            opacity: 1;
          }

          100% {
            opacity: 0;
            transform: translate3d(var(--tx), var(--ty), 0) scale(1.12) rotate(var(--tr));
          }
        }

        .home-links {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          color: var(--muted);
        }

        .home-links a {
          color: var(--muted);
          text-decoration: none;
        }

        .home-links a:hover {
          color: var(--text);
        }
      `}</style>

      <div className="home-frame">
        <div className="home-body">
          <h1>Share markdown.</h1>
          <p className="home-sub">
            Publish a markdown file as a clean, readable link.
            <br />
            One command from Claude Code or Codex.
          </p>
          <HomePrimaryCta />
          <div className="home-proof">
            <span>Typical flow:</span>
            <code>mdshare ./plan.md → mdshare.link/p/abcd-1234</code>
          </div>
          <div className="home-sample">
            <p className="home-sample-label">What the link looks like:</p>
            <div aria-hidden="true" className="home-sample-doc">
              <h2>Q3 launch plan</h2>
              <p>Timeline, owners, and open questions — one link instead of a Slack wall.</p>
              <ul>
                <li>Landing page — ship by July 12</li>
                <li>Announce on Twitter + changelog</li>
                <li>Collect feedback in shared doc</li>
              </ul>
            </div>
            <p className="home-sample-label">1,000+ docs shared so far</p>
            <p className="home-sample-label">Free links expire after 7 days. Keep them live for $5/mo.</p>
          </div>
        </div>

        <div className="home-links">
          <Link href="/p/demo">demo</Link>
          <Link href="/auth/start">sign in</Link>
        </div>
      </div>
    </main>
  );
}
