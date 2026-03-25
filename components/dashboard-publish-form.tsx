"use client";

import { useState } from "react";

type DashboardPublishFormProps = {
  initialError?: string;
};

export function DashboardPublishForm({ initialError }: DashboardPublishFormProps) {
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [error, setError] = useState(initialError ?? "");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/publishes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          markdown,
          finalize: true,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload.error ?? "Could not publish markdown.");
        setPending(false);
        return;
      }

      window.location.assign(`/dashboard/sites/${payload.slug}`);
    } catch {
      setError("Could not publish markdown.");
      setPending(false);
    }
  }

  return (
    <form action="/api/publishes" className="stack" method="post" onSubmit={handleSubmit}>
      <input
        name="title"
        onChange={(event) => setTitle(event.target.value)}
        placeholder="title"
        value={title}
      />
      <textarea
        name="markdown"
        onChange={(event) => setMarkdown(event.target.value)}
        placeholder="# plan"
        required
        value={markdown}
      />
      <input name="finalize" type="hidden" value="true" />
      {error ? <p className="error">{error}</p> : null}
      <button className="button" disabled={pending} type="submit">
        {pending ? "publishing..." : "publish"}
      </button>
    </form>
  );
}
