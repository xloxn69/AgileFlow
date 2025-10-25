# /AgileFlow:validate-commands

Validates the integrity of the AgileFlow plugin by checking command references, file existence, version sync, and cross-references.

---

## OBJECTIVE

Automated validation to catch broken references, missing files, and version mismatches across the AgileFlow plugin structure. This prevents issues like broken command references in documentation after consolidations.

---

## VALIDATION CHECKS

### 1. Command Registry Validation

**Check plugin.json command registry**:
```bash
# For each command in .claude-plugin/plugin.json "commands" array:
# - Verify the .md file exists
# - Report any missing files
```

**Output format**:
```
✅ All 36 registered commands exist
   or
❌ MISSING: ./commands/foo.md (registered in plugin.json but file not found)
```

### 2. Subagent Registry Validation

**Check plugin.json agents registry**:
```bash
# For each agent in .claude-plugin/plugin.json "agents" array:
# - Verify the .md file exists
# - Report any missing files
```

**Output format**:
```
✅ All 8 registered subagents exist
   or
❌ MISSING: ./agents/agileflow-foo.md (registered in plugin.json but file not found)
```

### 3. Command Reference Validation

**Find all command references across plugin files**:
```bash
# Grep all .md files in commands/ and agents/ for patterns:
# - /AgileFlow:command-name
# - /command-name (legacy)
# - SlashCommand("/AgileFlow:command-name")
#
# For each reference:
# - Extract command name
# - Check if corresponding .md file exists in commands/
# - Report broken references
```

**Output format**:
```
Checking command references in 44 files (36 commands + 8 agents)...

✅ commands/babysit.md - All 15 command references valid
❌ commands/babysit.md:89 - References /chatgpt-research (file does not exist)
❌ agents/agileflow-mentor.md:45 - References /status (should be /story-status)

Summary:
  - 156 total command references found
  - 154 valid references ✅
  - 2 broken references ❌
```

### 4. Version Sync Validation

**Check version consistency across critical files**:
```bash
# Extract versions from:
# 1. .claude-plugin/plugin.json → "version" field
# 2. .claude-plugin/marketplace.json → "description" field (look for "v2.X.X")
# 3. CHANGELOG.md → First [X.Y.Z] header
#
# Compare all three:
# - If all match → ✅
# - If any mismatch → ❌ with details
```

**Output format**:
```
✅ Version sync OK: v2.13.0
   - plugin.json: 2.13.0
   - marketplace.json: v2.13.0
   - CHANGELOG.md: [2.13.0]

   or

❌ VERSION MISMATCH:
   - plugin.json: 2.13.0
   - marketplace.json: v2.12.0 ⚠️
   - CHANGELOG.md: [2.13.0]

   ACTION: Update marketplace.json description to mention v2.13.0
```

### 5. Template Path Validation

**Check template references in commands**:
```bash
# Grep for template paths in commands/*.md files:
# - templates/epic.md
# - templates/user-story.md
# - templates/adr.md
# - templates/custom-*.md
#
# Verify each referenced template file exists
```

**Output format**:
```
✅ All template references valid (4 templates found)
   or
❌ commands/epic-new.md references templates/epic.md (file not found)
```

### 6. MCP Configuration Validation (Optional)

**If .mcp.json exists in current project** (NOT in AgileFlow repo):
```bash
# Check for common issues:
# - Token placeholder text ("YOUR_TOKEN_HERE", "ghp_YOUR", "ntn_YOUR")
# - Invalid token formats (GitHub tokens should start with ghp_, be 40+ chars)
# - Using ${VAR} syntax but .env file missing
```

**Output format**:
```
⚠️  MCP Configuration Issues:
   - .mcp.json line 8: GitHub token appears to be placeholder text
   - .mcp.json line 15: Using ${NOTION_TOKEN} but .env file not found

   or

✅ MCP configuration looks valid (2 servers configured)
```

---

## EXECUTION FLOW

1. **Read plugin.json** to get registered commands and agents
2. **Check file existence** for all registered files
3. **Grep all .md files** in commands/ and agents/ for command references
4. **Parse and validate** each command reference
5. **Extract versions** from plugin.json, marketplace.json, CHANGELOG.md
6. **Compare versions** and report mismatches
7. **Check template references** in command files
8. **Optional: Check .mcp.json** if it exists in current project
9. **Generate summary report** with counts and action items

---

## OUTPUT FORMAT

```
🔍 AgileFlow Plugin Validation Report
═══════════════════════════════════════

📋 Command Registry
  ✅ All 36 registered commands exist

📋 Subagent Registry
  ✅ All 8 registered subagents exist

🔗 Command References (44 files scanned)
  ✅ 156 command references found
  ✅ 154 valid references
  ❌ 2 broken references:
     - commands/babysit.md:89 → /chatgpt-research (does not exist)
     - agents/agileflow-mentor.md:45 → /status (should be /story-status)

📦 Version Sync
  ✅ All versions match: v2.13.0

📄 Template References
  ✅ All 4 template references valid

═══════════════════════════════════════
Summary: 2 issues found ❌

ACTION ITEMS:
1. Fix commands/babysit.md:89 - Update /chatgpt-research to /chatgpt MODE=research
2. Fix agents/agileflow-mentor.md:45 - Update /status to /story-status

Run this validation before every release to catch broken references.
```

---

## WHEN TO USE

**Run this command**:
- ✅ Before releasing new versions
- ✅ After consolidating/renaming commands
- ✅ After updating command structure
- ✅ When adding new commands or subagents
- ✅ When troubleshooting "command not found" issues
- ✅ As part of CI/CD validation (if applicable)

**This catches**:
- Broken command references in documentation
- Missing command/agent files
- Version mismatches across files
- Broken template paths
- MCP configuration issues

---

## TECHNICAL NOTES

**Implementation approach**:
1. Use Read tool to parse plugin.json
2. Use Glob tool to list all .md files
3. Use Grep tool to find command references with patterns:
   - `/AgileFlow:[\w-]+`
   - `SlashCommand\("/AgileFlow:[\w-]+"\)`
4. Use Bash tool for version extraction from JSON/markdown
5. Cross-reference found commands against registered commands

**Regex patterns**:
- Command reference: `/AgileFlow:([\w-]+)`
- Version in JSON: `"version":\s*"([\d.]+)"`
- Version in CHANGELOG: `##\s*\[([\d.]+)\]`
- Version in marketplace: `v([\d.]+)`

**Performance**: Should complete in <10 seconds for full validation

---

## EXAMPLE USAGE

```bash
# Run full validation
/AgileFlow:validate-commands

# Example output after command consolidation:
🔍 AgileFlow Plugin Validation Report
❌ 5 broken references found in /babysit after v2.12.0 consolidation
ACTION: Update command references to use new MODE/ACTION parameters
```

---

**This command ensures "everything is connected" by validating all connections automatically.**
