#!/usr/bin/env node

/**
 * Content Generation Orchestrator
 *
 * Runs all content generators to update AgileFlow plugin files.
 * Single source of truth: frontmatter and directory structure.
 */

const path = require('path');
const { execSync } = require('child_process');

/**
 * Run a generator script
 * @param {string} scriptName - Name of the generator script
 * @returns {boolean} Success status
 */
function runGenerator(scriptName) {
  const scriptPath = path.join(__dirname, scriptName);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Running: ${scriptName}`);
  console.log('='.repeat(60));

  try {
    execSync(`node "${scriptPath}"`, {
      cwd: __dirname,
      stdio: 'inherit'
    });
    console.log(`✅ ${scriptName} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ ${scriptName} failed:`, error.message);
    return false;
  }
}

/**
 * Main orchestrator
 */
function main() {
  console.log('🚀 AgileFlow Content Generation System');
  console.log('Generating content from metadata...\n');

  const generators = [
    'inject-help.js',
    'inject-babysit.js',
    'inject-readme.js'
  ];

  const results = [];

  for (const generator of generators) {
    const success = runGenerator(generator);
    results.push({ generator, success });
  }

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('GENERATION SUMMARY');
  console.log('='.repeat(60));

  let allSuccess = true;
  for (const { generator, success } of results) {
    const status = success ? '✅' : '❌';
    console.log(`${status} ${generator}`);
    if (!success) allSuccess = false;
  }

  console.log('');

  if (allSuccess) {
    console.log('🎉 All generators completed successfully!');
    console.log('📝 Generated content is ready for commit.');
    process.exit(0);
  } else {
    console.log('⚠️  Some generators failed. Please check errors above.');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { runGenerator };
