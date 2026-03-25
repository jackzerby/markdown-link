# Pricing & Packaging — markdown.link

Owner: Business Ops
Date: 2026-03-20

## Decision

Two plans. One price. No tiers to compare.

| | Free | Pro |
|---|---|---|
| Price | $0 | $5/mo |
| Links | Expire (default 7 days) | Permanent |
| Active sites | 50 | Unlimited |
| Storage | 10 GB | 100 GB |
| Custom domains | No | Yes |
| API keys | Yes | Yes |

Internal schema uses `HOBBY` enum. All user-facing copy says **Pro**.

## Why this works

The free plan proves the loop: publish from CLI, share the URL, see it render.
The paid plan removes the one thing that breaks trust — link death. That's a
binary upgrade trigger: your links live or they don't.

At $5/mo there is no price objection for a founder or developer who uses this
weekly. The value is obvious within one share cycle.

## Enforcement (already shipped)

- `lib/usage.ts` — `assertPublishWithinPlanLimits` blocks free users at the site
  cap (50) and storage cap (10 GB). Pro users skip all checks.
- `lib/publishes.ts` — `createPublish` sets `expiresAt` from
  `FREE_PUBLISH_TTL_SECONDS` for free users. Pro users get `null` (permanent).
- `lib/stripe.ts` — `syncSubscriptionFromStripe` nullifies `expiresAt` on all
  existing sites when a user upgrades to Pro.
- `app/api/stripe/` — checkout, customer portal, and webhook routes are
  production-ready with idempotent event processing.

## Conversion touchpoints (already shipped)

1. **Homepage** — "free publishes expire. pro keeps them live — $5/mo."
2. **Plan dashboard** — usage meter + "upgrade to pro — $5/mo" button.
3. **Expired link page** — "the author can upgrade to Pro to keep links permanent."
4. **Claim page** — "see plans" link for anonymous users about to lose a publish.
5. **CLI error** — limit-reached errors now include the upgrade URL.

## Resolved handoffs (CEO, 2026-03-20)

- **Copy consistency**: "paid" → "pro" fixed in `app/dashboard/plan/page.tsx` (lines 28, 59).
- **Claim page accuracy**: copy corrected in `app/claim/[slug]/page.tsx` to say
  "claiming ties it to your account so you can keep it live by upgrading to Pro."
- **Free TTL**: raised from 24h to 7 days (604800s) in `.env` and `.env.example`.
  Homepage updated to say "free links expire after 7 days."

## What we are not doing

- No annual billing yet. Not enough volume to justify the complexity.
- No second paid tier. The audience is individual founders and developers.
  Team features are deferred.
- No usage-based pricing. Flat rate is simpler to explain and sell.
- No free trial of Pro. The free plan already demonstrates the product.
