#!/usr/bin/env node
/**
 * clear-active-command.js - Clears active_command on session start
 *
 * This script runs on SessionStart to reset the active_command field
 * in session-state.json. This ensures that if a user starts a new chat
 * without running a command like /babysit, they won't get stale command
 * rules in their PreCompact output.
 *
 * Usage: Called automatically by SessionStart hook
 */

const fs = require('fs');
const path = require('path');

function clearActiveCommand() {
  const sessionStatePath = path.join(process.cwd(), 'docs/09-agents/session-state.json');

  // Skip if session-state.json doesn't exist
  if (!fs.existsSync(sessionStatePath)) {
    return;
  }

  try {
    const sessionState = JSON.parse(fs.readFileSync(sessionStatePath, 'utf8'));

    // Only update if active_command was set
    if (sessionState.active_command && sessionState.active_command !== null) {
      sessionState.active_command = null;
      fs.writeFileSync(sessionStatePath, JSON.stringify(sessionState, null, 2) + '\n', 'utf8');
      console.log('Cleared active_command from previous session');
    }
  } catch (err) {
    // Silently ignore errors - don't break session start
  }
}

if (require.main === module) {
  clearActiveCommand();
}

module.exports = { clearActiveCommand };
