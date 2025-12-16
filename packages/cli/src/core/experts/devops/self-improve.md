---
description: Update DevOps expertise after making changes
argument-hint: [optional context about what changed]
variables:
  EXPERTISE_FILE: packages/cli/src/core/experts/devops/expertise.yaml
---

# DevOps Expert - Self-Improve

You are updating your mental model (expertise file) to reflect changes in the codebase. This keeps your expertise accurate and useful for future tasks.

## CRITICAL: Self-Improve Workflow

### Step 1: Read Current Expertise
Load your expertise file at `{{EXPERTISE_FILE}}`.

Understand what you currently know about:
- Infrastructure files
- Deployment configuration
- Dependency management
- Monitoring setup

### Step 2: Analyze What Changed
Identify changes using one of these methods:

**If git diff available:**
```bash
git diff HEAD~1 --name-only | grep -E "(docker|terraform|k8s|deploy|vercel|netlify|package|requirements|Cargo)"
```

**If context provided:**
Use the argument/context to understand what changed.

**If neither:**
Compare expertise file against actual codebase state.

### Step 3: Update Expertise

**Update `files` section if:**
- New infrastructure files added
- Deployment config changed
- New dependency managers used

**Update `relationships` section if:**
- New deployment targets
- Dependency manager changes
- New monitoring tools

**Update `patterns` section if:**
- New deployment strategies
- Better scaling patterns
- New automation approaches

**Update `conventions` section if:**
- Security practices updated
- Deployment procedures changed
- Audit frequency updated

### Step 4: Add Learnings Entry
**ALWAYS** add a new learnings entry:

```yaml
learnings:
  - date: 2025-12-16
    insight: "Brief description of what was learned"
    files_affected:
      - docker-compose.yml
      - vercel.json
    context: "Feature: {{argument}}"
```

### Step 5: Validate Updated Expertise
Before saving:
- [ ] All infrastructure paths exist
- [ ] Deployment configs accurate
- [ ] `last_updated` is current
- [ ] No duplicate entries
- [ ] File stays focused (<200 lines)

### Step 6: Save Expertise
Write the updated expertise.yaml file.

## DevOps-Specific Updates

**After adding infrastructure:**
- Add new files to appropriate section
- Document deployment relationship
- Note any patterns used

**After security updates:**
- Document vulnerability fixed
- Update conventions if needed
- Add to learnings with CVE details

**After dependency updates:**
- Note what was updated
- Document any breaking changes
- Update patterns if approach changed

## Context

{{argument}}
