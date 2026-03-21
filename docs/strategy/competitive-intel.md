# Competitive Intelligence — markdown.link

Owner: Growth Lead
Date: 2026-03-20

## Direct Competitors (HN-validated, 2025-2026)

### mdto.page (Jan 2026, 58 upvotes, 31 comments)

**What it does:** Web upload of markdown → shareable URL. Expiration from 1-30 days.

**Where it falls short (from HN comments):**
- **No CLI or API.** Users asked for CI/CD integration. Creator confirmed API is
  "planned to roll out soon." Cloudflare Turnstile bot protection actively blocks
  programmatic access — this is an architectural problem, not just a missing feature.
- No local image uploads (URL-only).
- Abuse concerns — no reporting mechanism.
- No dark mode.

**Our advantage:** markdown.link has CLI + API from day one. This is the #1 gap
that mdto.page users identified. Our password protection and expiration controls
also address the abuse concern.

**Alternatives mentioned by commenters:** mdview.io, mdshare, peerpad, jbt
markdown editor, Markdeep, docsify-this.net, voiden.md, HedgeDoc.

### Pbnj (Dec 2025, 69 upvotes, 18 comments)

**What it does:** Minimal self-hosted pastebin. Syntax highlighting. CLI. Memorable
URLs ("crunchy-peanut-butter-sandwich"). Deploy in 60 seconds.

**Where it falls short:**
- Self-hosted — user is responsible for hosting, content liability.
- Pastebin, not markdown-rendered pages.
- Commenters asked for markdown rendering toggle.

**Our advantage:** Hosted service, no self-hosting overhead. Rendered markdown
pages, not syntax-highlighted pastes.

### PublishMarkdown (Oct 2025, 1 upvote, no comments)

**What it does:** Markdown → shareable link with custom URLs and passwords.

**Didn't get traction.** Not a threat. Likely because the Show HN pitch wasn't
compelling enough or the product wasn't differentiated.

### Rentry.co (established, GitHub: radude/rentry)

**What it does:** Markdown pastebin with CLI (Python script). Custom URLs, edit
codes, editing after publish. Free.

**Where it falls short:**
- CLI requires Python and manual install (`pip install rentry`).
- No API key system — uses edit codes per paste, not account-level auth.
- No CI/CD integration story.
- No rendered/raw toggle — always rendered.
- No expiration or permanence controls.

**Our advantage:** Native CLI install via curl, API keys for CI, plan-based
expiration/permanence, password protection. Rentry is closer to us than mdto.page
but lacks the developer workflow features (API keys, CI, accounts).

### MdBin (GitHub: kevinfiol/mdbin, also blog.sivaramp.com)

**What it does:** "Pastebin meets GitHub's markdown renderer." No signup, free.
Self-hostable version available. Edit codes for updating.

**Where it falls short:**
- No CLI — web-only paste interface.
- Self-hosted version requires setup.
- Public version has no accounts, no permanence guarantees.

**Our advantage:** CLI-first, hosted, account-based permanence.

### snips.sh (GitHub: robherley/snips.sh)

**What it does:** SSH-powered pastebin. `cat file | ssh snips.sh` for zero-install
sharing. Web UI with syntax highlighting and markdown rendering.

**Where it falls short:**
- SSH-based — clever but unfamiliar UX for most developers.
- No accounts, no permanence, no password protection.
- No custom domains or branding.

**Our advantage:** Familiar CLI UX (`markdown.link ./file.md`), accounts, Pro tier
for permanence, password protection.

## Key Takeaways

1. **The market is active.** Multiple Show HN posts about markdown sharing in the
   last 6 months, all getting engagement. People want this.

2. **CLI/API is the gap.** mdto.page's top-voted thread had multiple requests for
   API access. This is exactly what markdown.link leads with.

3. **CI/CD integration is a power-user hook.** Several commenters on mdto.page
   wanted to publish docs from GitHub Actions. markdown.link's API key system
   already supports this.

4. **Self-hosting is a niche, not the main audience.** Pbnj got traction with
   self-hosters, but our audience is developers who want the fastest path from
   markdown to URL without hosting anything.

5. **Abuse/moderation is a real concern.** Every hosted pastebin gets flagged for
   phishing potential. Password protection and expiration help, but we may need a
   report mechanism eventually.

## How This Shapes Our Show HN Post

Our Show HN should directly address the gaps people complained about in competing
posts:

- **Lead with CLI:** "publish from your terminal, not a web form"
- **Mention API keys:** "works in CI — publish release notes from GitHub Actions"
- **Mention no account:** this was the #1 praise for mdto.page, and we have it too
- **Mention password protection:** addresses the abuse concern proactively
- **Mention rendered pages:** differentiates from pastebins like Pbnj

## Positioning Map (updated)

```
                    CLI / API access
                         ↑
                         |
            markdown.link ★
                         |
    Rentry (Python CLI) ·    snips.sh (SSH) ·
         Pbnj (self-hosted) ·
                         |
    ─────────────────────┼─────────────────────→ Hosted
                         |              mdto.page ·
                         |         MdBin ·
                 Termbin ·        Markshare ·
                         |
                         |
                    Web-only upload
```

markdown.link occupies the top-right quadrant alone: hosted + native CLI + API
keys + CI integration. Rentry has a CLI but requires Python and lacks API keys.
snips.sh is clever but SSH-only and has no accounts.
