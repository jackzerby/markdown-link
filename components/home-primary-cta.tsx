"use client";

import { useEffect, useState } from "react";

import { agentInstallPrompt } from "@/lib/agent-prompt";

const burstEmoji = ["📝", "📄", "✨", "⚡", "📎", "📤", "✦", "🪄", "🧾", "↗", "💫", "📁"];

export function HomePrimaryCta() {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const [burstKey, setBurstKey] = useState(0);

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
      setBurstKey((current) => current + 1);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="home-primary">
      <div aria-hidden="true" className="home-burst" key={burstKey}>
        {burstEmoji.map((emoji, index) => (
          <span
            className={`home-burst-item burst-${index + 1}${status === "copied" ? " is-live" : ""}`}
            key={`${burstKey}-${emoji}-${index}`}
          >
            {emoji}
          </span>
        ))}
      </div>

      <button className={`home-copy-button${status === "copied" ? " is-copied" : ""}`} onClick={handleCopy} type="button">
        {status === "copied" ? "copied for your agent" : "grab the snippet"}
      </button>

      <p className="home-primary-note">
        {status === "copied"
          ? "Paste it into Claude, Codex, or your agent."
          : status === "error"
            ? "Copy failed. Try again."
            : "No signup required."}
      </p>
    </div>
  );
}
