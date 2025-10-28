#!/usr/bin/env node

/**
 * get-env.js - Dynamic environment variable helper for AgileFlow hooks
 *
 * Usage: node scripts/get-env.js VARIABLE_NAME [default_value]
 *
 * Reads environment variables from:
 * 1. .claude/settings.json (base config)
 * 2. .claude/settings.local.json (overrides, gitignored)
 *
 * This allows hooks to use dynamic config without requiring Claude Code restart.
 *
 * Example in hooks.json:
 * "command": "echo Welcome $(node scripts/get-env.js USER_NAME 'Developer')"
 */

const fs = require('fs');
const path = require('path');

const varName = process.argv[2];
const defaultValue = process.argv[3] || '';

if (!varName) {
  console.error('Usage: node scripts/get-env.js VARIABLE_NAME [default_value]');
  process.exit(1);
}

const projectDir = process.cwd();
const claudePath = path.join(projectDir, '.claude');
let env = {};

// Read settings.json (base configuration)
try {
  const settingsPath = path.join(claudePath, 'settings.json');
  const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  if (settings.env) {
    env = { ...env, ...settings.env };
  }
} catch (e) {
  // settings.json doesn't exist or has no env section - this is okay
}

// Read settings.local.json (local overrides - gitignored)
try {
  const localSettingsPath = path.join(claudePath, 'settings.local.json');
  const localSettings = JSON.parse(fs.readFileSync(localSettingsPath, 'utf8'));
  if (localSettings.env) {
    env = { ...env, ...localSettings.env };
  }
} catch (e) {
  // settings.local.json doesn't exist - this is okay
}

const finalValue = env[varName] !== undefined ? env[varName] : defaultValue;
console.log(finalValue);
