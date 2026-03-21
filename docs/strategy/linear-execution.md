# Linear Execution Guide

## Purpose

This file defines how `markdown.link` should use Linear with Symphony and Codex.

## Intake states

Primary agent intake:

- `Todo`
- `Next Up`

These are the safest states for Symphony to claim automatically.

## Review and completion states

- `In Review` means a human should look at the result.
- `Done` means the issue is complete.
- `Canceled` and `Duplicate` are terminal cleanup states.

## Issue writing standard

Every issue should include:

- one concrete outcome
- why it matters
- constraints or non-goals
- acceptance criteria
- relevant files or systems if known

## Good issue examples

- implement presigned direct-to-S3 uploads
- verify outbound email delivery after DNS setup
- add publish analytics for installs, publishes, claims, and upgrades

## Bad issue examples

- improve growth
- make onboarding better
- fix product and marketing

## Agent workflow

1. Pick up a `Todo` or `Next Up` issue.
2. Read the description fully.
3. Comment if scope is unclear.
4. Make the smallest viable change.
5. Verify locally.
6. If the work surfaced an obvious next step, create or update the downstream
   issue in Linear before finishing.
7. Comment a concise summary.
8. Move to `In Review` when human validation is needed.

## Founder rule

If a task is too broad for one agent session, split it before execution.

## Autonomy rule

Symphony should keep the company moving without waiting for manual founder
triage on every baton pass.

That means:

- research issues should feed landing, content, pricing, or engineering issues
- marketing issues should generate the next asset, copy test, or campaign issue
- business issues should turn pricing conclusions into concrete packaging or
  landing-page tasks
- engineering issues should generate cleanup or rollout tasks only when they are
  concrete and bounded

The goal is not to create a noisy backlog. The goal is to maintain a clean queue
of the next few highest-leverage actions.
