# Content Engine Templates — markdown.link

Owner: Growth Lead (templates) → Launch Ops (execution)
Date: 2026-03-20
Status: TEMPLATES ONLY — do not post until homepage rewrite ships

## Post Queue

### Post 1: Show HN (primary launch)

Full draft in `docs/strategy/show-hn-draft.md`.

**Title:** Show HN: markdown.link – Publish markdown to a URL from the terminal

**Timing:** First post. Ship after homepage rewrite + demo page + OG tags.

---

### Post 2: Reddit r/commandline

**Title:** Built a CLI to publish markdown as a clean web page — no account needed

**Body:**

```
I kept needing to share project docs and drafts with people who don't have
GitHub accounts. Gist requires GitHub, Notion requires signup, pastebins
show raw text.

So I built markdown.link — one command from the terminal, get a clean
rendered page with a shareable URL.

    curl -fsSL https://markdown.link/install.sh | bash
    markdown.link ./plan.md
    → https://markdown.link/p/f7x2k

No account required. Free links expire after 7 days. Pro ($5/mo) keeps
them permanent.

Also works with pipes: `cat README.md | markdown.link -`

Looking for feedback on the CLI UX. What would you want from a tool like this?
```

**Timing:** Same day as Show HN, afternoon.

---

### Post 3: Reddit r/webdev

**Title:** Side project: publish markdown files to shareable URLs from the CLI

**Body:**

```
Sharing a side project. markdown.link turns .md files into shareable
web pages from the terminal.

One command, no signup. The viewer renders markdown with a toggle between
rendered and raw. Password protection built in.

Free links expire after 7 days. Pro ($5/mo) keeps them permanent with
custom domains.

Built with Next.js, Prisma, and Stripe if anyone's curious about the stack.

https://markdown.link
```

**Timing:** Day after Show HN.

---

### Post 4: Twitter/X thread (build in public)

Full thread in `docs/strategy/show-hn-draft.md` under "Twitter/X" section.

**Timing:** Same day as Show HN.

---

### Post 5: Indie Hackers

**Title:** I launched markdown.link on HN — here's what happened

**Body template (fill in after HN launch):**

```
I built markdown.link, a CLI that publishes markdown files to shareable
URLs. I launched on Hacker News [link] and here's what I learned:

- Traffic: [X] unique visitors in first 24h
- Signups: [X]
- Pro upgrades: [X]
- Top feedback: [summarize]

What worked: [what]
What I'd do differently: [what]

The product: one command, no account, clean rendered page. Free links
expire after 7 days, Pro ($5/mo) keeps them permanent.
```

**Timing:** 3-5 days after Show HN.

---

## Reply Queue

Templates for responding to threads about document sharing, CLI tools, or
markdown workflows. Use when a relevant thread appears on HN, Reddit, or
Twitter.

### Reply Template A: "How do you share docs with your team?"

```
I use `markdown.link ./file.md` from the terminal. One command, get a URL
with a clean rendered page. No signup needed for the recipient. Free links
expire after 7 days, $5/mo keeps them permanent.

https://markdown.link
```

### Reply Template B: "Best GitHub Gist alternatives?"

```
I built markdown.link as an alternative for sharing markdown. The main
differences from Gist:

- No GitHub account needed (yours or your reader's)
- One command: `markdown.link ./notes.md` → shareable URL
- Clean rendered page, not a cluttered Gist UI
- Password protection and expiration controls

Free links expire after 7 days, Pro ($5/mo) keeps them permanent.

https://markdown.link
```

### Reply Template C: "How do you share CLI output / notes?"

```
I pipe it through markdown.link:

    cat output.md | markdown.link -

Get a clean rendered URL instantly. No signup, no editor. Works from
any terminal. Free links expire, $5/mo permanent.

https://markdown.link
```

### Reply Template D: "Best pastebin for markdown?"

```
If you specifically want rendered markdown (not syntax-highlighted
paste), check out markdown.link. It's a CLI that publishes .md files
to clean web pages:

    markdown.link ./notes.md
    → https://markdown.link/p/f7x2k

No account needed. Free links expire after 7 days, Pro keeps them
permanent. Also has password protection and a rendered/raw toggle.
```

---

## Landing-Page Proof Ideas

Social proof elements to add after launch, once we have real usage data:

1. **Counter:** "X markdown files published" — simple, growing number
2. **Testimonial:** Screenshot of a positive HN comment or tweet
3. **Use case badge:** "Used in CI by [X] teams" (once we see API key usage)
4. **Speed claim:** "Published in under 2 seconds" (measure actual CLI time)

These require real data. Do not fabricate numbers.

---

## Asset Checklist (pre-launch)

- [ ] Homepage rewrite shipped (## why + ## use cases)
- [ ] OG meta tags in layout.tsx
- [ ] Demo page at /p/demo (so visitors can see output)
- [ ] CLI install script accessible at https://markdown.link/install.sh
- [ ] Show HN draft finalized
- [ ] Cross-post drafts finalized
- [ ] Reply templates saved and accessible

## Asset Checklist (post-launch)

- [ ] Screenshot of HN thread for social proof
- [ ] Usage data pulled for IH post
- [ ] Top feedback synthesized into next product cycle
