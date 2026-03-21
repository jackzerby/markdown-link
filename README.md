# markdown.link

`markdown.link` is now a real app scaffold built with Next.js, Prisma, Stripe,
and Resend.

## Included

- minimal homepage with rendered/raw markdown toggle
- email-code auth flow
- anonymous publish + claim flow
- direct markdown publish flow and manifest upload/finalize flow
- CLI publish command and installer scripts
- dashboard routes for sites, api keys, plan, domains, handle, and support
- public markdown viewer routes
- password-protected publish flow
- storage adapter with local `.data/` dev mode and S3-compatible production mode
- cleanup script for expired anonymous publishes
- live plan usage metering with free-tier enforcement
- Resend delivery webhook route
- Stripe Checkout + Customer Portal route handlers
- Stripe webhook route
- Prisma schema for users, sessions, api keys, sites, versions, claims, billing, and support

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy envs:

```bash
cp .env.example .env
```

3. Create the local database:

```bash
npx prisma db push
```

4. Start the app:

```bash
npm run dev
```

## Symphony

This repo now includes a repo-owned [WORKFLOW.md](/Users/jackzerby/Sites/markdown-link/WORKFLOW.md)
for running OpenAI Symphony against the project.

Expected env vars for Symphony:

- `LINEAR_API_KEY`
- `SYMPHONY_WORKSPACE_ROOT`

The workflow is configured to:

- poll the Linear project at `https://linear.app/jack-zerby-consulting-llc/project/markdown-link-81c4a6ab32c7/overview`
- clone `https://github.com/jackzerby/markdown-link.git` into each issue workspace
- run `npm install` and `npx prisma generate` on workspace creation
- default missing local envs with `cp .env.example .env`
- run `npm run build` after each attempt

The repo-local role map is:

- `ceo` for priorities and tradeoffs
- `product-strategy` for roadmap decisions
- `launch-ops` for daily marketing and release motion
- `growth-lead` for experiments and channel learning
- `linear` for issue-level Symphony work

You can start Symphony from this repo with:

```bash
./scripts/run-symphony.sh --port 4100
```

Typical startup flow:

```bash
git clone https://github.com/openai/symphony
cd symphony/elixir
mise trust
mise install
mise exec -- mix setup
mise exec -- mix build
export LINEAR_API_KEY=...
export SYMPHONY_WORKSPACE_ROOT=~/symphony-workspaces
./bin/symphony /Users/jackzerby/Sites/markdown-link/WORKFLOW.md
```

The helper script assumes Symphony is cloned to `/Users/jackzerby/Sites/symphony`
and defaults `SYMPHONY_WORKSPACE_ROOT` to `~/symphony-workspaces/markdown-link`.

## CLI

Publish a markdown file directly:

```bash
./scripts/publish.sh README.md --title "README" --description "project notes" --base-url http://localhost:3000
```

Or install the command into `~/.local/bin`:

```bash
./scripts/install.sh
```

Then run:

```bash
markdown.link README.md
```

You can also pipe content in:

```bash
cat README.md | markdown.link -
```

The public URL that the CLI prints comes from the service response, so make
sure `APP_URL` matches the host where the app is actually reachable.

When you pass a file path, the CLI uses the manifest create -> upload ->
finalize flow. When you pipe markdown through stdin, it uses the direct
markdown publish path.

API keys can be supplied with `--api-key`, `MARKDOWN_LINK_API_KEY`, or a
`~/.markdown-link/credentials` file containing the key.

Credential lookup order:

1. `--api-key`
2. `MARKDOWN_LINK_API_KEY`
3. `~/.markdown-link/credentials`

The credentials file should contain the raw API key on a single line.

## Upload/finalize API

The service now supports two publish modes:

- simple markdown body posts to `/api/publishes`
- manifest-based create/upload/finalize flow via `/api/publishes`, `/api/publishes/[slug]/files`, and `/api/publishes/[slug]/finalize`

## Important env vars

- `DATABASE_URL`
- `SESSION_SECRET`
- `API_KEY_PEPPER`
- `STORAGE_BACKEND`
- `STORAGE_LOCAL_ROOT`
- `STORAGE_S3_BUCKET`
- `STORAGE_S3_REGION`
- `STORAGE_S3_ENDPOINT`
- `STORAGE_S3_ACCESS_KEY_ID`
- `STORAGE_S3_SECRET_ACCESS_KEY`
- `STORAGE_S3_PREFIX`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_WEBHOOK_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_HOBBY_MONTHLY`

## Current product assumptions

- free publishes expire after `FREE_PUBLISH_TTL_SECONDS`
- anonymous publishes can be claimed after email verification
- hobby users get permanent publishes
- Stripe webhooks are the source of truth for billing state

## Next steps

- move upload traffic from server relay to presigned direct-to-blob uploads
- add richer site management actions like duplicate/delete/password audit history
- add background jobs for cleanup, billing retries, and domain revalidation
