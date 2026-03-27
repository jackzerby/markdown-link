import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { HomePrimaryCta } from "@/components/home-primary-cta";
import { TerminalFrame } from "@/components/terminal-frame";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard/sites");
  }
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
          font-size: clamp(1.8rem, 5vw, 2.8rem);
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

        .home-sample-label {
          margin: 0;
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
          padding: 0 24px;
          border: 2px solid var(--btn-border);
          border-radius: 6px;
          background: var(--btn-bg);
          color: var(--btn-text);
          cursor: pointer;
          box-shadow: 4px 4px 0 var(--btn-shadow);
          transition: transform 80ms ease, box-shadow 80ms ease;
        }

        .home-copy-button:hover {
          transform: translate(-1px, -1px);
          box-shadow: 5px 5px 0 var(--btn-shadow);
        }

        .home-copy-button:active {
          transform: translate(2px, 2px);
          box-shadow: 1px 1px 0 var(--btn-shadow);
        }

        .home-copy-button.is-copied {
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
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 8px;
          padding-top: 16px;
          border-top: 1px solid var(--line);
        }

        .home-links a {
          color: var(--text);
          text-decoration: underline;
          text-underline-offset: 0.18em;
        }

        .home-links a:hover {
          color: var(--accent);
        }
      `}</style>

      <TerminalFrame>
        <div className="home-body">
          <h1>Share markdown.</h1>
          <p className="home-sub">
            One command. No account required.
          </p>
          <div className="home-proof">
            <code>mdshare ./plan.md → mdshare.link/p/abcd-1234</code>
          </div>
          <HomePrimaryCta />
          <p className="home-sample-label">Free for 7 days. Permanent for $5/mo.</p>
        </div>

        <div className="home-links">
          <Link href="/p/demo">example</Link>
          <Link href="/auth/start">sign in</Link>
        </div>
      </TerminalFrame>
    </main>
  );
}
