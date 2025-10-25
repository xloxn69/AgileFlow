# /AgileFlow:release VERSION=X.Y.Z

Automated release workflow for AgileFlow plugin versions. Ensures all version files stay in sync and validates integrity before release.

---

## OBJECTIVE

Streamline the release process by automating version updates, validation, and git operations. Prevents common mistakes like:
- Version mismatches across files
- Forgetting to update CHANGELOG.md
- Broken command references after consolidations
- Missing git push (marketplace reads from GitHub!)

---

## PARAMETERS

**VERSION** (required):
- Semantic version number: MAJOR.MINOR.PATCH
- Examples: `2.13.0`, `3.0.0`, `2.12.1`
- Format: Must match `\d+\.\d+\.\d+`

**Examples**:
```bash
/AgileFlow:release VERSION=2.13.0
/AgileFlow:release VERSION=3.0.0
```

---

## RELEASE WORKFLOW

### Step 1: Pre-Release Validation (CRITICAL)

**Run /validate-commands first**:
```bash
# Use SlashCommand tool to invoke validation
SlashCommand("/AgileFlow:validate-commands")
```

**If validation fails**:
```
❌ Cannot proceed with release - validation errors found:
   - 2 broken command references in /babysit
   - Version mismatch in marketplace.json

ACTION: Fix validation errors before releasing. Run /validate-commands to see details.
```

**If validation passes**:
```
✅ Validation passed - proceeding with release
```

### Step 2: Extract Current Version

**Read current versions**:
```bash
# From .claude-plugin/plugin.json
current_version=$(jq -r '.version' .claude-plugin/plugin.json)

# Show user what's changing
echo "Current version: $current_version"
echo "New version: $VERSION"
```

### Step 3: Update Version Files

**Update all 3 critical files**:

**A. Update plugin.json**:
```json
{
  "name": "AgileFlow",
  "version": "X.Y.Z",  // ← UPDATE THIS
  ...
}
```

**B. Update marketplace.json**:
```json
{
  "description": "Universal agile/docs-as-code system with 37 commands and 8 specialized subagents (vX.Y.Z - ...)",
  // ← UPDATE VERSION IN DESCRIPTION
  ...
}
```

**C. Prompt user for CHANGELOG.md entry**:
```markdown
# Show template:

## [X.Y.Z] - YYYY-MM-DD

### Added
-

### Changed
-

### Fixed
-

### Improved
-

---
USER: Please describe the changes for this release.
You can categorize them as: Added, Changed, Fixed, Improved, Technical

Example:
"Added /validate-commands for automated integrity checking
Added /release command for streamlined version management
Improved /babysit with error handling and recovery patterns"
```

**After user provides description**:
1. Parse their input into categories (Added/Changed/Fixed/Improved)
2. Generate CHANGELOG.md section with proper formatting
3. Insert at top of CHANGELOG.md (after header, before previous versions)

### Step 4: Show Changes Preview

**Run git diff**:
```bash
git diff .claude-plugin/plugin.json .claude-plugin/marketplace.json CHANGELOG.md
```

**Show summary**:
```
📝 Files to be updated:
  - .claude-plugin/plugin.json (version: 2.12.0 → 2.13.0)
  - .claude-plugin/marketplace.json (description updated with v2.13.0)
  - CHANGELOG.md (added [2.13.0] section with 3 changes)

Changes preview:
[show git diff output]
```

### Step 5: Commit Prompt

**Ask user for confirmation**:
```
Ready to commit these changes?
  yes - Create conventional commit and push to GitHub
  no  - Abort (changes staged but not committed)
```

**If yes**:
```bash
# Generate conventional commit message
commit_type="feat"  # Use "feat" for minor/major, "fix" for patch
commit_message="feat: v${VERSION} - [brief summary from CHANGELOG]

[Full description from CHANGELOG categories]

Files updated:
- plugin.json: version ${old_version} → ${new_version}
- marketplace.json: description updated
- CHANGELOG.md: added [${new_version}] section

Co-Authored-By: Claude <noreply@anthropic.com>"

# Commit
git add .claude-plugin/plugin.json .claude-plugin/marketplace.json CHANGELOG.md
git commit -m "$commit_message"
```

### Step 6: Push Reminder (CRITICAL)

**After commit succeeds**:
```
✅ Committed: v2.13.0

⚠️  CRITICAL: Push to GitHub immediately!
   The plugin marketplace reads from GitHub, not local files.
   Without pushing, users won't see the new version.

Run: git push origin main

Push now? (yes/no)
```

**If user says yes**:
```bash
git push origin main
```

**Show confirmation**:
```
✅ Release v2.13.0 complete!
   - Committed locally ✅
   - Pushed to GitHub ✅
   - Marketplace will update within minutes

Next steps:
  - Test the plugin in a fresh project
  - Monitor for any issues
  - Share release notes with users
```

---

## VALIDATION CHECKS

**Before proceeding with release**:
- ✅ VERSION parameter matches semantic versioning format
- ✅ /validate-commands passes (no broken references)
- ✅ Working directory is clean (no uncommitted changes from other work)
- ✅ Current branch is 'main' (or default branch)
- ✅ Git remote is configured and accessible

**If any check fails**:
```
❌ Pre-release checks failed:
   - Working directory has uncommitted changes
   - Please commit or stash other work before releasing

   or

❌ Pre-release checks failed:
   - Not on main branch (currently on: feature/xyz)
   - Switch to main branch before releasing
```

---

## ERROR HANDLING

### Common Issues

**Issue: Validation fails**
```
❌ Cannot release - broken command references found
ACTION: Fix errors first, then re-run /release
Run /validate-commands to see details
```

**Issue: Uncommitted changes**
```
❌ Working directory not clean
You have uncommitted changes from other work. Please:
  1. Commit or stash current work
  2. Switch to clean main branch
  3. Re-run /release VERSION=X.Y.Z
```

**Issue: Git push fails**
```
❌ Git push failed - check network/authentication
The version files are committed locally but NOT pushed to GitHub.
You MUST push manually: git push origin main
```

**Issue: Invalid version format**
```
❌ Invalid VERSION parameter: "2.13"
VERSION must be semantic versioning format: MAJOR.MINOR.PATCH
Examples: 2.13.0, 3.0.0, 2.12.1
```

---

## SEMANTIC VERSIONING GUIDE

**When to bump which number**:

**MAJOR (X.0.0)** - Breaking changes:
- Removed commands (unless consolidated)
- Changed command parameter formats incompatibly
- Major restructuring of docs/ directory
- Example: 2.12.0 → 3.0.0

**MINOR (0.X.0)** - New features, backwards compatible:
- Added new commands
- Added new subagents
- New features in existing commands
- Command consolidations (like v2.12.0)
- Example: 2.12.0 → 2.13.0

**PATCH (0.0.X)** - Bug fixes only:
- Fixed broken command references
- Fixed typos in documentation
- Fixed bugs in command logic
- Security patches
- Example: 2.12.0 → 2.12.1

---

## CONVENTIONAL COMMIT FORMAT

**Commit message structure**:
```
<type>: v<version> - <brief summary>

<detailed description with categories>

Files updated:
- plugin.json: version <old> → <new>
- marketplace.json: description updated
- CHANGELOG.md: added [<version>] section

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types**:
- `feat`: Minor or major version bumps (new features)
- `fix`: Patch version bumps (bug fixes)

---

## EXAMPLE SESSION

```
User: /AgileFlow:release VERSION=2.13.0