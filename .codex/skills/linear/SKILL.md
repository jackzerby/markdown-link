---
name: linear
description: |
  Use Symphony's `linear_graphql` tool during Symphony sessions for raw Linear
  queries and mutations.
---

# Linear

Use this skill only inside Symphony-managed Codex sessions where the
`linear_graphql` tool is available.

## Best practices

- Keep queries narrow and issue-scoped.
- Prefer reading the current issue before making any state change.
- Use comments for status updates, blockers, and review handoff.
- Treat issue descriptions as source of truth for scope unless a comment or
  explicit founder instruction supersedes them.
- Do not mutate unrelated issues while working a task.

## Use cases

- read issue details
- create or edit comments
- inspect workflow states
- move issues between states

## Rules

- request only the fields you need
- prefer narrow issue-scoped operations
- treat GraphQL `errors` as failures

## Common patterns

### Read an issue by identifier

```graphql
query IssueByIdentifier($identifier: String!) {
  issues(filter: { identifier: { eq: $identifier } }, first: 1) {
    nodes {
      id
      identifier
      title
      description
      state {
        id
        name
        type
      }
      project {
        id
        name
      }
      url
    }
  }
}
```

### Create a status comment

```graphql
mutation CreateComment($issueId: String!, $body: String!) {
  commentCreate(input: { issueId: $issueId, body: $body }) {
    success
    comment {
      id
      url
    }
  }
}
```

### Move an issue to review

```graphql
mutation UpdateIssueState($id: String!, $stateId: String!) {
  issueUpdate(id: $id, input: { stateId: $stateId }) {
    success
  }
}
```
