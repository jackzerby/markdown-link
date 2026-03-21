---
schema: agentcompanies/v1
kind: task
name: Make CLI and install script work against production by default
slug: cli-production-default
assignee: fullstack-engineer
project: markdown-link
---

# Make CLI and install script work against production by default

## Problem

The CLI front door is broken for new users in two ways:

1. **CLI defaults to localhost**: `cli/markdown.link.js:48` sets `baseUrl` to
   `http://localhost:3000`. A user who runs `markdown.link ./plan.md` after
   installing gets a connection refused error. They need to know to set
   `MARKDOWN_LINK_BASE_URL=https://markdown.link` or pass `--base-url`. This
   is invisible friction that kills first-run experience.

2. **Install script is local-only**: `scripts/install.sh` copies from
   `$SCRIPT_DIR/../cli/markdown.link.js` — a local filesystem path. The
   homepage tells users to run `curl -fsSL https://markdown.link/install.sh | bash`
   but this would download the script and then fail because the CLI source
   file isn't on their machine.

Both of these break the very first interaction a user has with the product.

## Scope

### 1. CLI base URL (`cli/markdown.link.js`)

Change line 48 from:
```js
baseUrl: process.env.MARKDOWN_LINK_BASE_URL || "http://localhost:3000",
```
to:
```js
baseUrl: process.env.MARKDOWN_LINK_BASE_URL || "https://markdown.link",
```

Developers working locally can set `MARKDOWN_LINK_BASE_URL=http://localhost:3000`
in their shell or `.env`.

### 2. Install script (`scripts/install.sh`)

Rewrite the install script to download the CLI from the production URL rather
than copying from a local repo path. The script should:

- Fetch the latest `cli/markdown.link.js` from the public repo or a hosted URL
- Place it in `~/.local/bin/markdown.link`
- Check for `node` on PATH
- Print the installed path and a PATH warning if needed

This is what makes `curl ... | bash` actually work for new users.

### 3. Serve the install script (`app/install.sh/route.ts` or static)

Ensure `https://markdown.link/install.sh` serves the install script. Either:
- Add a Next.js route handler that returns the script
- Or place it in `public/install.sh`

## Acceptance

- `curl -fsSL https://markdown.link/install.sh | bash` installs the CLI
- `markdown.link ./plan.md` publishes to production without extra config
- Local dev still works via `MARKDOWN_LINK_BASE_URL=http://localhost:3000`
- `--help` output shows the production URL as default

## Priority

Week of 2026-03-20: HIGH. This is the front door. If the first `curl | bash`
fails, the user never tries again.
