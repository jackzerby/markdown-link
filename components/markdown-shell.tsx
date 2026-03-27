import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { MarkdownCopyButton } from "@/components/markdown-copy-button";

type MarkdownShellProps = {
  source: string;
  mode?: "rendered" | "raw";
  renderedHref?: string;
  rawHref?: string;
  targetId: string;
  brandFooter?: boolean;
};

export function MarkdownShell({
  source,
  mode = "rendered",
  renderedHref,
  rawHref,
  targetId,
  brandFooter = false,
}: MarkdownShellProps) {
  return (
    <section className="markdown-shell">
      <div className="markdown-controls">
        <nav className="markdown-toggle" aria-label="View mode">
          {renderedHref ? (
            <a
              className={mode === "rendered" ? "active" : undefined}
              href={renderedHref}
            >
              rendered
            </a>
          ) : (
            <span className={mode === "rendered" ? "active" : undefined}>rendered</span>
          )}
          {rawHref ? (
            <a className={mode === "raw" ? "active" : undefined} href={rawHref}>
              markdown
            </a>
          ) : (
            <span className={mode === "raw" ? "active" : undefined}>markdown</span>
          )}
        </nav>

        <MarkdownCopyButton mode={mode} source={source} targetId={targetId} />
      </div>

      {mode === "rendered" ? (
        <article className="markdown-rendered prose" id={targetId}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table({ children }) {
                return (
                  <div className="markdown-table-wrap">
                    <table>{children}</table>
                  </div>
                );
              },
            }}
          >
            {source}
          </ReactMarkdown>
        </article>
      ) : (
        <pre className="markdown-raw" id={targetId}>
          {source}
        </pre>
      )}

      {brandFooter ? (
        <footer className="markdown-footer">
          <p>
            <a href="/">Made with mdshare</a>. Turn markdown into a clean public link from your terminal.
          </p>
        </footer>
      ) : null}
    </section>
  );
}
