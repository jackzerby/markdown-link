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

  async function generateKey() {
    setPending(true);
    setError(null);
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

  return (
    <section className="stack">
      <div className="section-head">
        <h1>API key</h1>
        <p>Use this for CLI publishing.</p>
      </div>

      <button className="button" disabled={pending} onClick={generateKey} type="button">
        {pending ? "creating..." : "generate new key"}
      </button>

      {plainTextKey ? (
        <div className="notice">
          <p>shown once</p>
          <pre>{plainTextKey}</pre>
        </div>
      ) : null}

      {error ? <p className="error">{error}</p> : null}

      <div className="list">
        {existingKeys.length === 0 ? <p>no active api keys.</p> : null}
        {existingKeys.map((key) => (
          <div key={key.id} className="list-row">
            <span>{key.name}</span>
            <span>{key.prefix}...</span>
            <span>{key.lastUsedAt ?? "unused"}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
