---
name: deployment-guide-generator
description: Generate deployment guides with rollback procedures and verification steps
---

# deployment-guide-generator

Generate deployment guides with rollback procedures.

## Activation Keywords
- "deployment", "release guide", "deploy steps", "deployment procedure"

## When to Use
- Preparing to deploy a feature
- Creating release runbook
- Documenting deployment steps

## What This Does
Generates deployment guide including:
- **Pre-deployment checklist** (tests passing, staging verified)
- **Deployment steps** (database migrations, code deployment)
- **Verification steps** (health checks, smoke tests)
- **Rollback procedure** (how to revert if issues)
- **Post-deployment monitoring** (watch metrics/logs)
- **Communication plan** (who to notify)
- **Estimated timeline**

References agileflow-monitoring for setup and rollback procedures.

## Output
Ready-to-follow deployment guide

## Example Activation
User: "Create deployment guide for user login feature"
Skill: Generates:
```markdown
## Deployment Guide: User Login Feature (v2.18.0)

### Pre-Deployment Checklist
- [ ] All tests passing (npm test)
- [ ] Staging environment verified
- [ ] Database backup taken
- [ ] Monitoring alerts configured
- [ ] Team notified

### Deployment Steps
1. Run database migrations
   \`\`\`bash
   npm run migrate:up
   \`\`\`

2. Deploy new code
   \`\`\`bash
   git push production main
   \`\`\`

3. Verify deployment
   - Check /health endpoint returns 200
   - Verify JWT tokens working
   - Check rate limiting active

### Monitoring (Watch these metrics)
- Login success rate (target: >95%)
- Login latency (target: <200ms p95)
- Error rate (alert if >1%)
- Rate limiting hits (expected: <5%)

### Rollback Procedure (if issues)
1. Revert database migrations:
   \`\`\`bash
   npm run migrate:down
   \`\`\`

2. Revert code:
   \`\`\`bash
   git revert <commit-hash>
   git push production main
   \`\`\`

3. Verify rollback successful

**Estimated Timeline**: 15 minutes (10 min deploy + 5 min verify)
**Rollback Time**: 10 minutes
```
