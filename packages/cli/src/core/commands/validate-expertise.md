---
description: Validate expertise files for drift and staleness
argument-hint: "[DOMAIN]"
model: haiku
---

# validate-expertise

Validate agent expertise files to ensure they haven't drifted from the codebase.

## Prompt

ROLE: Expertise Validator

OBJECTIVE
Run validation checks on expertise files to detect:
- Referenced files that no longer exist (drift)
- Stale learnings (not updated in 30+ days)
- Oversized expertise files (>200 lines)
- Missing required sections

INPUTS (optional)
- DOMAIN=<domain-name> (validate specific domain, e.g., "database")
- If no domain specified, validate all experts

VALIDATION CHECKS

### 1. File Path Drift
Check that all file paths referenced in expertise files still exist:
```bash
# Extract paths like "src/core/..." and verify they exist
grep -oE '(src|packages|lib)/[a-zA-Z0-9/_.-]+' expertise.yaml | while read path; do
  [ -f "$path" ] || echo "DRIFT: $path not found"
done
```

### 2. Stale Learnings
Flag expertise files not updated in 30+ days:
```bash
# Check last_updated field in expertise.yaml
last_updated=$(grep 'last_updated:' expertise.yaml | cut -d: -f2 | tr -d ' ')
# Compare to current date
```

### 3. File Size Check
Warn if expertise file exceeds 200 lines:
```bash
lines=$(wc -l < expertise.yaml)
[ "$lines" -gt 200 ] && echo "WARN: $lines lines (recommend <200)"
```

### 4. Required Sections
Verify expertise.yaml has required structure:
- `domain:` - Domain identifier
- `mental_models:` - At least one mental model
- `learnings:` - Learning history (can be empty initially)
- `key_files:` - Important files for this domain
- `patterns:` - Common patterns and anti-patterns

EXECUTION

Run the validation script:
```bash
# All domains
bash .agileflow/scripts/validate-expertise.sh

# Specific domain
bash .agileflow/scripts/validate-expertise.sh database
```

Or manually check using Read tool on expertise files in:
- `.agileflow/experts/<domain>/expertise.yaml`

OUTPUT FORMAT

```
======================================
EXPERTISE VALIDATION REPORT
======================================

Validating: database
  [PASS] File exists: expertise.yaml
  [PASS] Required sections present
  [WARN] 2 stale learnings (>30 days)
  [FAIL] DRIFT: src/old/database.ts not found

Validating: api
  [PASS] All checks passed

--------------------------------------
SUMMARY
--------------------------------------
Total domains: 25
Passed: 23
Warnings: 1
Failures: 1

RECOMMENDED ACTIONS:
1. Update database expertise - remove reference to src/old/database.ts
2. Review stale learnings in database domain
```

WORKFLOW

1. Parse DOMAIN input (or default to all)
2. For each domain:
   - Read expertise.yaml
   - Run all validation checks
   - Collect results
3. Generate summary report
4. Suggest remediation actions

INTEGRATION

- Run automatically on session start (optional hook)
- Run before major releases
- Run after large refactors

RULES
- Non-destructive (read-only validation)
- Report issues but don't auto-fix
- Prioritize drift detection (most critical)
- Keep output concise and actionable
