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
    npm install
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
