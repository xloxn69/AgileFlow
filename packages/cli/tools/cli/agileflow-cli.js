#!/usr/bin/env node

/**
 * AgileFlow CLI - Command Router
 *
 * Routes commands to their respective handlers using Commander.js
 */

const { program } = require('commander');
const path = require('node:path');
const fs = require('node:fs');

// Load package.json for version info
const packageJsonPath = path.join(__dirname, '..', '..', 'package.json');
const packageJson = require(packageJsonPath);

// Dynamically load all command modules
const commandsPath = path.join(__dirname, 'commands');
const commands = {};

if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    try {
      const command = require(path.join(commandsPath, file));
      if (command.name) {
        commands[command.name] = command;
      }
    } catch (error) {
      console.error(`Warning: Failed to load command ${file}:`, error.message);
    }
  }
}

// Set up main program
program
  .name('agileflow')
  .version(packageJson.version)
  .description(
    'AgileFlow - AI-driven agile development for Claude Code, Cursor, Windsurf, and more'
  );

// Register all commands
for (const [name, cmd] of Object.entries(commands)) {
  const command = program.command(name).description(cmd.description);

  // Add options if defined
  if (cmd.options) {
    for (const option of cmd.options) {
      command.option(...option);
    }
  }

  // Add arguments if defined
  if (cmd.arguments) {
    for (const arg of cmd.arguments) {
      command.argument(...arg);
    }
  }

  // Set action
  command.action(cmd.action);
}

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (process.argv.slice(2).length === 0) {
  program.outputHelp();
}
