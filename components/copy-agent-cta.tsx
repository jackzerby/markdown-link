"use client";

import { useEffect, useState } from "react";

type CopyAgentCtaProps = {
  text: string;
};

export function CopyAgentCta({ text }: CopyAgentCtaProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (status === "idle") {
      return;
    }

    const timeout = window.setTimeout(() => {
      setStatus("idle");
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [status]);

  async function handleCopy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const fallback = document.createElement("textarea");
        fallback.value = text;
        fallback.setAttribute("readonly", "true");
        fallback.style.position = "absolute";
        fallback.style.left = "-9999px";
        document.body.appendChild(fallback);
        fallback.select();
        document.execCommand("copy");
        document.body.removeChild(fallback);
      }
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return (
    <button className="primary" onClick={handleCopy} type="button">
      {status === "copied" ? "copied" : status === "error" ? "failed" : "copy"}
    </button>
  );
}
