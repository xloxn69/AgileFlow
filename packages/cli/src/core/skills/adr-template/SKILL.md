---
name: adr-template
description: Generate Architecture Decision Record structure with context/decision/consequences
---

# adr-template

Generate Architecture Decision Record structure with context/decision/consequences.

## Activation Keywords
- "ADR", "architecture decision", "decision record", "adr template"

## When to Use
- Major architectural decisions made during implementation
- Documenting why a technology/pattern was chosen
- Recording decision trade-offs and alternatives considered

## What This Does
Generates complete ADR structure with:
- **Title**: Clear, concise decision title
- **Status**: Proposed, Accepted, Deprecated, Superseded
- **Context**: Why this decision was needed, what problem does it solve
- **Decision**: What was decided and why
- **Consequences**: Positive outcomes and risks introduced
- **Alternatives**: Other options considered and why rejected
- **Related Stories**: Links to affected user stories

Includes proper YAML frontmatter for integration with status.json.

## Output
Ready-to-use ADR file in docs/03-decisions/adr-XXXX.md format

## Example Activation
User: "We decided to use JWT for authentication instead of sessions"
Skill: Generates:
```
---
adr_id: ADR-0042
title: Use JWT for stateless authentication
status: accepted
date: 2025-10-28
---

## Context
Application needs scalable authentication across microservices.
Session-based auth requires shared state/cache.

## Decision
Adopt JWT (JSON Web Tokens) for stateless authentication.

## Consequences
✅ Benefits: Scalable, distributed, microservice-friendly
❌ Risks: Token revocation requires blacklist, larger payload

## Alternatives Considered
1. Session + Redis: Requires shared state
2. OAuth2: Overkill for internal auth

## Related Stories
- US-0001: User Login API
- US-0002: Password Reset
```
