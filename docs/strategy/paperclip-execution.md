# Paperclip Execution Guide

## Purpose

Define how the markdown.link company package should operate inside Paperclip.

## Package path

Use the dedicated Paperclip package at `paperclip/company/`, not the repo root.
The repo root contains extra app and strategy markdown that should not be part
of the imported company package.

## Operating model

- the company package defines the org chart and starter work
- Paperclip provides issue tracking, heartbeats, and company-level visibility
- agents should move work toward shipped outcomes, not just write plans

## Team expectations

- leadership chooses priorities and tradeoffs
- growth defines messages, content, and landing-page direction
- engineering implements the actual product changes
- business ops keeps pricing and paid conversion simple

## Handoff rule

If a non-engineering agent identifies something that should exist in the
product, there must be an implementation owner or implementation issue.

## Good behavior

- create small tasks
- leave clear handoff notes
- keep the company aligned to the same narrow wedge
- turn useful research into product, growth, or pricing actions
