type TerminalFrameProps = {
  children: React.ReactNode;
};

export function TerminalFrame({ children }: TerminalFrameProps) {
  return (
    <div className="terminal-frame">
      <style>{`
        .terminal-frame {
          width: min(620px, 100%);
          border: 1px solid var(--line-strong);
          border-radius: 12px;
          overflow: hidden;
        }

        .terminal-titlebar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: var(--surface);
        }

        .terminal-dots {
          display: flex;
          gap: 6px;
        }

        .terminal-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .terminal-dot-red { background: #ff5f57; }
        .terminal-dot-yellow { background: #febc2e; }
        .terminal-dot-green { background: #28c840; }

        .terminal-title {
          flex: 1;
          text-align: center;
          color: var(--muted);
          font-size: 12px;
          margin-right: 44px;
        }

        .terminal-body {
          padding: 32px 28px;
        }

        @media (max-width: 640px) {
          .terminal-frame {
            border-radius: 0;
            border-left: 0;
            border-right: 0;
          }

          .terminal-body {
            padding: 24px 20px;
          }
        }
      `}</style>
      <div className="terminal-titlebar">
        <div className="terminal-dots">
          <span className="terminal-dot terminal-dot-red" />
          <span className="terminal-dot terminal-dot-yellow" />
          <span className="terminal-dot terminal-dot-green" />
        </div>
        <span className="terminal-title">mdshare.link</span>
      </div>
      <div className="terminal-body">
        {children}
      </div>
    </div>
  );
}
