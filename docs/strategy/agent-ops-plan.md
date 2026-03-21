# 24/7 Agent Ops Plan

## Goal

Use agents to keep product shipping and marketing running continuously without
turning the brand into spam.

The system should feel like a tiny startup with a clear CEO, a product brain, a
growth brain, and a small engineering swarm.

## Operating model

### CEO agent

Owns:

- weekly priorities
- tradeoff calls
- deciding what moves from backlog to active work
- final call on what gets shipped, posted, or postponed
- keeping the company focused on founders and technical users first

### Product strategy agent

Owns:

- converting user pain into issues
- maintaining roadmap docs
- packaging features into understandable releases
- keeping `docs/strategy/technical-feature-plan.md` current
- turning feedback into a small next-step backlog

### Growth lead agent

Owns:

- X content calendar
- reply opportunities
- launch asset generation
- weekly messaging analysis
- converting feature work into demo-ready posts
- summarizing which hooks are working and which are not
- maintaining the adjacent-playbook research loop and turning it into tests

### Business ops agent

Owns:

- pricing recommendation
- packaging decisions
- upgrade-path clarity
- weekly review of whether the paid plan still matches user behavior
- studying how adjacent products create free-to-paid pressure without bloating
  pricing

### Community agent

Owns:

- monitoring X for relevant conversations
- drafting replies to technical founders and operators
- finding proof-of-fit moments that can be turned into posts
- tracking adjacent founder posting patterns and noting what earns replies,
  reposts, and curiosity

### Analytics agent

Owns:

- tracking installs, publishes, claims, and paid conversions
- summarizing top-of-funnel and conversion data
- surfacing what content is actually driving signups

### Engineering agents

Own:

- implementation work from Linear
- bug triage
- reliability improvements
- cleanup after launches
- small follow-up patches from growth feedback

## Daily loops

### Product loop

- review new issues
- group by publish speed, trust, monetization, or growth
- propose the next 1 to 3 priority items
- write a short markdown memo for the CEO to approve
- update the roadmap file when priorities change

### Growth loop

- scan X for high-signal conversations around Codex, Claude Code, specs, launch notes, and markdown
- draft reply candidates
- draft 3 to 5 original posts
- turn the best-performing hook into a reusable template
- summarize which claims and demos are resonating
- study adjacent product pages and founder posts weekly, then log what is worth
  adapting

### Launch loop

- identify the next feature worth showing publicly
- create a demo script in markdown
- turn that script into a post draft and a reply draft
- ship the feature, then publish the proof
- queue the landing page asset updates that support that proof

### Ops loop

- check failed publishes
- check email delivery failures
- check Stripe webhook failures
- check domain verification failures
- check for stalled agent workspaces
- check whether the content queue has at least one post ready

### CEO review loop

- review the weekly scorecard
- decide what to stop doing
- decide what deserves more agent time
- decide whether the company is still winning on speed and clarity
- review whether pricing and packaging still feel obvious

## Automation ideas

- auto-generate a daily founder dashboard in markdown and publish it
- generate feature announcement drafts from merged pull requests
- create a weekly GTM memo from analytics and X performance
- create support triage summaries
- auto-draft an X reply queue from recent relevant posts
- create a weekly "what shipped / what converted" memo for the founder
- publish an internal scorecard to markdown.link so the team sees the same numbers

## Guardrails

- never auto-post without human review at the start
- keep all public copy concrete and demo-based
- prefer fewer strong posts over high-volume fluff
- never let agents expand scope beyond the ICP without explicit review
- if a post does not show a real workflow, do not publish it
- if an issue is unclear, ask the CEO agent for a direction call

## Success criteria

- continuous issue flow in Symphony
- weekly shipping cadence
- daily content drafts ready for review
- measurable install and publish growth from X
- at least one useful public artifact per day from the growth team
- a stable weekly loop where shipping feeds distribution and distribution feeds shipping
