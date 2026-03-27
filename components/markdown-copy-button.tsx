"use client";

import { useEffect, useState } from "react";

type MarkdownCopyButtonProps = {
  mode: "rendered" | "raw";
  source: string;
  targetId: string;
};

function ClipboardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="6" height="3" rx="1" />
      <path d="M5 3H4a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
    </svg>
  );
}

export function MarkdownCopyButton({
  mode,
  source,
  targetId,
}: MarkdownCopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (status === "idle") {
      return;
    }

    const timeout = window.setTimeout(() => setStatus("idle"), 2000);
    return () => window.clearTimeout(timeout);
  }, [status]);

  async function handleCopy() {
    const text =
      mode === "raw"
        ? source
        : document.getElementById(targetId)?.innerText.trim() || source;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const el = document.createElement("textarea");
        el.value = text;
        el.setAttribute("readonly", "true");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setStatus("copied");
    } catch {
      try {
        const el = document.createElement("textarea");
        el.value = text;
        el.setAttribute("readonly", "true");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(el);
        setStatus(ok ? "copied" : "error");
      } catch {
        setStatus("error");
      }
    }
  }

  const tooltip =
    status === "copied"
      ? "Copied!"
      : status === "error"
        ? "Failed"
        : mode === "raw"
          ? "Copy markdown"
          : "Copy text";

  return (
    <button className="markdown-copy" onClick={handleCopy} type="button" aria-label={tooltip}>
      <span className="copy-tooltip">{tooltip}</span>
      {status === "copied" ? <CheckIcon /> : <ClipboardIcon />}
    </button>
  );
}
