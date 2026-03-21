---
tracker:
  kind: linear
  api_key: $LINEAR_API_KEY
  project_slug: "markdown-link-81c4a6ab32c7"
  active_states:
    - Todo
    - In Progress
    - Rework
    - Human Review
  terminal_states:
    - Done
    - Closed
    - Cancelled
    - Duplicate

polling:
  interval_ms: 30000

workspace:
  root: $SYMPHONY_WORKSPACE_ROOT

hooks:
  after_create: |
    git clone --depth 1 https://github.com/jackzerby/markdown-link.git .
    npm ci
    npx prisma generate
  before_run: |
    test -f .env || cp .env.example .env
  after_run: |
    npm run build
  timeout_ms: 120000

agent:
  max_concurrent_agents: 4
  max_turns: 20

codex:
  command: "codex app-server --model gpt-5.3-codex"
  approval_policy: never
  thread_sandbox: workspace-write
---

You are working on Linear issue {{ issue.identifier }} for markdown.link.

markdown.link is a Next.js + Prisma service for publishing markdown files with:
- anonymous expiring links and claim flow
- email-code sign in
- Stripe billing
- Resend email delivery
- CLI publishing
- password-protected links
- custom domains
- free vs paid plan behavior

Rules:
- Make the smallest safe change that fully resolves the issue.
- Preserve the product's minimal design language unless the task explicitly asks for a visual change.
- Run the most relevant verification before finishing.
- Update docs and env examples when behavior changes.
- Call out rollout steps when adding new infrastructure or third-party configuration.
- Avoid weakening auth, rate limits, billing, or expiry behavior.

When the issue is ambiguous:
- inspect the existing code first
- prefer repo conventions over introducing new patterns
- leave the workspace in a runnable state

## Role map

Use repo-local skills to keep work focused:

- `$ceo` for weekly priorities, sequencing, and tradeoffs
- `$product-strategy` for roadmap and packaging decisions
- `$launch-ops` for always-on content, replies, and release distribution
- `$growth-lead` for experiments, conversion, and channel learning
- `$linear` for issue-scoped Linear operations during Symphony sessions

## Startup execution

When the project is in founder-led growth mode, optimize for:

- shipping a small visible improvement every few days
- publishing proof-based posts from the command line workflow
- keeping the CLI, share flow, and claim flow obviously understandable
- turning features into shareable demos before broad expansion

## Related skills

- `ceo`: prioritize, sequence, and decide tradeoffs
- `product-strategy`: shape roadmap and packaging
- `launch-ops`: run the daily marketing and release loop
- `growth-lead`: test channels and improve conversion
- `linear`: work issue-by-issue through Symphony sessions
