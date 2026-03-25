# Show HN Draft — markdown.link

Owner: Growth Lead
Date: 2026-03-20
Status: READY TO POST — all blockers resolved as of cycle 5

## Title

Show HN: markdown.link – Publish markdown to a URL from the terminal

## Body

I kept needing to share project docs, meeting notes, and drafts with people
who don't have GitHub accounts and don't want to sign up for Notion. I wanted
one command and a URL.

```
curl -fsSL https://markdown.link/install.sh | bash
markdown.link ./plan.md
→ https://markdown.link/p/f7x2k
```

No account required. No editor. Just your terminal and a clean rendered page.

If you publish without signing in, links expire after 7 days. Sign up for Pro
($5/mo) and they stay permanent with higher storage limits.

It also works in CI — you can publish release notes from GitHub Actions with an
API key:

```
markdown.link ./CHANGELOG.md --api-key $MARKDOWN_LINK_API_KEY
```

Or pipe content in:

```
cat README.md | markdown.link -
```

The viewer renders markdown with a toggle between rendered and raw. Password
protection is built in.

Built with Next.js, Prisma, and Stripe. Happy to answer questions about the
architecture or hear what you'd want from a tool like this.

https://markdown.link

## Why this draft works (internal notes)

This draft directly addresses every gap and request from competitor HN threads:

1. **CLI-first** — mdto.page's top request was API/CLI access. We lead with it.
2. **No account** — this was the #1 praise for mdto.page. We have it too.
3. **CI integration** — multiple mdto.page commenters wanted this. We show
   the exact command with an API key.
4. **Pipe support** — shows power-user flexibility.
5. **Password protection** — addresses the abuse concern proactively (raised
   in every pastebin HN thread).
6. **Pricing is transparent** — "7 days free, $5/mo permanent" is clear. No
   guessing.
7. **Tech stack mentioned** — HN readers like knowing what it's built with.
8. **"Happy to answer questions"** — engagement signal.

## Cross-posting plan (same day as HN)

### Reddit

**r/commandline:**
> Built a tool to publish markdown as a clean web page from the CLI. No account
> required. `markdown.link ./plan.md` → URL. Looking for feedback.

**r/webdev:**
> Sharing a side project: markdown.link turns .md files into shareable URLs
> from the terminal. One command, no signup. Free links expire after 7 days,
> Pro ($5/mo) keeps them permanent.

### Twitter/X

Thread opener:
> I built a CLI that publishes markdown files to the web in one command.
>
> No account. No editor. Just:
> `markdown.link ./notes.md`
> → clean URL
>
> Here's what makes it different from Gist, Notion, and pastebins: 🧵

Thread:
> 1/ GitHub Gist requires a GitHub account. Your PM doesn't have one.
>
> 2/ Notion requires everyone to sign up. You just want to send a link.
>
> 3/ Pastebins show raw text. markdown.link renders your markdown as a clean page.
>
> 4/ It works in CI too. Publish release notes from GitHub Actions with an API key.
>
> 5/ Free links expire after 7 days. Pro ($5/mo) keeps them permanent.
>
> Try it: curl -fsSL https://markdown.link/install.sh | bash

## Blockers before posting

- [x] Homepage rewrite must ship (use cases + why sections) — SHIPPED cycle 4
- [x] Demo page at /p/demo must exist so HN readers can see output — SHIPPED
- [x] OG tags must be in place for social link previews — SHIPPED cycle 4
- [x] TTL confirmed at 7 days (now shipped in footer copy) — SHIPPED
- [x] Demo link added to homepage links section — SHIPPED cycle 5

**STATUS: ALL BLOCKERS RESOLVED. READY TO POST.**
