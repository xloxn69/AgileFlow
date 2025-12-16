---
description: Plan, build, and improve DevOps feature with expertise-driven workflow
argument-hint: <DevOps feature description>
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/devops/expertise.yaml
---

# DevOps Expert: Plan → Build → Self-Improve

You are executing a complete DevOps feature implementation with automatic knowledge capture.

## CRITICAL: Three-Step Workflow

**You MUST follow this exact sequence. Do not skip steps.**

---

## Step 1: PLAN (Expertise-Informed)

### 1.1 Load Your Expertise
Read your expertise file at `{{EXPERTISE_FILE}}` FIRST.

Extract from it:
- Infrastructure file locations
- Deployment targets and configs
- Dependency management setup
- Monitoring configuration

### 1.2 Validate Against Codebase
Before planning, verify your expertise:
```bash
ls -la docker-compose.yml Dockerfile terraform/ k8s/ 2>/dev/null || true
ls -la vercel.json netlify.toml fly.toml 2>/dev/null || true
```

### 1.3 Create Implementation Plan
```markdown
## DevOps Implementation Plan

### Infrastructure Changes
1. [file path] - [change description]
   - Components: [list]
   - Dependencies: [list]
   - Rollback plan: [description]

### Pattern to Follow
[Reference deployment pattern from expertise]

### Validation
- [ ] Infrastructure deploys correctly
- [ ] No security vulnerabilities
- [ ] Rollback tested
```

---

## Step 2: BUILD (Execute Plan)

### 2.1 Pre-Build Verification
- Check existing infrastructure state
- Verify credentials/secrets available
- Backup current configuration

### 2.2 Execute the Plan
```yaml
# Follow patterns from expertise
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

### 2.3 Capture Changes
```bash
git diff --name-only | grep -E "(docker|terraform|k8s|deploy|vercel)"
git diff HEAD
```

### 2.4 Validate Build
- Test deployment locally/staging
- Run security audit: `npm audit`
- Verify monitoring/alerts work

**On Failure**: Stop. Do NOT proceed to self-improve.

---

## Step 3: SELF-IMPROVE (Update Expertise)

**ONLY run if Step 2 succeeded.**

### 3.1 Analyze What Changed
- New infrastructure files
- Deployment config changes
- Dependency updates
- Monitoring additions

### 3.2 Update Expertise File
Read and update `{{EXPERTISE_FILE}}`:

**Update `files` if:**
- New infrastructure files created
- Deployment configs added

**Update `relationships` if:**
- New deployment targets
- Dependency manager changes
- Monitoring tools added

**Update `patterns` if:**
- New deployment strategy
- Better scaling pattern
- Improved automation

**Update `conventions` if:**
- Security practices updated
- Audit frequency changed

### 3.3 Add Learnings Entry
```yaml
learnings:
  - date: 2025-12-16
    insight: "Added [infrastructure] for [purpose]"
    files_affected:
      - docker-compose.yml
    context: "Feature: {{argument}}"
```

### 3.4 Validate and Save
- [ ] All paths exist
- [ ] `last_updated` current
- [ ] No duplicates

---

## DevOps Feature Request

{{argument}}
