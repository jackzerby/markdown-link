# Autonomous Symphony Loop

## Goal

Make Symphony the operating layer for markdown.link, not just a tool the
founder has to manually re-aim every time an issue finishes.

## Principle

Each issue should leave the system in a better queued state than it found it.

In practice:

- research should produce follow-on work
- execution should produce proof, comments, and the next bounded issue
- review should be a checkpoint, not a dead end
- agents should be free to suggest and queue strong new ideas when they are
  evidence-backed and aligned with the company story
- plans should become owned implementation work, not just polished documents

## Operating pattern

### 1. CEO defines the lane

The CEO role sets:

- what matters this week
- which outcomes deserve automation
- the maximum number of active concurrent issues

### 2. Research opens the path

Research issues should:

- extract concrete findings
- identify the 1 to 3 strongest follow-on actions
- update existing issues when work is already queued
- create new issues only when there is no good existing issue

### 3. Marketing and business execute from evidence

Marketing and business issues should:

- use research as input, not as a blocker
- ship assets, landing-page changes, and pricing memos
- create the next smallest issue when a pattern becomes obvious
- originate fresh ideas for hooks, campaigns, positioning, or packaging when
  the evidence supports it
- hand off anything that needs implementation to the right engineering or ops
  owner

### 4. Engineering closes the product loop

Engineering issues should:

- ship the smallest visible improvement
- comment rollout and validation steps
- create concrete cleanup issues only when clearly needed

## Queue hygiene

The queue should always contain:

- 1 research issue
- 1 landing-page or messaging issue
- 1 content or asset issue
- 1 business or pricing issue
- 1 to 2 engineering issues

Avoid:

- broad umbrella issues
- duplicate strategy tickets
- leaving all downstream work trapped in comments or docs
- clever but disconnected side quests that do not strengthen the same core
  product story

## Cohesion rule

Agents should behave like a tight startup team.

That means:

- they can come up with new ideas
- they should hand off those ideas in a form another agent can execute quickly
- they should reference prior research and current priorities
- they should strengthen a shared narrative instead of fragmenting it

## State guidance

- `Todo`: ready for agent execution now
- `Next Up`: approved and waiting behind the current active set
- `In Review`: waiting for human validation, merge, or founder decision
- `Done`: complete and no longer needs action

## Practical rule

If an agent finishes a useful memo but does not create or update the next
actionable issue, the loop is incomplete.
