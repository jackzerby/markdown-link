"use client";

import { useState } from "react";

type ApiKeyPanelProps = {
  existingKeys: Array<{
    id: string;
    name: string;
    prefix: string;
    createdAt: string;
    lastUsedAt: string | null;
  }>;
};

export function ApiKeyPanel({ existingKeys }: ApiKeyPanelProps) {
  const [plainTextKey, setPlainTextKey] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  async function generateKey() {
    setPending(true);
    setError(null);
    setCopyState("idle");
    const response = await fetch("/api/dashboard/api-key/regenerate", {
      method: "POST",
    });
    const payload = await response.json();
    if (!response.ok) {
      setPending(false);
      setError(payload.error ?? "Could not generate API key.");
      return;
    }
    setPlainTextKey(payload.apiKey);
    setPending(false);
  }

  async function copyKey() {
    if (!plainTextKey) {
      return;
    }

    try {
      await navigator.clipboard.writeText(plainTextKey);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <section className="stack">
      <div className="section-head">
        <h1>API key</h1>
        <p>Use an API key to publish from the CLI without signing in each time.</p>
      </div>

      <button className="button" disabled={pending} onClick={generateKey} type="button">
        {pending ? "Creating..." : "Create new key"}
      </button>

      {plainTextKey ? (
        <div className="notice stack">
          <div className="inline-actions">
            <p>Copy this now — it won't be shown again</p>
            <button className="text-button" onClick={copyKey} type="button">
              {copyState === "copied" ? "copied" : copyState === "error" ? "copy failed" : "copy key"}
            </button>
          </div>
          <pre>{plainTextKey}</pre>
        </div>
      ) : null}

      {error ? <p className="error">{error}</p> : null}

      <div className="list">
        {existingKeys.length === 0 ? <p>No active API keys.</p> : null}
        {existingKeys.map((key) => (
          <div key={key.id} className="list-row">
            <span>{key.name}</span>
            <span>{key.prefix}...</span>
            <span>
              {key.lastUsedAt
                ? `last used ${new Date(key.lastUsedAt).toLocaleDateString()}`
                : `created ${new Date(key.createdAt).toLocaleDateString()}`}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
