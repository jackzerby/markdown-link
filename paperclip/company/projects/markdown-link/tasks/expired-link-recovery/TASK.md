---
schema: agentcompanies/v1
kind: task
name: Give readers a useful action when a link has expired
slug: expired-link-recovery
assignee: frontend-engineer
project: markdown-link
---

# Give readers a useful action when a link has expired

## Problem

When a reader visits an expired link at `/p/[slug]`, they see:

> "this publish has expired."
> "the author can upgrade to Pro to keep links permanent."

This is a dead end. The reader is not the author. They have no action they
can take. They can't contact the author, can't request the content, and
can't do anything useful. The link just dies.

This is also a missed conversion opportunity — every expired link view is a
signal that the author's content has an audience. If the author knew someone
tried to read their expired link, that's the strongest possible upgrade trigger.

## Scope

### Phase 1 (ship now)

Update `app/p/[slug]/page.tsx:54-69` to replace the dead-end expired message
with something useful:

**For readers:**
- Show the title/description of the expired publish (still visible from the
  `site` record)
- Replace "the author can upgrade" with: "this link has expired. the author
  can restore it by upgrading to Pro."
- Add a "publish your own" CTA linking to `/` — turn a dead end into a
  funnel for new users

**For the author (if logged in):**
- If the logged-in user owns this expired site, show a direct "upgrade to
  restore" CTA linking to `/dashboard/plan`
- This requires checking if the current session user matches `site.ownerUserId`

### Phase 2 (defer — track as follow-on)

- Notify the author when someone visits their expired link (requires
  background job infrastructure, deferred per weekly priorities)

## Acceptance

- Expired link page shows the publish title (not just "this publish has expired")
- Reader sees a "publish your own" CTA (funnels to homepage)
- If the logged-in user is the author, they see "upgrade to restore this link"
  pointing to `/dashboard/plan`
- No change to the viewer for live links
- Phase 2 is tracked as a separate future task, not implemented now

## Key files

- `app/p/[slug]/page.tsx` (primary change)
- `lib/auth.ts` — `getCurrentUser` (to check if viewer is the author)

## Priority

Week of 2026-03-20: MEDIUM. Less urgent than the claim loophole and CLI fix,
but every expired link view is a conversion signal being wasted.
