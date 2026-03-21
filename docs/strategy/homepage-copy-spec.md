# Homepage Copy Spec — markdown.link

Owner: Growth Lead
Date: 2026-03-20
Handoff to: Frontend Engineer

## Context

The current homepage is functional but undersells the product. Visitors see how
to install and publish, but not **why** they'd pick this over a GitHub Gist,
Notion link, or pastebin. The page also lacks use cases, so visitors can't see
themselves in the product.

This spec gives the Frontend Engineer the exact markdown string to use in
`app/page.tsx` and the metadata updates for `app/layout.tsx`.

## Exact `homeMarkdown` replacement

```
# markdown.link

your markdown, as a URL.

## install

`curl -fsSL https://markdown.link/install.sh | bash`

## publish

`markdown.link ./plan.md`

`→ https://markdown.link/p/f7x2k`

## why

- no account needed to publish
- no editor — just your terminal
- clean rendered page, not a raw paste

## use cases

- share a project brief with your team
- publish release notes from CI
- send a draft without signing anyone up

## links

- [sign in](/auth/start)
- [dashboard](/dashboard/sites)
```

## Changes from current

1. **Added `## why` section** — three lines that attack the friction of every
   competitor (Gist needs GitHub, Markshare has no CLI, Termbin doesn't render).
2. **Added `## use cases` section** — names three specific workflows so the
   visitor sees themselves. Deliberately short — three bullets, not a wall.
3. Everything else is unchanged.

## Footer line (unchanged)

The footer already reads:
```
free publishes expire. pro keeps them live — $5/mo.
```
No change needed. This was shipped in the last cycle.

## Metadata update (`app/layout.tsx`)

```ts
export const metadata: Metadata = {
  title: "markdown.link — your markdown, as a URL",
  description:
    "Publish any markdown file to a shareable URL from the terminal. One command, no account required. Free links expire, Pro keeps them permanent.",
};
```

**Why:** The current description ("Turn markdown files into shareable URLs from
the CLI.") is fine but has no hook. The new description adds "one command, no
account required" which differentiates from Gist/Notion, and "Free links expire,
Pro keeps them permanent" which plants the pricing seed early for anyone
discovering via search.

## OG tags for social sharing (new)

Add to `app/layout.tsx` metadata:

```ts
export const metadata: Metadata = {
  title: "markdown.link — your markdown, as a URL",
  description:
    "Publish any markdown file to a shareable URL from the terminal. One command, no account required. Free links expire, Pro keeps them permanent.",
  openGraph: {
    title: "markdown.link",
    description: "Your markdown, as a URL. One command, no account.",
    url: "https://markdown.link",
    siteName: "markdown.link",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "markdown.link",
    description: "Your markdown, as a URL. One command, no account.",
  },
};
```

**Why:** Without OG tags, links shared on Twitter/HN/Slack will show a generic
preview. These tags ensure the value prop is visible in every social share
before the reader even clicks.

## Acceptance criteria

- [ ] Homepage leads with `# markdown.link` and `your markdown, as a URL.`
- [ ] `## why` section appears between publish demo and links
- [ ] `## use cases` section appears between why and links
- [ ] `<title>` and `<meta name="description">` updated
- [ ] OG and Twitter card tags present
- [ ] Page renders correctly at `/` in dev
- [ ] No layout/style changes needed — existing CSS handles the new sections
