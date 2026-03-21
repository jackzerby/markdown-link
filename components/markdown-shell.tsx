"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

type MarkdownShellProps = {
  source: string;
  defaultMode?: "rendered" | "raw";
};

export function MarkdownShell({
  source,
  defaultMode = "rendered",
}: MarkdownShellProps) {
  const [mode, setMode] = useState<"rendered" | "raw">(defaultMode);

  return (
    <section className="markdown-shell">
      <nav className="markdown-toggle" aria-label="View mode">
        <button
          className={mode === "rendered" ? "active" : undefined}
          onClick={() => setMode("rendered")}
          type="button"
        >
          rendered
        </button>
        <button
          className={mode === "raw" ? "active" : undefined}
          onClick={() => setMode("raw")}
          type="button"
        >
          markdown
        </button>
      </nav>

      {mode === "rendered" ? (
        <article className="markdown-rendered prose">
          <ReactMarkdown>{source}</ReactMarkdown>
        </article>
      ) : (
        <pre className="markdown-raw">{source}</pre>
      )}
    </section>
  );
}
