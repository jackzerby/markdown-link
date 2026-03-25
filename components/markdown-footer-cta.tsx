"use client";

import { useEffect, useState } from "react";

import { agentInstallPrompt } from "@/lib/agent-prompt";

export function MarkdownFooterCta() {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (status === "idle") {
      return;
    }

    const timeout = window.setTimeout(() => setStatus("idle"), 1800);
    return () => window.clearTimeout(timeout);
  }, [status]);

  async function handleCopy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(agentInstallPrompt);
      } else {
        const el = document.createElement("textarea");
        el.value = agentInstallPrompt;
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
      setStatus("error");
    }
  }

  return (
    <div className="markdown-footer-cta">
      <button className="markdown-footer-button" onClick={handleCopy} type="button">
        {status === "copied" ? "copied for your agent" : "copy this for your agent"}
      </button>
      <p className="markdown-footer-note">
        {status === "copied"
          ? "Paste it into Claude, Codex, or your agent."
          : status === "error"
            ? "Copy failed. Try again."
            : "Steal the exact workflow."}
      </p>
    </div>
  );
}
