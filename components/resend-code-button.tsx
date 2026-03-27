"use client";

import { useEffect, useState } from "react";

type ResendCodeButtonProps = {
  email: string;
  next: string;
  claimSlug: string;
  claimToken: string;
};

export function ResendCodeButton({ email, next, claimSlug, claimToken }: ResendCodeButtonProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    if (status !== "sent") return;
    const timeout = window.setTimeout(() => setStatus("idle"), 3000);
    return () => window.clearTimeout(timeout);
  }, [status]);

  async function handleResend() {
    setStatus("sending");

    const body = new URLSearchParams({ email, next, claimSlug, claimToken });
    await fetch("/api/auth/request-code", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    setStatus("sent");
  }

  if (status === "sent") {
    return <p className="auth-resend-line">New code sent. Check your inbox.</p>;
  }

  return (
    <p className="auth-resend-line">
      Didn&apos;t get it?{" "}
      <button type="button" onClick={handleResend} disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Resend code"}
      </button>{" "}
      or check spam.
    </p>
  );
}
