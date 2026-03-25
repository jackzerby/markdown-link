"use client";

import { useEffect, useState } from "react";

type MarkdownCopyButtonProps = {
  mode: "rendered" | "raw";
  source: string;
  targetId: string;
};

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

  return (
    <button className="markdown-copy" onClick={handleCopy} type="button">
      {status === "copied"
        ? "copied"
        : status === "error"
          ? "copy failed"
          : mode === "raw"
            ? "Copy markdown"
            : "Copy text"}
    </button>
  );
}
