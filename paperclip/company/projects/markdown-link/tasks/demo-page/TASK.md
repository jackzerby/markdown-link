---
schema: agentcompanies/v1
kind: task
name: Create a demo page at /p/demo for Show HN launch
slug: demo-page
assignee: fullstack-engineer
project: markdown-link
status: done
---

# Create a demo page at /p/demo for Show HN launch

## Problem

The Show HN draft (`docs/strategy/show-hn-draft.md`) lists "Demo page at /p/demo
must exist so HN readers can see output" as a launch blocker. Currently there is
no seeded demo publish. When someone clicks the link in the Show HN post, they
need to see what a published page actually looks like — not a 404.

## Scope

Seed a publish with slug `demo` that showcases the product. Two options:

### Option A: Database seed (preferred)

Add a seed script or migration that creates a `Site` record with:
- `slug: "demo"`
- `title: "markdown.link demo"`
- `description: "See what a published markdown page looks like."`
- `expiresAt: null` (permanent — this is a product showcase, not a user publish)
- `visibility: "PUBLIC"`
- A `SiteVersion` with example markdown content showing headers, lists, code
  blocks, links, and a brief explanation of what markdown.link does.

### Option B: Publish via API on deploy

Use the CLI or API to create a `/p/demo` publish as part of the deploy process.
Less reliable than a seed but works if seeding is too complex.

## Example demo markdown content

```markdown
# project status update

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

published with [markdown.link](https://markdown.link).
```

## Acceptance

- `/p/demo` returns a rendered markdown page (not 404)
- The demo content exercises common markdown features (headers, lists, code, links)
- The page is permanent (no expiration)
- The demo is reproducible — reseed or re-publish on deploy if needed

## Priority

Blocks Show HN launch. Should ship alongside or immediately after the homepage
rewrite and CLI production default fix.
