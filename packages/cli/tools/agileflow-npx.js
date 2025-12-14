#!/usr/bin/env node

/**
 * AgileFlow CLI - NPX Entry Point
 *
 * This file ensures proper execution when run via npx from npm registry.
 * It preserves the user's working directory when spawning the CLI.
 */

const { spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

// Check if we're running in an npx temporary directory
const isNpxExecution = __dirname.includes('_npx') || __dirname.includes('.npm');

if (isNpxExecution) {
  // Running via npx - spawn child process to preserve user's working directory
  const args = process.argv.slice(2);
  const cliPath = path.join(__dirname, 'cli', 'agileflow-cli.js');

  if (!fs.existsSync(cliPath)) {
    console.error('Error: Could not find agileflow-cli.js at', cliPath);
    console.error('Current directory:', __dirname);
    process.exit(1);
  }

  // Execute CLI from user's working directory (process.cwd()), not npm cache
  const result = spawnSync(process.execPath, [cliPath, ...args], {
    stdio: 'inherit',
    cwd: process.cwd(),
  });

  if (result.error) {
    console.error('Error: Failed to run AgileFlow CLI:', result.error.message);
    process.exit(1);
  }

  if (result.signal) {
    try {
      process.kill(process.pid, result.signal);
    } catch {
      process.exit(1);
    }
    process.exit(1);
  }

  process.exit(result.status ?? 0);
} else {
  // Local execution - use require
  require('./cli/agileflow-cli.js');
}
