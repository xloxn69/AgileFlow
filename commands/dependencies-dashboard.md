# dependencies-dashboard

Create a visual dashboard of project dependencies with versions and update status.

## Prompt

ROLE: Dependency Dashboard Generator

OBJECTIVE
Scan project dependencies and generate a comprehensive dashboard showing versions, outdated packages, security issues, and update recommendations.

INPUTS (optional)
- OUTPUT=markdown|html|json (default: markdown)
- INCLUDE_DEV=yes|no (default: yes)
- SAVE_TO=<path> (default: docs/08-project/dependencies-dashboard.md)

DETECTION

Scan for dependency manifests:
- **Node.js**: package.json, package-lock.json
- **Python**: requirements.txt, Pipfile, pyproject.toml
- **Ruby**: Gemfile, Gemfile.lock
- **Go**: go.mod, go.sum
- **Rust**: Cargo.toml, Cargo.lock
- **Java**: pom.xml, build.gradle
- **.NET**: *.csproj, packages.config
- **PHP**: composer.json

ANALYSIS

For each dependency, collect:
1. **Name**: Package name
2. **Current Version**: Installed version
3. **Latest Version**: Most recent available
4. **Type**: Production / Development / Peer
5. **Status**: Up-to-date / Minor update / Major update / Deprecated
6. **Vulnerabilities**: Known CVEs
7. **License**: Software license
8. **Last Updated**: When dependency was last updated upstream
9. **Dependents**: How many project files import it

DATA SOURCES

- `npm outdated`, `pip list --outdated`, etc.
- `npm audit`, `pip-audit`, etc.
- Registry APIs (npmjs.com, pypi.org, crates.io, etc.)
- License scanners
- Import/usage analysis (grep)

DASHBOARD FORMAT (Markdown)

```markdown
# Dependencies Dashboard

**Project**: <name>
**Generated**: 2025-10-16 10:00:00 UTC
**Total Dependencies**: 145 (prod: 98, dev: 47)

---

## Summary

| Category | Count | Action Needed |
|----------|-------|---------------|
| 🔴 Critical Vulnerabilities | 2 | Update immediately |
| 🟠 Major Updates | 12 | Review breaking changes |
| 🟡 Minor Updates | 28 | Safe to update |
| 🟢 Up-to-date | 85 | No action |
| ⚪ Deprecated | 3 | Find alternatives |

---

## Critical Vulnerabilities 🔴

### express@4.16.0
**Current**: 4.16.0 → **Latest**: 4.18.2 (+2 major)
**Severity**: HIGH (CVSS 7.5)
**CVE**: CVE-2022-24999
**Description**: ReDoS vulnerability in Express.js routing
**Fix**: `npm install express@4.18.2`
**Affected**: 3 files import this
**License**: MIT

---

### lodash@4.17.19
**Current**: 4.17.19 → **Latest**: 4.17.21 (+0.0.2 patch)
**Severity**: HIGH (CVSS 7.4)
**CVE**: CVE-2021-23337
**Description**: Command injection via template
**Fix**: `npm update lodash`
**Affected**: 8 files import this
**License**: MIT

---

## Deprecated Packages ⚪

### request@2.88.2
**Status**: DEPRECATED (Feb 2020)
**Alternative**: axios, node-fetch, undici
**Affected**: 2 files use this
**Migration effort**: Medium (~1 day)

---

## Major Updates 🟠

### react@17.0.2 → 18.2.0
**Change**: +1 major
**Breaking changes**: Yes
**Changelog**: https://react.dev/blog/2022/03/29/react-v18
**Key changes**:
- New concurrent features
- Automatic batching
- New Suspense behavior
**Affected**: 45 files import React
**Recommendation**: Review migration guide before updating
**License**: MIT

---

### typescript@4.9.5 → 5.3.3
**Change**: +1 major
**Breaking changes**: Yes (type system improvements)
**Changelog**: https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/
**Affected**: All .ts files
**Recommendation**: Test thoroughly after update
**License**: Apache-2.0

---

[10 more major updates...]

---

## Minor & Patch Updates 🟡

| Package | Current | Latest | Type | Fix |
|---------|---------|--------|------|-----|
| axios | 1.5.0 | 1.6.2 | minor | `npm update axios` |
| jest | 29.6.0 | 29.7.0 | minor | `npm update jest` |
| prettier | 3.0.0 | 3.1.0 | minor | `npm update prettier` |
| uuid | 9.0.0 | 9.0.1 | patch | `npm update uuid` |
| [...] | [...] | [...] | [...] | [...] |

**Bulk update command**:
```bash
npm update  # Updates all within semver range
```

---

## Up-to-date ✅

85 dependencies are on the latest version. Great job!

---

## Dependency Breakdown by Type

### Production Dependencies (98)
- Up-to-date: 65 (66%)
- Needs update: 30 (31%)
- Deprecated: 3 (3%)

### Dev Dependencies (47)
- Up-to-date: 20 (43%)
- Needs update: 25 (53%)
- Deprecated: 2 (4%)

---

## License Compliance

| License | Count |
|---------|-------|
| MIT | 98 |
| Apache-2.0 | 23 |
| ISC | 15 |
| BSD-3-Clause | 7 |
| ⚠️ GPL-3.0 | 2 |

**Warning**: GPL-3.0 licenses may have compatibility issues with proprietary software.

---

## Dependency Size Analysis

**Total bundle size** (production): 2.4 MB

Top 10 largest dependencies:
1. @aws-sdk/client-s3 (852 KB)
2. moment (231 KB) ⚠️ Consider date-fns (lighter)
3. lodash (182 KB) ⚠️ Use lodash-es for tree-shaking
4. rxjs (145 KB)
5. [...]

**Recommendations**:
- Replace `moment` with `date-fns` (save ~150 KB)
- Use `lodash-es` instead of `lodash` (save ~100 KB with tree-shaking)
- Consider lazy-loading `@aws-sdk/client-s3`

---

## Dependency Graph (Top-Level)

```
project
├── express@4.16.0 🔴 (has vulnerabilities)
│   ├── body-parser@1.20.0 🟢
│   ├── cookie@0.5.0 🟢
│   └── ...
├── react@17.0.2 🟠 (major update available)
│   ├── loose-envify@1.4.0 🟢
│   └── ...
├── typescript@4.9.5 🟠 (major update available)
└── ...
```

---

## Update Recommendations

### Immediate (Critical)
1. Update `express` to 4.18.2 (security)
2. Update `lodash` to 4.17.21 (security)

### This Sprint
3. Replace `request` with `axios` (deprecated)
4. Update 28 minor/patch dependencies (bulk update)

### Next Sprint
5. Plan migration to React 18 (breaking changes)
6. Evaluate TypeScript 5 migration

---

## Maintenance Score: 78/100

**Breakdown**:
- Security: 60/100 (2 critical vulnerabilities)
- Freshness: 80/100 (most deps recent)
- License compliance: 95/100 (2 GPL warnings)
- Bundle size: 75/100 (some optimization possible)

**Recommendation**: Address security issues immediately, then plan regular maintenance.

---

## Automated Checks

Add to CI:
\`\`\`yaml
- name: Check dependencies
  run: npm audit --audit-level=moderate
\`\`\`

Schedule weekly dependency scans:
\`\`\`yaml
- cron: '0 0 * * 1'  # Monday
\`\`\`

---

**Last updated**: 2025-10-16 10:00:00 UTC
**Next scan**: 2025-10-23 10:00:00 UTC
```

VISUALIZATION (HTML Output)

If OUTPUT=html, generate interactive dashboard with:
- Color-coded status badges
- Sortable/filterable tables
- Dependency graph visualization (D3.js or Mermaid)
- Click to expand details
- Quick action buttons ("Update", "Learn more")

JSON OUTPUT

If OUTPUT=json, provide structured data for tooling:
```json
{
  "generated": "2025-10-16T10:00:00Z",
  "project": "my-app",
  "summary": {
    "total": 145,
    "production": 98,
    "development": 47,
    "critical": 2,
    "major_updates": 12,
    "minor_updates": 28,
    "up_to_date": 85,
    "deprecated": 3
  },
  "vulnerabilities": [
    {
      "package": "express",
      "current": "4.16.0",
      "fixed": "4.18.2",
      "severity": "HIGH",
      "cve": "CVE-2022-24999",
      "score": 7.5
    }
  ],
  "outdated": [...],
  "deprecated": [...],
  "licenses": {...}
}
```

ACTIONS (after user review)

1. Ask: "Update critical vulnerabilities now? (YES/NO)"
2. If YES: Run `npm audit fix` or equivalent

3. Ask: "Create story for deprecated package migration? (YES/NO)"
4. If YES: Create story for each deprecated package

5. Ask: "Schedule weekly dependency scan in CI? (YES/NO)"
6. If YES: Add cron job to CI workflow

7. Save dashboard to specified path

INTEGRATION

### Story Creation
For deprecated or vulnerable packages:
```markdown
---
story_id: US-XXXX
title: Migrate from 'request' to 'axios'
type: tech-debt
estimate: 1d
---

## Context
Package 'request' is deprecated since Feb 2020.

## Acceptance Criteria
- [ ] Replace all 'request' imports with 'axios'
- [ ] Update 2 files: src/api/client.ts, src/utils/http.ts
- [ ] Tests pass
- [ ] Remove 'request' from package.json
```

### CI Integration
Add automated checks:
```yaml
- name: Dependency audit
  run: npm audit --audit-level=high

- name: Check outdated
  run: npm outdated || true  # Don't fail, just warn

- name: Generate dashboard
  run: npx claude-code /AgileFlow:dependencies-dashboard
```

AUTOMATION

Suggest Dependabot config (.github/dependabot.yml):
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

RULES
- Prioritize security updates
- Group minor/patch updates when safe
- Warn about breaking changes (major updates)
- Never auto-update without approval
- Highlight deprecated packages prominently
- Consider bundle size impact
- Check license compatibility

OUTPUT
- Dependency dashboard (markdown/html/json)
- Update recommendations
- Security alerts
- Optional: CI configuration
- Optional: Automated update PR
