---
name: linear
description: |
  Use Symphony's `linear_graphql` tool during Symphony sessions for raw Linear
  queries and mutations.
---

# Linear

Use this skill only inside Symphony-managed Codex sessions where the
`linear_graphql` tool is available.

## Use cases

- read issue details
- create or edit comments
- inspect workflow states
- move issues between states

## Rules

- request only the fields you need
- prefer narrow issue-scoped operations
- treat GraphQL `errors` as failures

