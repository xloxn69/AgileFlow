# Multi-Expert Orchestration Architecture

Multi-Expert Orchestration deploys multiple domain experts in parallel to analyze complex, cross-domain problems and synthesize their findings into unified recommendations.

---

## Overview

![Diagram 1](images/multi-expert-orchestration-1.svg)


---

## When to Use Multi-Expert

![Diagram 2](images/multi-expert-orchestration-2.svg)


**Use Multi-Expert when:**
- Task spans 3+ domains (e.g., "Add user authentication" touches DB, API, UI, Security)
- Making architectural decisions that affect multiple systems
- Need diverse perspectives on a complex problem
- Want to validate an approach from multiple angles

---

## Expert Selection Process

![Diagram 3](images/multi-expert-orchestration-3.svg)


---

## Parallel Execution Pattern

![Diagram 4](images/multi-expert-orchestration-4.svg)


---

## Synthesis Process

![Diagram 5](images/multi-expert-orchestration-5.svg)


---

## Confidence Scoring

```mermaid
flowchart LR
  accTitle: Confidence Scoring System
  accDescr: How confidence is calculated from expert agreement

  subgraph Experts[5 Experts Deployed]
    e1[Expert 1: A]
    e2[Expert 2: A]
    e3[Expert 3: A]
    e4[Expert 4: B]
    e5[Expert 5: B]
  end

  Experts --> count[Count Agreement]

  count --> score{Score}

  score -->|3+ same (A=3)| high["HIGH (60%+)<br/>Strong consensus"]
  score -->|2 same| medium["MEDIUM (40-59%)<br/>Partial consensus"]
  score -->|All different| low["LOW (<40%)<br/>No consensus"]
```

| Experts Agree | Confidence | Action |
|---------------|------------|--------|
| 3+ of 5 | HIGH | Proceed with recommendation |
| 2 of 5 | MEDIUM | Review disagreements |
| 1 each | LOW | Manual review required |

---

## Output Format

![Diagram 7](images/multi-expert-orchestration-7.svg)


### Example Output

```markdown
## Multi-Expert Analysis: User Authentication System

**Experts Deployed**: security, api, database, ui
**Overall Confidence**: HIGH (3/4 agree on core approach)

### Key Findings (High Confidence)
- Use JWT tokens with 15-minute expiry
- Store refresh tokens in httpOnly cookies
- Add rate limiting on auth endpoints

### Unique Insights
- **Security**: Consider adding device fingerprinting
- **Database**: Use partial indexes on active sessions

### Areas of Disagreement
- Token storage: Security prefers cookies, UI prefers localStorage
- **Resolution**: Use httpOnly cookies (security wins for auth)

### Recommendation
Implement JWT-based auth with:
1. Access tokens (15min) in memory
2. Refresh tokens (7d) in httpOnly cookies
3. Rate limiting: 5 attempts/minute

### Action Items
- [ ] Create users table migration
- [ ] Implement /auth/login endpoint
- [ ] Add JWT middleware
- [ ] Build login form component
```

---

## Sequence: Full Orchestration

![Diagram 8](images/multi-expert-orchestration-8.svg)


---

## Expert Registry

Available experts for orchestration:

| Domain | Expert | Specialization |
|--------|--------|----------------|
| database | `/AgileFlow:agents:database` | Schema, queries, migrations |
| api | `/AgileFlow:agents:api` | Endpoints, REST, GraphQL |
| ui | `/AgileFlow:agents:ui` | Components, styling, UX |
| security | `/AgileFlow:agents:security` | Auth, OWASP, vulnerabilities |
| testing | `/AgileFlow:agents:testing` | Unit, integration, E2E |
| performance | `/AgileFlow:agents:performance` | Optimization, caching |
| devops | `/AgileFlow:agents:devops` | CI/CD, deployment |
| documentation | `/AgileFlow:agents:documentation` | API docs, guides |

---

## Related Documentation

- [Agent Expert System](./agent-expert-system.md)
- [AgileFlow CLI Overview](./agileflow-cli-overview.md)
- [Command: /multi-expert](../../.agileflow/commands/multi-expert.md)
