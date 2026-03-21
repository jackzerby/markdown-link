---
schema: agentcompanies/v1
kind: task
name: Fix the claim-expiry loophole that bypasses free tier pricing
slug: claim-expiry-loophole
assignee: fullstack-engineer
project: markdown-link
---

# Fix the claim-expiry loophole that bypasses free tier pricing

## Problem

The pricing model says: free = expiring links, Pro = permanent. But the claim
API unconditionally sets `expiresAt: null` for all users, including free tier.
This means any free user can publish anonymously, claim it, and get a permanent
link — completely bypassing the conversion pressure that drives upgrades.

The entire Pro value proposition ("keeps them live") is undermined by this bug.

## Root cause

`app/api/publishes/[slug]/claim/route.ts:46`:

```js
db.site.update({
  where: { id: site.id },
  data: { ownerUserId: user.id, claimedAt: new Date(), expiresAt: null },
})
```

The `expiresAt: null` should be conditional on the claiming user's plan tier.

## Scope

### Code changes

1. `app/api/publishes/[slug]/claim/route.ts` — Only set `expiresAt: null` when
   the claiming user is on the HOBBY (Pro) plan. For free users, preserve the
   existing `expiresAt` value. This means the claim assigns ownership but
   the link still expires unless they upgrade.

2. `app/dashboard/sites/[slug]/page.tsx:43-52` — The post-claim notice says
   "it is now tied to your account and will not expire." After this fix, that
   is only true for Pro users. Update the notice:
   - Pro user claim: "publish claimed. it is tied to your account and will not expire."
   - Free user claim: "publish claimed. it is tied to your account. upgrade to
     Pro to keep it live permanently."

3. `app/claim/[slug]/page.tsx:31` — Current copy says "so you can keep it live
   by upgrading to Pro." This is accurate after this fix. No change needed.

### What claiming gives free users (keep this clear)

- Dashboard management of the site
- Ability to update content
- Ability to upgrade to Pro later to remove expiry
- Ownership so no one else can claim it

## Acceptance

- Free user claims a publish → `expiresAt` is preserved (link still expires)
- Pro user claims a publish → `expiresAt` is set to null (link is permanent)
- Post-claim notice reflects the user's actual plan status
- No regression in the existing claim token validation flow

## Priority

Week of 2026-03-20: CRITICAL. This is the #1 product bug — it defeats the
upgrade funnel. Should be addressed alongside the publish-flow e2e task.
