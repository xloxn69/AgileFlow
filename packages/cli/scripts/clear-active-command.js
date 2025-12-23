#!/usr/bin/env node
/**
 * clear-active-command.js - Clears active_commands on session start
 *
 * This script runs on SessionStart to reset the active_commands array
 * in session-state.json. This ensures that if a user starts a new chat
 * without running a command like /babysit, they won't get stale command
 * rules in their PreCompact output.
 *
 * Usage: Called automatically by SessionStart hook
 */

const fs = require('fs');
const path = require('path');

function clearActiveCommands() {
  const sessionStatePath = path.join(process.cwd(), 'docs/09-agents/session-state.json');

  // Skip if session-state.json doesn't exist
  if (!fs.existsSync(sessionStatePath)) {
    return;
  }

  try {
    const sessionState = JSON.parse(fs.readFileSync(sessionStatePath, 'utf8'));

    // Only update if active_commands has items
    if (sessionState.active_commands && sessionState.active_commands.length > 0) {
      sessionState.active_commands = [];
      fs.writeFileSync(sessionStatePath, JSON.stringify(sessionState, null, 2) + '\n', 'utf8');
      console.log('Cleared active_commands from previous session');
    }

    // Migration: also clear old active_command field if present
    if (sessionState.active_command !== undefined) {
      delete sessionState.active_command;
      fs.writeFileSync(sessionStatePath, JSON.stringify(sessionState, null, 2) + '\n', 'utf8');
    }
  } catch (err) {
    // Silently ignore errors - don't break session start
  }
}

if (require.main === module) {
  clearActiveCommands();
}

module.exports = { clearActiveCommands };
