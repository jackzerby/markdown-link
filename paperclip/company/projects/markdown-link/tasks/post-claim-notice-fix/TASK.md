---
schema: agentcompanies/v1
kind: task
name: Fix post-claim notice that lies to free users about expiration
slug: post-claim-notice-fix
assignee: frontend-engineer
project: markdown-link
status: done
---

# Fix post-claim notice that lies to free users about expiration

## Problem

After the claim-expiry-loophole API fix, free users keep their expiry when
claiming a publish. But the post-claim notice in the dashboard still says:

> "publish claimed. it is now tied to your account and will not expire."

This is **wrong** for free users. Their link will still expire. The notice
creates a false expectation that leads to a broken trust moment when the link
dies despite the promise.

Additionally, the free-tier fallback copy says "on the free plan, you can keep
one permanent publish." This doesn't match the pricing model — free users get
zero permanent publishes. All free links expire. There is no "one free permanent"
perk.

## Root cause

`app/dashboard/sites/[slug]/page.tsx:43-51` was supposed to be updated as part
of the claim-expiry-loophole task (see TASK.md lines 43-48) but was missed when
the API route was fixed.

## Scope

Update `app/dashboard/sites/[slug]/page.tsx:43-51`:

**For Pro users (planTier === "HOBBY"):**
```
publish claimed. it is tied to your account and will not expire.
```

**For free users (planTier === "FREE"):**
```
publish claimed. it is tied to your account. upgrade to Pro to keep it live permanently.
```

Remove the "you can keep one permanent publish" line — it doesn't match the
pricing model.

## Acceptance

- Pro user sees "will not expire" after claiming
- Free user sees "upgrade to Pro to keep it live permanently" after claiming
- No mention of "one permanent publish" for free users
- No regression to the claim flow itself (this is UI-only)

## Key files

- `app/dashboard/sites/[slug]/page.tsx` (lines 43-51)

## Priority

HIGH — This is a trust-breaking copy bug. Every free user who claims a publish
sees a false promise. Small fix (~5 lines), no blockers.
