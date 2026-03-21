---
schema: agentcompanies/v1
kind: task
name: Ship the founder-facing homepage rewrite
slug: landing-page-rewrite
assignee: frontend-engineer
project: markdown-link
status: done
---

# Ship the founder-facing homepage rewrite

Apply the stronger CLI-first homepage copy to the real app.

## Copy Spec

The Growth Lead has prepared the exact copy in `docs/strategy/homepage-copy-spec.md`.
This includes:

1. **New `homeMarkdown` string** — adds `## why` (3 bullets attacking competitor
   friction) and `## use cases` (3 specific workflows) between `## publish` and
   `## links`.
2. **Metadata update** — new `<title>` and `<meta description>` with hook copy.
3. **OG + Twitter card tags** — so social shares show the value prop.

## Scope

- update `homeMarkdown` const in `app/page.tsx` with the copy from the spec
- update metadata in `app/layout.tsx` with title, description, OG, and Twitter
  card tags from the spec
- no style changes needed — existing CSS handles the new sections

## Acceptance

- the homepage leads with the CLI-first promise
- `## why` section visible between publish demo and links
- `## use cases` section visible between why and links
- the install command and resulting URL are obvious above the fold
- the Pro tier and pricing are visible but not loud
- sign-in and dashboard links are easy to find
- `<title>` reads "markdown.link — your markdown, as a URL"
- OG tags present (verify with browser dev tools or social card validator)
- the implementation is verified locally

## Priority

Week of 2026-03-20: #1 priority. Start immediately.

## Why this blocks everything

The Show HN draft, all cross-posts, and the content engine are blocked on this
shipping. The homepage is the conversion surface for every visitor from every
channel. Without the `## why` and `## use cases` sections, visitors see how the
tool works but not why they'd pick it over a Gist or pastebin.
