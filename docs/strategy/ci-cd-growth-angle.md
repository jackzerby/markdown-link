# CI/CD Growth Angle — markdown.link

Owner: Growth Lead
Date: 2026-03-20

## Opportunity

Developers already generate markdown release notes in CI (via GitHub's built-in
release notes, changelog actions, or AI-powered pipelines). But these notes live
inside GitHub Releases — inaccessible to non-GitHub users, buried in the repo,
and not easily shareable via Slack/email/docs.

markdown.link fills this gap: publish the release notes as a standalone, clean
URL that anyone can read. One line in a GitHub Action.

## Why This Is a Growth Channel

1. **Recurring usage** — every release triggers a publish. This isn't a one-time
   tool; it's part of the workflow.
2. **Team exposure** — the published URL gets shared to Slack channels, email
   lists, and stakeholders. Each share is a markdown.link impression.
3. **API key adoption** — CI usage requires an API key, which means sign-up and
   potential Pro conversion.
4. **Differentiator** — no competing tool (mdto.page, Rentry, Pbnj) has CI/CD
   integration. mdto.page's Cloudflare Turnstile actively blocks programmatic
   access.

## GitHub Action Example

This is a ready-to-share example that teams can drop into their workflows:

```yaml
# .github/workflows/publish-release-notes.yml
name: Publish Release Notes

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install markdown.link CLI
        run: curl -fsSL https://markdown.link/install.sh | bash

      - name: Publish release notes
        env:
          MARKDOWN_LINK_API_KEY: ${{ secrets.MARKDOWN_LINK_API_KEY }}
        run: |
          echo "${{ github.event.release.body }}" > /tmp/release-notes.md
          markdown.link /tmp/release-notes.md \
            --title "${{ github.event.release.name }}" \
            --description "Release notes for ${{ github.event.release.tag_name }}"
```

## Alternative: Publish CHANGELOG.md on Every Push to Main

```yaml
name: Publish Changelog

on:
  push:
    branches: [main]
    paths: [CHANGELOG.md]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install markdown.link CLI
        run: curl -fsSL https://markdown.link/install.sh | bash

      - name: Publish changelog
        env:
          MARKDOWN_LINK_API_KEY: ${{ secrets.MARKDOWN_LINK_API_KEY }}
        run: |
          markdown.link CHANGELOG.md \
            --title "Changelog" \
            --description "Latest changes"
```

## Content Pieces for This Angle

### Blog Post / Dev.to Article

**Title:** "Publish release notes to a shareable URL from GitHub Actions in one step"

**Hook:** Your release notes live inside GitHub Releases. Your PM reads Slack.
Your customers read email. None of them are going to click through to your
repo. Here's how to publish release notes as a clean, standalone URL that
anyone can read — one line in your CI pipeline.

**Target audience:** DevOps engineers, team leads, open source maintainers

### Twitter Thread

> Every time we ship a release, the notes go into GitHub Releases.
>
> Our PM never sees them. Our customers definitely don't.
>
> So I added one line to our CI:
> `markdown.link ./RELEASE_NOTES.md --api-key $KEY`
>
> Now the whole team gets a clean URL in Slack. No GitHub account needed.

### Reply Template (for CI/CD threads)

> If you're generating markdown release notes in CI already, you can publish
> them as a standalone URL with one line:
>
> `markdown.link ./CHANGELOG.md --api-key $MARKDOWN_LINK_API_KEY`
>
> Clean rendered page, shareable with anyone. No GitHub account needed on
> their end. https://markdown.link

## Engineering Dependency: Stable Slug / Update Support

For CI/CD to work well, users need to publish to the **same URL** on every
release (update the content, not create a new slug). The current API creates
a new slug each time.

**Handoff to engineering:** Consider adding a `--slug` or `--update` flag that
overwrites an existing publish. This is critical for the "always-current
changelog" use case. Without it, every CI run creates a new URL — fine for
release notes (each release is unique) but bad for changelogs (one living
document).

## Priority

This is a week 2-3 content piece. Ship after Show HN, use it as follow-up
content for ongoing distribution.
