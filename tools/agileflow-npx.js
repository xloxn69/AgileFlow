#!/usr/bin/env node

/**
 * AgileFlow CLI - NPX Entry Point
 *
 * This file ensures proper execution when run via npx from npm registry.
 * It preserves the user's working directory when spawning the CLI.
 */

const { execSync } = require('node:child_process');
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

  try {
    // Execute CLI from user's working directory (process.cwd()), not npm cache
    execSync(`node "${cliPath}" ${args.join(' ')}`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
  } catch (error) {
    process.exit(error.status || 1);
  }
} else {
  // Local execution - use require
  require('./cli/agileflow-cli.js');
}
