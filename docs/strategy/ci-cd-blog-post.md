# Publish release notes to a shareable URL from GitHub Actions

Owner: Growth Lead
Date: 2026-03-20
Status: DRAFT — publish week 2-3 after Show HN
Target: Dev.to, Hashnode, personal blog, cross-post to Reddit r/devops + r/github

---

Your release notes live inside GitHub Releases. Your PM reads Slack. Your
customers read email. None of them are clicking through to your repo.

Here's how to publish release notes as a clean, standalone URL that anyone
can read — one step in your CI pipeline.

## The problem

GitHub Releases are great for developers who already live in the repo. But
most of the people who care about your releases — PMs, customers, stakeholders,
partner teams — don't have GitHub accounts or don't check your repo.

You end up copying release notes into Slack, pasting them into an email, or
screenshotting the page. The formatting breaks every time.

## The fix: one line in your GitHub Action

[markdown.link](https://markdown.link) is a CLI that publishes any markdown
file to a clean, shareable URL. No account needed for the person reading it.

Add it to your release workflow:

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

Every time you cut a release, your CI publishes the notes to a URL like
`https://markdown.link/p/f7x2k`. Drop that URL in Slack, email it to
customers, pin it in your docs. Anyone can read it — no GitHub account needed.

## Alternative: publish your changelog on every push

If you maintain a `CHANGELOG.md`, you can publish it automatically whenever
it changes:

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

## What the reader sees

The published page renders your markdown cleanly — headers, lists, code blocks,
tables, all formatted. There's a toggle to view the raw markdown source.
No signup wall, no clutter, no ads.

[See an example →](https://markdown.link/p/demo)

## Setup (2 minutes)

1. **Get an API key.** Sign up at [markdown.link](https://markdown.link),
   go to your dashboard, and grab your API key.

2. **Add it to GitHub Secrets.** In your repo, go to Settings → Secrets →
   Actions → New repository secret. Name it `MARKDOWN_LINK_API_KEY`.

3. **Add the workflow.** Copy one of the YAML examples above into
   `.github/workflows/`.

4. **Ship a release.** The URL shows up in the workflow logs.

## Pricing

Publishing without an account is free — links expire after 7 days. Sign up
for Pro ($5/mo) and links stay permanent. You also get custom domains, a
higher storage limits.

For CI/CD usage, Pro is the right tier — you want release note URLs to stay
live.

## Other ways to use it

Beyond CI, the CLI works from any terminal:

```
# Publish a file
markdown.link ./plan.md

# Pipe content in
cat README.md | markdown.link -

# With a title
markdown.link ./spec.md --title "API Spec v2"
```

No account needed. No editor. Just your terminal and a URL.

---

*[markdown.link](https://markdown.link) — the fastest way to get markdown
on the web.*
