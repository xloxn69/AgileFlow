#!/bin/bash

# AgileFlow Plugin Validation Script
# Ensures consistency across commands, agents, skills, versions, and documentation
# Run this before committing version bumps or releases

set -e

REPO_ROOT="/home/coder/AgileFlow"
EXIT_CODE=0

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║           AgileFlow Plugin Validation                          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# ============================================================================
# 1. COMMAND FILES AUDIT
# ============================================================================
echo "┌────────────────────────────────────────────────────────────────┐"
echo "│ 1. Command Files Structure                                     │"
echo "└────────────────────────────────────────────────────────────────┘"

total_commands=$(ls -1 "$REPO_ROOT/commands"/*.md 2>/dev/null | wc -l)
echo "   Total command files: $total_commands"

missing_description=0
for file in "$REPO_ROOT/commands"/*.md; do
    filename=$(basename "$file")

    # Check frontmatter
    if ! head -1 "$file" | grep -q "^---$"; then
        echo "   ❌ $filename: Missing frontmatter"
        ((EXIT_CODE++))
        continue
    fi

    # Check description
    if ! grep -q "^description:" "$file"; then
        echo "   ❌ $filename: Missing description field"
        ((EXIT_CODE++))
        ((missing_description++))
    else
        desc=$(grep "^description:" "$file" | cut -d: -f2- | sed 's/^ *//;s/ *$//')
        if [ -z "$desc" ] || [ "$desc" = "-" ]; then
            echo "   ⚠️  $filename: Empty description"
            ((EXIT_CODE++))
        fi
    fi
done

if [ $missing_description -eq 0 ]; then
    echo "   ✅ All commands have valid structure"
else
    echo "   ❌ Found $missing_description issues"
fi
echo ""

# ============================================================================
# 2. AGENT FILES AUDIT
# ============================================================================
echo "┌────────────────────────────────────────────────────────────────┐"
echo "│ 2. Agent Files Structure                                       │"
echo "└────────────────────────────────────────────────────────────────┘"

total_agents=$(ls -1 "$REPO_ROOT/agents"/*.md 2>/dev/null | wc -l)
echo "   Total agent files: $total_agents"

agent_issues=0
for file in "$REPO_ROOT/agents"/*.md; do
    filename=$(basename "$file" .md)

    # Check frontmatter
    if ! head -1 "$file" | grep -q "^---$"; then
        echo "   ❌ $filename: Missing frontmatter"
        ((EXIT_CODE++))
        ((agent_issues++))
        continue
    fi

    frontmatter=$(sed -n '/^---$/,/^---$/p' "$file" | sed '1d;$d')

    # Check required fields
    for field in name description tools model; do
        if ! echo "$frontmatter" | grep -q "^$field:"; then
            echo "   ❌ $filename: Missing '$field' field"
            ((EXIT_CODE++))
            ((agent_issues++))
        fi
    done

    # Check name matches filename
    agent_name=$(echo "$frontmatter" | grep "^name:" | cut -d: -f2- | sed 's/^ *//;s/ *$//')
    if [ "$agent_name" != "$filename" ]; then
        echo "   ⚠️  $filename: Name mismatch (frontmatter says '$agent_name')"
        ((EXIT_CODE++))
        ((agent_issues++))
    fi

    # Check model is valid
    model=$(echo "$frontmatter" | grep "^model:" | cut -d: -f2- | sed 's/^ *//;s/ *$//')
    if [ "$model" != "haiku" ] && [ "$model" != "sonnet" ]; then
        echo "   ⚠️  $filename: Invalid model '$model' (should be 'haiku' or 'sonnet')"
        ((EXIT_CODE++))
        ((agent_issues++))
    fi
done

if [ $agent_issues -eq 0 ]; then
    echo "   ✅ All agents have valid structure"
else
    echo "   ❌ Found $agent_issues issues"
fi
echo ""

# ============================================================================
# 3. SKILL FILES AUDIT
# ============================================================================
echo "┌────────────────────────────────────────────────────────────────┐"
echo "│ 3. Skill Files Structure (v2.21.0+ format)                    │"
echo "└────────────────────────────────────────────────────────────────┘"

total_skills=$(find "$REPO_ROOT/skills" -name "SKILL.md" 2>/dev/null | wc -l)
echo "   Total skill files: $total_skills"

skill_issues=0
for file in "$REPO_ROOT/skills"/*/SKILL.md; do
    if [ ! -f "$file" ]; then
        continue
    fi

    dirname=$(basename "$(dirname "$file")")

    # Check frontmatter
    if ! head -1 "$file" | grep -q "^---$"; then
        echo "   ❌ $dirname: Missing frontmatter"
        ((EXIT_CODE++))
        ((skill_issues++))
        continue
    fi

    frontmatter=$(sed -n '/^---$/,/^---$/p' "$file" | sed '1d;$d')

    # Check required fields (v2.21.0+: only name and description)
    for field in name description; do
        if ! echo "$frontmatter" | grep -q "^$field:"; then
            echo "   ❌ $dirname: Missing '$field' field"
            ((EXIT_CODE++))
            ((skill_issues++))
        fi
    done

    # Check for deprecated fields
    if echo "$frontmatter" | grep -q "^allowed-tools:"; then
        echo "   ⚠️  $dirname: Contains deprecated 'allowed-tools' field (removed in v2.21.0)"
        ((EXIT_CODE++))
        ((skill_issues++))
    fi

    # Check name matches directory
    skill_name=$(echo "$frontmatter" | grep "^name:" | cut -d: -f2- | sed 's/^ *//;s/ *$//')
    if [ "$skill_name" != "$dirname" ]; then
        echo "   ⚠️  $dirname: Name mismatch (frontmatter says '$skill_name')"
        ((EXIT_CODE++))
        ((skill_issues++))
    fi
done

if [ $skill_issues -eq 0 ]; then
    echo "   ✅ All skills have valid structure"
else
    echo "   ❌ Found $skill_issues issues"
fi
echo ""

# ============================================================================
# 4. VERSION CONSISTENCY
# ============================================================================
echo "┌────────────────────────────────────────────────────────────────┐"
echo "│ 4. Version Consistency                                         │"
echo "└────────────────────────────────────────────────────────────────┘"

plugin_version=$(jq -r '.version' "$REPO_ROOT/.claude-plugin/plugin.json")
marketplace_desc=$(jq -r '.description' "$REPO_ROOT/.claude-plugin/marketplace.json")
changelog_version=$(grep -m1 "^## \[" "$REPO_ROOT/CHANGELOG.md" | sed 's/## \[\(.*\)\].*/\1/')
readme_badge=$(grep -m1 "badge/version-" "$REPO_ROOT/README.md" | sed 's/.*badge\/version-\([0-9.]*\)-.*/\1/')
claude_version=$(grep "Current Version" "$REPO_ROOT/CLAUDE.md" | grep -oP 'v\K[0-9.]+' || echo "")

echo "   plugin.json:        $plugin_version"
echo "   marketplace.json:   $(echo $marketplace_desc | grep -oP 'v\K[0-9.]+')"
echo "   CHANGELOG.md:       $changelog_version"
echo "   README.md badge:    $readme_badge"
echo "   CLAUDE.md:          $claude_version"
echo ""

version_issues=0

# Check marketplace description contains version
if ! echo "$marketplace_desc" | grep -q "$plugin_version"; then
    echo "   ❌ marketplace.json description missing version $plugin_version"
    ((EXIT_CODE++))
    ((version_issues++))
fi

# Check CHANGELOG version
if [ "$changelog_version" != "$plugin_version" ]; then
    echo "   ❌ CHANGELOG.md version ($changelog_version) != plugin.json ($plugin_version)"
    ((EXIT_CODE++))
    ((version_issues++))
fi

# Check README badge
if [ "$readme_badge" != "$plugin_version" ]; then
    echo "   ❌ README.md badge ($readme_badge) != plugin.json ($plugin_version)"
    ((EXIT_CODE++))
    ((version_issues++))
fi

# Check CLAUDE.md version
if [ "$claude_version" != "$plugin_version" ]; then
    echo "   ❌ CLAUDE.md version ($claude_version) != plugin.json ($plugin_version)"
    ((EXIT_CODE++))
    ((version_issues++))
fi

if [ $version_issues -eq 0 ]; then
    echo "   ✅ All versions consistent"
fi
echo ""

# ============================================================================
# 5. DOCUMENTATION COUNTS
# ============================================================================
echo "┌────────────────────────────────────────────────────────────────┐"
echo "│ 5. Documentation Count Consistency                             │"
echo "└────────────────────────────────────────────────────────────────┘"

actual_commands=$(ls -1 "$REPO_ROOT/commands"/*.md 2>/dev/null | wc -l)
actual_agents=$(ls -1 "$REPO_ROOT/agents"/*.md 2>/dev/null | wc -l)
actual_skills=$(find "$REPO_ROOT/skills" -name "SKILL.md" 2>/dev/null | wc -l)

readme_commands=$(grep -m1 "badge/commands-" "$REPO_ROOT/README.md" | sed 's/.*badge\/commands-\([0-9]*\)-.*/\1/')
readme_agents=$(grep -m1 "badge/subagents-" "$REPO_ROOT/README.md" | sed 's/.*badge\/subagents-\([0-9]*\)-.*/\1/')
readme_skills=$(grep -m1 "badge/skills-" "$REPO_ROOT/README.md" | sed 's/.*badge\/skills-\([0-9]*\)-.*/\1/')

claude_commands=$(grep "Current Version" "$REPO_ROOT/CLAUDE.md" | grep -oP '\d+ commands' | grep -oP '\d+')
claude_agents=$(grep "Current Version" "$REPO_ROOT/CLAUDE.md" | grep -oP '\d+ specialized agents' | grep -oP '\d+')
claude_skills=$(grep "Current Version" "$REPO_ROOT/CLAUDE.md" | grep -oP '\d+ refactored skills' | grep -oP '\d+')

echo "   Actual:  $actual_commands commands, $actual_agents agents, $actual_skills skills"
echo "   README:  $readme_commands commands, $readme_agents agents, $readme_skills skills"
echo "   CLAUDE:  $claude_commands commands, $claude_agents agents, $claude_skills skills"
echo ""

count_issues=0

if [ "$actual_commands" -ne "$readme_commands" ]; then
    echo "   ❌ Command count mismatch: $actual_commands actual vs $readme_commands in README"
    ((EXIT_CODE++))
    ((count_issues++))
fi

if [ "$actual_agents" -ne "$readme_agents" ]; then
    echo "   ❌ Agent count mismatch: $actual_agents actual vs $readme_agents in README"
    ((EXIT_CODE++))
    ((count_issues++))
fi

if [ "$actual_skills" -ne "$readme_skills" ]; then
    echo "   ❌ Skill count mismatch: $actual_skills actual vs $readme_skills in README"
    ((EXIT_CODE++))
    ((count_issues++))
fi

if [ "$actual_commands" -ne "$claude_commands" ]; then
    echo "   ❌ Command count mismatch: $actual_commands actual vs $claude_commands in CLAUDE.md"
    ((EXIT_CODE++))
    ((count_issues++))
fi

if [ "$actual_agents" -ne "$claude_agents" ]; then
    echo "   ❌ Agent count mismatch: $actual_agents actual vs $claude_agents in CLAUDE.md"
    ((EXIT_CODE++))
    ((count_issues++))
fi

if [ "$actual_skills" -ne "$claude_skills" ]; then
    echo "   ❌ Skill count mismatch: $actual_skills actual vs $claude_skills in CLAUDE.md"
    ((EXIT_CODE++))
    ((count_issues++))
fi

if [ $count_issues -eq 0 ]; then
    echo "   ✅ All counts consistent"
fi
echo ""

# ============================================================================
# FINAL REPORT
# ============================================================================
echo "╔════════════════════════════════════════════════════════════════╗"

if [ $EXIT_CODE -eq 0 ]; then
    echo "║ ✅ VALIDATION PASSED - No issues found                        ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    exit 0
else
    echo "║ ❌ VALIDATION FAILED - Found $EXIT_CODE issue(s)                      ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Please fix the issues above before committing or releasing."
    exit 1
fi
