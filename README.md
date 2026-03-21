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

## Paperclip

This repo now includes a Paperclip-friendly company package rooted at
[COMPANY.md](/Users/jackzerby/Sites/markdown-link/paperclip/company/COMPANY.md).

Paperclip package contents:

- company root in [COMPANY.md](/Users/jackzerby/Sites/markdown-link/paperclip/company/COMPANY.md)
- teams under [/Users/jackzerby/Sites/markdown-link/paperclip/company/teams](/Users/jackzerby/Sites/markdown-link/paperclip/company/teams)
- agents under [/Users/jackzerby/Sites/markdown-link/paperclip/company/agents](/Users/jackzerby/Sites/markdown-link/paperclip/company/agents)
- starter tasks under [/Users/jackzerby/Sites/markdown-link/paperclip/company/projects/markdown-link/tasks](/Users/jackzerby/Sites/markdown-link/paperclip/company/projects/markdown-link/tasks)
- reusable skills under [/Users/jackzerby/Sites/markdown-link/paperclip/company/skills](/Users/jackzerby/Sites/markdown-link/paperclip/company/skills)

Quickstart from Paperclip's docs:

```bash
npx paperclipai onboard --yes
npx paperclipai run
```

To import this repo as a company package into Paperclip:

```bash
pnpm paperclipai company import \
  --from /Users/jackzerby/Sites/markdown-link/paperclip/company \
  --target new \
  --new-company-name "markdown.link" \
  --include company,agents,projects,skills \
  --api-base http://127.0.0.1:3100
```

Paperclip uses an embedded PostgreSQL instance by default and runs locally at
`http://localhost:3100` in dev mode.

Important: import from `paperclip/company`, not the repo root. The repo root has
extra markdown docs for app development, and the dedicated package folder keeps
Paperclip focused on the company package only.

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
