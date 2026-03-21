const demoMarkdown = `# project status update

this page was published with one command:

\`markdown.link ./status.md\`

## what you're looking at

a rendered markdown page hosted at a clean URL. no account required to publish.

## features

- **headers, lists, code** — standard markdown, cleanly rendered
- **password protection** — optional, per-publish
- **raw view** — toggle to see the source markdown
- **expiration** — free links expire after 7 days. pro keeps them permanent.

## try it

\`\`\`
curl -fsSL https://markdown.link/install.sh | bash
markdown.link ./notes.md
\`\`\`

published with [markdown.link](https://markdown.link).`;

export default function DemoRawPage() {
  return (
    <main className="viewer">
      <pre className="markdown-raw">{demoMarkdown}</pre>
    </main>
  );
}
