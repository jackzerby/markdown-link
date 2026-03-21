---
schema: agentcompanies/v1
kind: company
name: markdown.link
slug: markdown-link
description: Agent-native company package for building and shipping markdown.link.
version: 1.0.0
goals:
  - Build the default way for founders and technical teams to share markdown from the terminal.
  - Ship product, growth, and pricing work through a tight autonomous team.
requirements:
  secrets:
    - OPENAI_API_KEY
    - RESEND_API_KEY
    - STRIPE_SECRET_KEY
    - STORAGE_S3_ACCESS_KEY_ID
    - STORAGE_S3_SECRET_ACCESS_KEY
---

# markdown.link

This repository is an importable Paperclip company package for running the
`markdown.link` company.

The company exists to make one thing obvious:

`share a markdown file from the CLI and get a clean link immediately`

## Company rules

- Stay narrow around markdown sharing, not generic docs software.
- Keep the product minimal, trustworthy, and fast.
- Use agents as a cohesive company, not as isolated bots.
- Do not stop at plans or briefs when something needs to be built or shipped.
- Convert useful discoveries into owned implementation work.

## Org structure

- leadership team for priorities and tradeoffs
- growth team for positioning, landing page, content, and launch motion
- engineering team for product implementation and infrastructure

## Starter projects

- product foundation and core publish flow
- landing page and founder conversion
- pricing and paid conversion
- ongoing content and growth loops
