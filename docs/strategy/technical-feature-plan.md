# Technical Feature Plan

## Product goal

Make `markdown.link` the default publishing layer for markdown generated in
terminal-first and agent-first workflows.

## Phase 1: Core publish engine

Status: mostly in place

- CLI publish command
- anonymous expiring links
- claim flow
- email sign-in
- password protection
- dashboard basics
- S3-backed storage
- Stripe and Resend integration scaffolding

## Phase 2: Trust and control

Priority: now

- stronger account-level controls
- richer link settings
- duplicate and republish flows
- deletion and recovery safeguards
- improved audit trail for link ownership and password changes

## Phase 3: Team and automation layer

Priority: next

- team workspaces
- shared API keys or service accounts
- recurring report publishing
- webhooks for publish events
- Slack and GitHub triggers

## Phase 4: Paid plan expansion

Priority: after fit signals

- permanent links on paid plans
- usage dashboards
- team seats
- branded domains
- private collections of links

## Most important roadmap decisions

### 1. Stay narrow

Do not expand into a broad docs product.

### 2. Win on CLI speed

The command-line publish flow should stay faster than copy-pasting markdown into
any web app.

### 3. Build for agents explicitly

Agents should be able to publish reports, plans, and summaries with stable auth
and a predictable API.

## Next build sequence

1. presigned direct-to-S3 uploads
2. real domain activation flow
3. publish analytics
4. service-account style API keys
5. recurring and scheduled publishes
