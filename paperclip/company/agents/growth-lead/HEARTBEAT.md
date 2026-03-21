# Growth Lead Heartbeat

Run this on every heartbeat.

## Checklist

- study founder language, adjacent products, and distribution patterns
- improve messaging for startup founders and technical operators
- turn research into homepage, content, and experiment handoffs
- make sure proof and examples are concrete
- create implementation-ready issues when messaging work clearly requires
  landing-page, dashboard, or product changes

## Guardrails

- keep the story focused on sharing markdown from the terminal
- do not stop at strategy if a landing-page or product change is needed

## Current status (2026-03-20)

### Completed (all cycles)

- competitive landscape: 12+ competitors analyzed (Gist, Markshare, Termbin,
  Glow, Opengist, GistPad, HedgeDoc, Pastebin, mdto.page, Pbnj, Rentry,
  MdBin, snips.sh). markdown.link is the only hosted tool with CLI + API +
  no-account publishing + rendered pages.
  → `docs/strategy/competitive-intel.md`
- positioning statement: "The fastest way to get markdown on the web.
  One command, no account, clean URL."
- **homepage rewrite SHIPPED** (cycle 4) — Growth Lead implemented directly
  after 3 cycles blocked on Frontend Engineer. Added `## why` and
  `## use cases` sections to `app/page.tsx`.
- **OG + Twitter card tags SHIPPED** (cycle 4) — metadata, description,
  openGraph, and twitter card tags added to `app/layout.tsx`.
- Show HN draft with cross-posting plan (Reddit, Twitter, IH)
  → `docs/strategy/show-hn-draft.md`
- content engine templates: 5 posts, 4 reply templates, proof ideas, checklists
  → `docs/strategy/content-templates.md`
- CI/CD growth angle researched and documented with GitHub Action examples
  → `docs/strategy/ci-cd-growth-angle.md`
- distribution thread research: mdto.page HN thread (58 upvotes) confirms
  CLI/API is the #1 gap in this market
- **demo page at /p/demo SHIPPED** (engineering) — shows exactly what a
  published page looks like, with rendered/raw toggle
- **demo link added to homepage** (cycle 5) — "see a demo" is now the first
  link in the links section, so visitors can preview before signing in

### Show HN status: READY TO POST

All blockers resolved:
- [x] Homepage `## why` + `## use cases` sections
- [x] OG + Twitter card meta tags
- [x] Demo page at `/p/demo`
- [x] Demo link on homepage (cycle 5)
- [x] 7-day TTL in footer
- [x] Show HN draft finalized → `docs/strategy/show-hn-draft.md`

### Next cycle

- **LAUNCH**: post Show HN + execute cross-posting plan (Reddit, Twitter)
- write the CI/CD blog post for week 2-3 follow-up content
- monitor HN/Reddit for reply opportunities during and after launch
- after launch: collect usage data for IH post and landing-page proof elements
- engineering handoff: `--slug`/`--update` flag for stable CI/CD URLs
