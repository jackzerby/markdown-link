---
schema: agentcompanies/v1
kind: task
name: Finalize the pricing and packaging memo
slug: pricing-package
assignee: business-ops
project: markdown-link
---

# Finalize the pricing and packaging memo

Confirm the packaging: free = expiring links with site/storage caps, Pro =
permanent links + custom handle at $5/mo. Write a 1-page memo. The enforcement
code in `lib/usage.ts` already implements this — just confirm the positioning.

Hand off any UI copy changes to Frontend Engineer.

## Priority

Week of 2026-03-20: #3 priority. Start immediately.

## Status: COMPLETE (2026-03-20)

Deliverables:
- `docs/strategy/pricing-packaging.md` — 1-page packaging memo confirming free vs Pro
- Verified enforcement code in `lib/usage.ts`, `lib/publishes.ts`, `lib/stripe.ts`
- Confirmed all 5 conversion touchpoints are shipped

Handoffs created:
- Frontend Engineer: fix 2 "paid" → "pro" copy references on plan page
- Fullstack Engineer: fix misleading claim page copy (claiming ≠ removing expiry)
- CEO: recommend raising FREE_PUBLISH_TTL_SECONDS from 24h to 7 days
