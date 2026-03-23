# mdshare.link

`mdshare.link` is now a real app scaffold built with Next.js, Prisma, Stripe,
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

If you're running locally, switch `APP_URL` in `.env` to
`http://localhost:3001`.

3. Create the local database:

```bash
npx prisma db push
```

4. Start the app:

```bash
npm run dev
```

5. For local Stripe webhook testing, run:

```bash
./scripts/stripe-listen.sh
```

That helper forwards Stripe events to `http://localhost:3001/api/stripe/webhook`
and writes the temporary CLI webhook secret to `.stripe-webhook-secret`, which
the app will read automatically in development.

If you want the whole local billing loop in one command, run:

```bash
npm run dev:stripe
```

That starts the dev server on `3001`, waits for it to come up, and then starts
Stripe webhook forwarding in the same terminal session.

## Launch config

Before deploying, set these values explicitly:

- `APP_URL=https://mdshare.link`
- `DATABASE_URL` to your hosted Postgres database
- `STORAGE_BACKEND=s3` with the S3 bucket, region, and credentials
- `RESEND_API_KEY` and `RESEND_WEBHOOK_SECRET`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `STRIPE_PRICE_HOBBY_MONTHLY`

Local development can keep:

- `APP_URL=http://localhost:3000`
- `DATABASE_URL=file:./dev.db`
- `STORAGE_BACKEND=local`

## Strategy docs

Planning and launch docs live under
[/Users/jackzerby/Sites/markdown-link/docs/strategy](/Users/jackzerby/Sites/markdown-link/docs/strategy).
They are reference material for product, marketing, pricing, and launch work,
but they are not part of the runtime app.

## CLI

Publish a markdown file directly:

```bash
./scripts/publish.sh README.md --title "README" --description "project notes" --base-url http://localhost:3000
```

For staging or production, point `--base-url` at the deployed app domain instead.

Or install the command into `~/.local/bin`:

```bash
./scripts/install.sh
```

Then run:

```bash
mdshare README.md
```

You can also pipe content in:

```bash
cat README.md | mdshare -
```

The public URL that the CLI prints comes from the service response, so make
sure `APP_URL` matches the host where the app is actually reachable. In
production, that should be the deployed domain, not the local dev server.

When you pass a file path, the CLI uses the manifest create -> upload ->
finalize flow. When you pipe markdown through stdin, it uses the direct
markdown publish path.

API keys can be supplied with `--api-key`, `MDSHARE_API_KEY`,
`MARKDOWN_LINK_API_KEY`, `~/.mdshare/credentials`, or a
`~/.markdown-link/credentials` file containing the key.

Credential lookup order:

1. `--api-key`
2. `MDSHARE_API_KEY`
3. `MARKDOWN_LINK_API_KEY`
4. `~/.mdshare/credentials`
5. `~/.markdown-link/credentials`

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
- `STRIPE_WEBHOOK_SECRET_FILE`
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
