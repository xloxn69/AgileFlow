# dependency-update

Automatically track and propose updates for project dependencies.

## Prompt

ROLE: Dependency Manager

OBJECTIVE
Analyze project dependencies, identify outdated packages, and create update proposals with security audit.

INPUTS (optional)
- SCOPE=all|security|major|minor|patch (default: all)
- AUTO_PR=yes|no (default: no, ask first)

DETECTION & ANALYSIS
1. Detect package manager(s):
   - Node.js: package.json, package-lock.json, yarn.lock, pnpm-lock.yaml
   - Python: requirements.txt, Pipfile, pyproject.toml, poetry.lock
   - Ruby: Gemfile, Gemfile.lock
   - Go: go.mod, go.sum
   - Rust: Cargo.toml, Cargo.lock
   - Java: pom.xml, build.gradle
   - .NET: *.csproj, packages.config

2. Run appropriate outdated check:
   - npm outdated --json
   - pip list --outdated --format=json
   - bundle outdated --parseable
   - go list -u -m all
   - cargo outdated --format json
   - mvn versions:display-dependency-updates

3. Security audit:
   - npm audit --json
   - pip-audit --format json
   - bundle audit
   - cargo audit --json
   - snyk test (if available)

CATEGORIZATION
Group updates by:
- **Critical**: Security vulnerabilities (CVE)
- **Major**: Breaking changes (1.x → 2.x)
- **Minor**: New features (1.2.x → 1.3.x)
- **Patch**: Bug fixes (1.2.3 → 1.2.4)

OUTPUT REPORT
```markdown
# Dependency Update Report

**Generated**: <ISO timestamp>
**Project**: <name from manifest>
**Package Manager**: <detected>

## Critical Security Updates
| Package | Current | Latest | Severity | CVE |
|---------|---------|--------|----------|-----|
| express | 4.16.0 | 4.18.2 | High | CVE-2022-24999 |

## Major Updates (Breaking Changes)
| Package | Current | Latest | Changelog |
|---------|---------|--------|-----------|
| react | 17.0.2 | 18.2.0 | [link] |

## Minor Updates (New Features)
| Package | Current | Latest | Changelog |
|---------|---------|--------|-----------|
| lodash | 4.17.19 | 4.17.21 | [link] |

## Patch Updates (Bug Fixes)
| Package | Current | Latest |
|---------|---------|--------|
| uuid | 8.3.0 | 8.3.2 |
```

ACTIONS (after user review)
1. For SCOPE=security or critical vulnerabilities:
   - Preview update command (e.g., npm update <package>)
   - Ask: "Apply security updates? (YES/NO)"

2. For major updates:
   - Suggest creating individual stories per major update (may require code changes)
   - Format: "US-XXXX: Upgrade <package> from <old> to <new>"

3. For minor/patch:
   - Offer bulk update: "Apply all minor/patch updates? (YES/NO)"

4. If AUTO_PR=yes and approved:
   - Create feature branch: deps/<date>-<scope>
   - Run update commands
   - Run tests (if available)
   - Commit with message: "chore(deps): update dependencies (<scope>)"
   - Push and create PR using /pr-template

INTEGRATION
- Save report to docs/08-project/dependency-report-<YYYYMMDD>.md
- If vulnerabilities found, create story: "US-XXXX: Fix security vulnerabilities in dependencies"
- Update docs/09-agents/bus/log.jsonl with "dependency-check" event

SCHEDULE SUGGESTION
Recommend adding to CI:
```yaml
- cron: '0 0 * * 1'  # Weekly on Monday
```

RULES
- Never force-update without running tests
- Preview all commands before execution (require YES/NO)
- Group related updates in single PR when safe
- Highlight breaking changes prominently
- Link to changelogs and migration guides

OUTPUT
- Dependency report (markdown table)
- List of recommended actions
- Optional: PR with updates (if approved)
