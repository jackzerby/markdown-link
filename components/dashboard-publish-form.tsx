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
        setError(payload.error ?? "Publishing failed. Check your markdown and try again.");
        setPending(false);
        return;
      }

      window.location.assign(`/dashboard/sites/${payload.slug}`);
    } catch {
      setError("Publishing failed. Check your markdown and try again.");
      setPending(false);
    }
  }

  return (
    <form action="/api/publishes" className="stack" method="post" onSubmit={handleSubmit}>
      <input
        name="title"
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Page title (optional)"
        value={title}
      />
      <textarea
        name="markdown"
        onChange={(event) => setMarkdown(event.target.value)}
        placeholder="# Your markdown here"
        required
        value={markdown}
      />
      <input name="finalize" type="hidden" value="true" />
      {error ? <p className="error">{error}</p> : null}
      <button className="button" disabled={pending} type="submit">
        {pending ? "Publishing..." : "Publish"}
      </button>
    </form>
  );
}
