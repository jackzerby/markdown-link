# markdown.link

This repository powers `markdown.link`, a minimal service for turning markdown
files into shareable URLs.

## Mission

Help founders, indie hackers, operators, and technical teams share markdown as
fast as they create it.

The product should feel:

- instant
- minimal
- trustworthy
- agent-native

## Core audience

Primary users:

- startup founders
- technical operators
- developers active on X
- people using Codex, Claude Code, and similar agent workflows daily

Their core job-to-be-done:

- publish a markdown plan, memo, launch note, or working doc in seconds
- share it with a teammate, investor, customer, or audience using a clean link

## Product truths

- Free links should be easy to create and safe to share.
- Paid plans should remove expiry friction and unlock team-grade workflows.
- CLI publishing is the front door for power users.
- Public pages should stay extremely minimal.
- Dashboard and billing can be richer, but the product should never feel noisy.

## Repo priorities

1. Reliability of publish, upload, claim, and view flows.
2. Sharp onboarding for CLI-first users.
3. Paid conversion through obvious value, not clutter.
4. Fast shipping through agent-friendly docs and repeatable workflows.
5. Clear role ownership for planning, shipping, and distribution.

## Working rules

- Preserve the minimal visual language unless the task explicitly calls for a change.
- Prefer small, composable changes over large refactors.
- When changing product behavior, update docs and env examples in the same change.
- When making strategy decisions, read the repo-local skills under
  `.codex/skills/`.
- When making repo workflow changes, keep the Paperclip company package and the
  repo docs in sync.
- Keep Linear issues small enough for one primary owner and one clear outcome.
- Prefer issue descriptions that read like a GitHub issue: scope, acceptance
  criteria, constraints, and relevant file paths.
- Marketing and business roles should actively study the public positioning,
  onboarding, and founder distribution patterns of strong adjacent products and
  turn those learnings into original markdown.link strategy.
- Keep competitor references in internal docs only. Do not mention competitors
  on public landing pages, dashboards, or customer-facing copy.
- Agents are allowed to generate new ideas and propose new work when they find
  a clear opportunity, but they should turn those ideas into small, testable,
  issue-shaped follow-ons instead of vague brainstorms.
- Agents should behave like one cohesive company: leave clean handoff notes,
  connect work back to the same ICP and weekly priorities, and avoid creating
  disconnected side quests.
- Marketing, growth, and business agents can define landing-page or UI changes,
  but frontend engineers should implement those changes unless the issue
  explicitly includes code ownership.
- More generally, non-engineering agents are expected to push work into real
  implementation ownership whenever something needs to get built, launched, or
  measured.

## Agent roles

Repo-local skills live under `.codex/skills/`.

Recommended roles:

- `$ceo`: choose priorities, sequencing, and tradeoffs
- `$product-strategy`: translate audience pain into roadmap decisions
- `$launch-ops`: run the daily marketing and operating loop
- `$growth-lead`: plan distribution, experiments, and conversion loops
- `$business-ops`: shape pricing, packaging, and unit-economics decisions
- The Paperclip company package lives in `COMPANY.md`, `teams/`, `agents/`,
  `projects/`, and `skills/`.

Role split:

- `$ceo` owns what matters this week and what gets deferred.
- `$product-strategy` owns what the product should become over the next few
  releases.
- `$launch-ops` owns recurring content, replies, demos, and operational
  follow-through.
- `$growth-lead` owns experiments, channel testing, and conversion analysis.
- `$business-ops` owns pricing recommendations, packaging, and basic business
  modeling.
- product and growth work should feed directly into implementation ownership.

## Reference docs

- `COMPANY.md`
- `README.md`
- `docs/strategy/paperclip-execution.md`
- `docs/strategy/market-research-adjacent-playbooks.md`
- `.codex/skills/ceo/SKILL.md`
- `.codex/skills/product-strategy/SKILL.md`
- `.codex/skills/launch-ops/SKILL.md`
- `.codex/skills/growth-lead/SKILL.md`
- `.codex/skills/business-ops/SKILL.md`
- `docs/strategy/team-hiring-plan.md`
- `docs/strategy/content-engine-plan.md`
- `docs/strategy/pricing-plan.md`
