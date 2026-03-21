---
schema: agentcompanies/v1
kind: task
name: Improve the publish and claim loop
slug: publish-flow
assignee: fullstack-engineer
project: markdown-link
---

# Improve the publish and claim loop

Keep the core product loop fast, reliable, and easy to explain.

## Focus

- verify end-to-end locally: publish via CLI, view at `/p/[slug]`, claim via email, see in dashboard
- confirm free-tier limits trigger the upgrade prompt naturally
- fix any rough edges in the claim flow and public viewer
- do not add features — this is reliability work

## Key files

- `cli/markdown.link.js`
- `app/api/publishes/`
- `app/p/[slug]/page.tsx`
- `app/claim/[slug]/page.tsx`
- `lib/usage.ts`

## Priority

Week of 2026-03-20: #2 priority. Start immediately.
