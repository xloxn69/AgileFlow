#!/usr/bin/env python3
"""
Add Session Harness Verification Protocol to dev agents.
Phase 3 of Session Harness System implementation (v2.26.0).
"""

import os
import re

VERIFICATION_PROTOCOL = """
SESSION HARNESS & VERIFICATION PROTOCOL (v2.25.0+)

**CRITICAL**: Session Harness System prevents agents from breaking functionality, claiming work is done when tests fail, or losing context between sessions.

**PRE-IMPLEMENTATION VERIFICATION**

Before starting work on ANY story:

1. **Check Session Harness**:
   - Look for `docs/00-meta/environment.json`
   - If exists → Session harness is active ✅
   - If missing → Suggest `/AgileFlow:session-init` to user

2. **Test Baseline Check**:
   - Read `test_status` from story in `docs/09-agents/status.json`
   - If `"passing"` → Proceed with implementation ✅
   - If `"failing"` → STOP. Cannot start new work with failing baseline ⚠️
   - If `"not_run"` → Run `/AgileFlow:verify` first to establish baseline
   - If `"skipped"` → Check why tests are skipped, document override decision

3. **Environment Verification** (if session harness active):
   - Run `/AgileFlow:resume` to verify environment and load context
   - Check for regressions (tests were passing, now failing)
   - If regression detected → Fix before proceeding with new story

**DURING IMPLEMENTATION**

1. **Incremental Testing**:
   - Run tests frequently during development (not just at end)
   - Fix test failures immediately (don't accumulate debt)
   - Use `/AgileFlow:verify US-XXXX` to check specific story tests

2. **Real-time Status Updates**:
   - Update `test_status` in status.json as tests are written/fixed
   - Append bus messages when tests pass milestone checkpoints

**POST-IMPLEMENTATION VERIFICATION**

After completing ANY changes:

1. **Run Full Test Suite**:
   - Execute `/AgileFlow:verify US-XXXX` to run tests for the story
   - Check exit code (0 = success required for completion)
   - Review test output for warnings or flaky tests

2. **Update Test Status**:
   - `/AgileFlow:verify` automatically updates `test_status` in status.json
   - Verify the update was successful
   - Expected: `test_status: "passing"` with test results metadata

3. **Regression Check**:
   - Compare test results to baseline (initial test status)
   - If new failures introduced → Fix before marking complete
   - If test count decreased → Investigate deleted tests

4. **Story Completion Requirements**:
   - Story can ONLY be marked `"in-review"` if `test_status: "passing"` ✅
   - If tests failing → Story remains `"in-progress"` until fixed ⚠️
   - No exceptions unless documented override (see below)

**OVERRIDE PROTOCOL** (Use with extreme caution)

If tests are failing but you need to proceed:

1. **Document Override Decision**:
   - Append bus message with full explanation (include agent ID, story ID, reason, tracking issue)

2. **Update Story Dev Agent Record**:
   - Add note to "Issues Encountered" section explaining override
   - Link to tracking issue for the failing test
   - Document risk and mitigation plan

3. **Create Follow-up Story**:
   - If test failure is real but out of scope → Create new story
   - Link dependency in status.json
   - Notify user of the override and follow-up story

**BASELINE MANAGEMENT**

After completing major milestones (epic complete, sprint end):

1. **Establish Baseline**:
   - Suggest `/AgileFlow:baseline "Epic EP-XXXX complete"` to user
   - Requires: All tests passing, git working tree clean
   - Creates git tag + metadata for reset point

2. **Baseline Benefits**:
   - Known-good state to reset to if needed
   - Regression detection reference point
   - Deployment readiness checkpoint
   - Sprint/epic completion marker

**INTEGRATION WITH WORKFLOW**

The verification protocol integrates into the standard workflow:

1. **Before creating feature branch**: Run pre-implementation verification
2. **Before marking in-review**: Run post-implementation verification
3. **After merge**: Verify baseline is still passing

**ERROR HANDLING**

If `/AgileFlow:verify` fails:
- Read error output carefully
- Check if test command is configured in `docs/00-meta/environment.json`
- Verify test dependencies are installed
- If project has no tests → Suggest `/AgileFlow:session-init` to set up testing
- If tests are misconfigured → Coordinate with AG-CI

**SESSION RESUME PROTOCOL**

When resuming work after context loss:

1. **Run Resume Command**: `/AgileFlow:resume` loads context automatically
2. **Check Session State**: Review `docs/09-agents/session-state.json`
3. **Verify Test Status**: Ensure no regressions occurred
4. **Load Previous Insights**: Check Dev Agent Record from previous stories

**KEY PRINCIPLES**

- **Tests are the contract**: Passing tests = feature works as specified
- **Fail fast**: Catch regressions immediately, not at PR review
- **Context preservation**: Session harness maintains progress across context windows
- **Transparency**: Document all override decisions fully
- **Accountability**: test_status field creates audit trail
"""

# Dev agents that write code and need verification protocol
DEV_AGENTS = [
    "agileflow-ci.md",
    "agileflow-devops.md",
    "agileflow-security.md",
    "agileflow-database.md",
    "agileflow-testing.md",
    "agileflow-performance.md",
    "agileflow-mobile.md",
    "agileflow-integrations.md",
    "agileflow-refactor.md",
    "agileflow-design.md",
    "agileflow-accessibility.md",
    "agileflow-analytics.md",
    "agileflow-datamigration.md",
    "agileflow-monitoring.md",
    "agileflow-compliance.md",
    "agileflow-qa.md",
]

def add_verification_protocol(filepath):
    """Add verification protocol after BOUNDARIES section."""
    with open(filepath, 'r') as f:
        content = f.read()

    # Check if already has verification protocol
    if "SESSION HARNESS & VERIFICATION PROTOCOL" in content:
        print(f"  ⏭️  Skipping {os.path.basename(filepath)} - already has protocol")
        return False

    # Find BOUNDARIES section and the section after it
    # Pattern: BOUNDARIES section ends with list of "- Do NOT..." items
    # Next section starts with an all-caps word (e.g., CLAUDE.MD, SLASH, WORKFLOW)

    # Match the BOUNDARIES section and capture everything after it
    pattern = r'(BOUNDARIES\n(?:- [^\n]+\n)+)\n([A-Z])'

    match = re.search(pattern, content)
    if not match:
        print(f"  ❌ Could not find BOUNDARIES section in {os.path.basename(filepath)}")
        return False

    # Insert verification protocol between BOUNDARIES and next section
    new_content = content[:match.end(1)] + '\n' + VERIFICATION_PROTOCOL + '\n' + content[match.start(2):]

    # Write back
    with open(filepath, 'w') as f:
        f.write(new_content)

    print(f"  ✅ Added verification protocol to {os.path.basename(filepath)}")
    return True

def main():
    agents_dir = "/home/coder/AgileFlow/agents"
    updated_count = 0
    skipped_count = 0

    print("Adding Session Harness Verification Protocol to dev agents...")
    print()

    for agent_file in DEV_AGENTS:
        filepath = os.path.join(agents_dir, agent_file)
        if os.path.exists(filepath):
            if add_verification_protocol(filepath):
                updated_count += 1
            else:
                skipped_count += 1
        else:
            print(f"  ⚠️  File not found: {agent_file}")

    print()
    print(f"Summary: {updated_count} agents updated, {skipped_count} agents skipped")

if __name__ == "__main__":
    main()
