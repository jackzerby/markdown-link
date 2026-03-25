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
        {status === "copied" ? "Copied" : status === "error" ? "Copy failed" : "Copy install command"}
      </button>
    </div>
  );
}
