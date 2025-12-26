#!/usr/bin/env node
/**
 * agileflow-configure.js - Comprehensive configuration management
 *
 * Features:
 *   - DETECT: Show current configuration status
 *   - MIGRATE: Fix old/invalid formats automatically
 *   - ENABLE: Turn on features
 *   - DISABLE: Turn off features
 *   - PROFILES: Quick presets (full, basic, minimal, none)
 *   - RECONFIGURE: Change settings (archival days, etc.)
 *
 * Usage:
 *   node scripts/agileflow-configure.js [options]
 *
 * Options:
 *   --profile=full|basic|minimal|none   Apply a preset
 *   --enable=<features>                 Enable specific features
 *   --disable=<features>                Disable specific features
 *   --archival-days=<N>                 Set archival threshold
 *   --migrate                           Fix old formats without changing features
 *   --validate                          Check for issues
 *   --detect                            Show current status
 *   --help                              Show help
 *
 * Features: sessionstart, precompact, stop, archival, statusline
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================================================
// CONFIGURATION
// ============================================================================

const VERSION = '2.41.0';

const FEATURES = {
  sessionstart: { hook: 'SessionStart', script: 'agileflow-welcome.js', type: 'node' },
  precompact: { hook: 'PreCompact', script: 'precompact-context.sh', type: 'bash' },
  stop: { hook: 'Stop', script: 'agileflow-stop.sh', type: 'bash' },
  archival: { script: 'archive-completed-stories.sh', requiresHook: 'sessionstart' },
  statusline: { script: 'agileflow-statusline.sh' },
};

// Statusline component names
const STATUSLINE_COMPONENTS = [
  'agileflow',
  'model',
  'story',
  'epic',
  'wip',
  'context',
  'cost',
  'git',
];

const PROFILES = {
  full: {
    description: 'All features enabled',
    enable: ['sessionstart', 'precompact', 'stop', 'archival', 'statusline'],
    archivalDays: 7,
  },
  basic: {
    description: 'Essential hooks + archival (SessionStart + PreCompact + Archival)',
    enable: ['sessionstart', 'precompact', 'archival'],
    disable: ['stop', 'statusline'],
    archivalDays: 7,
  },
  minimal: {
    description: 'SessionStart + archival only',
    enable: ['sessionstart', 'archival'],
    disable: ['precompact', 'stop', 'statusline'],
    archivalDays: 7,
  },
  none: {
    description: 'Disable all AgileFlow features',
    disable: ['sessionstart', 'precompact', 'stop', 'archival', 'statusline'],
  },
};

// ============================================================================
// COLORS & LOGGING
// ============================================================================

const c = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const log = (msg, color = '') => console.log(`${color}${msg}${c.reset}`);
const success = msg => log(`✅ ${msg}`, c.green);
const warn = msg => log(`⚠️  ${msg}`, c.yellow);
const error = msg => log(`❌ ${msg}`, c.red);
const info = msg => log(`ℹ️  ${msg}`, c.dim);
const header = msg => log(`\n${msg}`, c.bold + c.cyan);

// ============================================================================
// FILE UTILITIES
// ============================================================================

const ensureDir = dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const readJSON = filePath => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
};

const writeJSON = (filePath, data) => {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
};

const copyTemplate = (templateName, destPath) => {
  const sources = [
    path.join(process.cwd(), '.agileflow', 'templates', templateName),
    path.join(__dirname, templateName),
    path.join(__dirname, '..', 'templates', templateName),
  ];
  for (const src of sources) {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, destPath);
      try {
        fs.chmodSync(destPath, '755');
      } catch {}
      return true;
    }
  }
  return false;
};

// ============================================================================
// DETECTION & VALIDATION
// ============================================================================

function detectConfig() {
  const status = {
    git: { initialized: false, remote: null },
    settingsExists: false,
    settingsValid: true,
    settingsIssues: [],
    features: {
      sessionstart: { enabled: false, valid: true, issues: [] },
      precompact: { enabled: false, valid: true, issues: [] },
      stop: { enabled: false, valid: true, issues: [] },
      archival: { enabled: false, threshold: null },
      statusline: { enabled: false, valid: true, issues: [] },
    },
    metadata: { exists: false, version: null },
  };

  // Git
  if (fs.existsSync('.git')) {
    status.git.initialized = true;
    try {
      status.git.remote = execSync('git remote get-url origin 2>/dev/null', {
        encoding: 'utf8',
      }).trim();
    } catch {}
  }

  // Settings file
  if (fs.existsSync('.claude/settings.json')) {
    status.settingsExists = true;
    const settings = readJSON('.claude/settings.json');

    if (!settings) {
      status.settingsValid = false;
      status.settingsIssues.push('Invalid JSON in settings.json');
    } else {
      // Check hooks
      if (settings.hooks) {
        // SessionStart
        if (settings.hooks.SessionStart) {
          if (
            Array.isArray(settings.hooks.SessionStart) &&
            settings.hooks.SessionStart.length > 0
          ) {
            const hook = settings.hooks.SessionStart[0];
            if (hook.matcher !== undefined && hook.hooks) {
              status.features.sessionstart.enabled = true;
            } else {
              status.features.sessionstart.enabled = true;
              status.features.sessionstart.valid = false;
              status.features.sessionstart.issues.push('Old format - needs migration');
            }
          } else if (typeof settings.hooks.SessionStart === 'string') {
            status.features.sessionstart.enabled = true;
            status.features.sessionstart.valid = false;
            status.features.sessionstart.issues.push('String format - needs migration');
          }
        }

        // PreCompact
        if (settings.hooks.PreCompact) {
          if (Array.isArray(settings.hooks.PreCompact) && settings.hooks.PreCompact.length > 0) {
            const hook = settings.hooks.PreCompact[0];
            if (hook.matcher !== undefined && hook.hooks) {
              status.features.precompact.enabled = true;
            } else {
              status.features.precompact.enabled = true;
              status.features.precompact.valid = false;
              status.features.precompact.issues.push('Old format - needs migration');
            }
          } else if (typeof settings.hooks.PreCompact === 'string') {
            status.features.precompact.enabled = true;
            status.features.precompact.valid = false;
            status.features.precompact.issues.push('String format - needs migration');
          }
        }

        // Stop
        if (settings.hooks.Stop) {
          if (Array.isArray(settings.hooks.Stop) && settings.hooks.Stop.length > 0) {
            const hook = settings.hooks.Stop[0];
            if (hook.matcher !== undefined && hook.hooks) {
              status.features.stop.enabled = true;
            } else {
              status.features.stop.enabled = true;
              status.features.stop.valid = false;
              status.features.stop.issues.push('Old format - needs migration');
            }
          } else if (typeof settings.hooks.Stop === 'string') {
            status.features.stop.enabled = true;
            status.features.stop.valid = false;
            status.features.stop.issues.push('String format - needs migration');
          }
        }
      }

      // StatusLine
      if (settings.statusLine) {
        status.features.statusline.enabled = true;
        if (typeof settings.statusLine === 'string') {
          status.features.statusline.valid = false;
          status.features.statusline.issues.push('String format - needs type:command');
        } else if (!settings.statusLine.type) {
          status.features.statusline.valid = false;
          status.features.statusline.issues.push('Missing type:command');
        }
      }
    }
  }

  // Metadata
  const metaPath = 'docs/00-meta/agileflow-metadata.json';
  if (fs.existsSync(metaPath)) {
    status.metadata.exists = true;
    const meta = readJSON(metaPath);
    if (meta) {
      status.metadata.version = meta.version;
      if (meta.archival?.enabled) {
        status.features.archival.enabled = true;
        status.features.archival.threshold = meta.archival.threshold_days;
      }
    }
  }

  return status;
}

function printStatus(status) {
  header('📊 Current Configuration');

  // Git
  log(
    `Git: ${status.git.initialized ? '✅' : '❌'} ${status.git.initialized ? 'initialized' : 'not initialized'}${status.git.remote ? ` (${status.git.remote})` : ''}`,
    status.git.initialized ? c.green : c.dim
  );

  // Settings
  if (!status.settingsExists) {
    log('Settings: ❌ .claude/settings.json not found', c.dim);
  } else if (!status.settingsValid) {
    log('Settings: ❌ Invalid JSON', c.red);
  } else {
    log('Settings: ✅ .claude/settings.json exists', c.green);
  }

  // Features
  header('Features:');

  const printFeature = (name, label) => {
    const f = status.features[name];
    let statusIcon = f.enabled ? '✅' : '❌';
    let statusText = f.enabled ? 'enabled' : 'disabled';
    let color = f.enabled ? c.green : c.dim;

    if (f.enabled && !f.valid) {
      statusIcon = '⚠️';
      statusText = 'INVALID FORMAT';
      color = c.yellow;
    }

    log(`  ${statusIcon} ${label}: ${statusText}`, color);

    if (f.issues?.length > 0) {
      f.issues.forEach(issue => log(`     └─ ${issue}`, c.yellow));
    }
  };

  printFeature('sessionstart', 'SessionStart Hook');
  printFeature('precompact', 'PreCompact Hook');
  printFeature('stop', 'Stop Hook');

  const arch = status.features.archival;
  log(
    `  ${arch.enabled ? '✅' : '❌'} Archival: ${arch.enabled ? `${arch.threshold} days` : 'disabled'}`,
    arch.enabled ? c.green : c.dim
  );

  printFeature('statusline', 'Status Line');

  // Metadata
  if (status.metadata.exists) {
    log(`\nMetadata: v${status.metadata.version}`, c.dim);
  }

  // Issues summary
  const hasIssues = Object.values(status.features).some(f => f.issues?.length > 0);
  if (hasIssues) {
    log('\n⚠️  Format issues detected! Run with --migrate to fix.', c.yellow);
  }

  return hasIssues;
}

// ============================================================================
// MIGRATION
// ============================================================================

function migrateSettings() {
  header('🔧 Migrating Settings...');

  if (!fs.existsSync('.claude/settings.json')) {
    warn('No settings.json to migrate');
    return false;
  }

  const settings = readJSON('.claude/settings.json');
  if (!settings) {
    error('Cannot parse settings.json');
    return false;
  }

  let migrated = false;

  // Migrate hooks
  if (settings.hooks) {
    ['SessionStart', 'PreCompact', 'Stop', 'UserPromptSubmit'].forEach(hookName => {
      const hook = settings.hooks[hookName];
      if (!hook) return;

      // String format → array format
      if (typeof hook === 'string') {
        const isNode = hook.includes('node ') || hook.endsWith('.js');
        settings.hooks[hookName] = [
          {
            matcher: '',
            hooks: [{ type: 'command', command: isNode ? hook : `bash ${hook}` }],
          },
        ];
        success(`Migrated ${hookName} from string format`);
        migrated = true;
      }
      // Old object format → new format
      else if (Array.isArray(hook) && hook.length > 0) {
        const first = hook[0];
        if (first.enabled !== undefined || first.command !== undefined) {
          // Old format with enabled/command
          if (first.command) {
            settings.hooks[hookName] = [
              {
                matcher: '',
                hooks: [{ type: 'command', command: first.command }],
              },
            ];
            success(`Migrated ${hookName} from old object format`);
            migrated = true;
          }
        } else if (first.matcher === undefined) {
          // Missing matcher
          settings.hooks[hookName] = [
            {
              matcher: '',
              hooks: first.hooks || [{ type: 'command', command: 'echo "hook"' }],
            },
          ];
          success(`Migrated ${hookName} - added matcher`);
          migrated = true;
        }
      }
    });
  }

  // Migrate statusLine
  if (settings.statusLine) {
    if (typeof settings.statusLine === 'string') {
      settings.statusLine = {
        type: 'command',
        command: settings.statusLine,
        padding: 0,
      };
      success('Migrated statusLine from string format');
      migrated = true;
    } else if (!settings.statusLine.type) {
      settings.statusLine.type = 'command';
      if (settings.statusLine.refreshInterval) {
        delete settings.statusLine.refreshInterval;
        settings.statusLine.padding = 0;
      }
      success('Migrated statusLine - added type:command');
      migrated = true;
    }
  }

  if (migrated) {
    // Backup original
    fs.copyFileSync('.claude/settings.json', '.claude/settings.json.backup');
    info('Backed up to .claude/settings.json.backup');

    writeJSON('.claude/settings.json', settings);
    success('Settings migrated successfully!');
  } else {
    info('No migration needed - formats are correct');
  }

  return migrated;
}

// ============================================================================
// ENABLE/DISABLE FEATURES
// ============================================================================

function enableFeature(feature, options = {}) {
  const config = FEATURES[feature];
  if (!config) {
    error(`Unknown feature: ${feature}`);
    return false;
  }

  ensureDir('.claude');
  ensureDir('scripts');

  const settings = readJSON('.claude/settings.json') || {};
  settings.hooks = settings.hooks || {};
  settings.permissions = settings.permissions || { allow: [], deny: [], ask: [] };

  // Handle hook-based features
  if (config.hook) {
    const scriptPath = `scripts/${config.script}`;

    // Deploy script
    if (!copyTemplate(config.script, scriptPath)) {
      // Create minimal version
      if (feature === 'sessionstart') {
        fs.writeFileSync(
          scriptPath,
          `#!/usr/bin/env node\nconsole.log('AgileFlow v${VERSION} loaded');\n`
        );
      } else if (feature === 'precompact') {
        fs.writeFileSync(scriptPath, '#!/bin/bash\necho "PreCompact: preserving context"\n');
      } else if (feature === 'stop') {
        fs.writeFileSync(
          scriptPath,
          `#!/bin/bash
git rev-parse --git-dir > /dev/null 2>&1 || exit 0
CHANGES=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
[ "$CHANGES" -gt 0 ] && echo -e "\\n\\033[33m$CHANGES uncommitted change(s)\\033[0m"
`
        );
      }
      try {
        fs.chmodSync(scriptPath, '755');
      } catch {}
      warn(`Created minimal ${config.script}`);
    } else {
      success(`Deployed ${config.script}`);
    }

    // Configure hook
    const command = config.type === 'node' ? `node ${scriptPath}` : `bash ${scriptPath}`;

    settings.hooks[config.hook] = [
      {
        matcher: '',
        hooks: [{ type: 'command', command }],
      },
    ];
    success(`${config.hook} hook enabled`);
  }

  // Handle archival
  if (feature === 'archival') {
    const days = options.archivalDays || 7;
    const scriptPath = 'scripts/archive-completed-stories.sh';

    if (!copyTemplate('archive-completed-stories.sh', scriptPath)) {
      warn('Archival script template not found');
    } else {
      success('Deployed archive-completed-stories.sh');
    }

    // Add to SessionStart hook
    if (settings.hooks.SessionStart?.[0]?.hooks) {
      const hasArchival = settings.hooks.SessionStart[0].hooks.some(h =>
        h.command?.includes('archive-completed-stories')
      );
      if (!hasArchival) {
        settings.hooks.SessionStart[0].hooks.push({
          type: 'command',
          command: 'bash scripts/archive-completed-stories.sh --quiet',
        });
      }
    }

    // Update metadata
    updateMetadata({ archival: { enabled: true, threshold_days: days } });
    success(`Archival enabled (${days} days)`);
  }

  // Handle statusLine
  if (feature === 'statusline') {
    const scriptPath = 'scripts/agileflow-statusline.sh';

    if (!copyTemplate('agileflow-statusline.sh', scriptPath)) {
      fs.writeFileSync(
        scriptPath,
        `#!/bin/bash
input=$(cat)
MODEL=$(echo "$input" | jq -r '.model.display_name // "Claude"')
echo "[$MODEL] AgileFlow"
`
      );
      try {
        fs.chmodSync(scriptPath, '755');
      } catch {}
      warn('Created minimal statusline script');
    } else {
      success('Deployed agileflow-statusline.sh');
    }

    settings.statusLine = {
      type: 'command',
      command: 'bash scripts/agileflow-statusline.sh',
      padding: 0,
    };
    success('Status line enabled');
  }

  writeJSON('.claude/settings.json', settings);
  updateMetadata({
    features: { [feature]: { enabled: true, version: VERSION, at: new Date().toISOString() } },
  });
  updateGitignore();

  return true;
}

function disableFeature(feature) {
  const config = FEATURES[feature];
  if (!config) {
    error(`Unknown feature: ${feature}`);
    return false;
  }

  if (!fs.existsSync('.claude/settings.json')) {
    info(`${feature} already disabled (no settings file)`);
    return true;
  }

  const settings = readJSON('.claude/settings.json');
  if (!settings) return false;

  // Disable hook
  if (config.hook && settings.hooks?.[config.hook]) {
    delete settings.hooks[config.hook];
    success(`${config.hook} hook disabled`);
  }

  // Disable archival
  if (feature === 'archival') {
    // Remove from SessionStart
    if (settings.hooks?.SessionStart?.[0]?.hooks) {
      settings.hooks.SessionStart[0].hooks = settings.hooks.SessionStart[0].hooks.filter(
        h => !h.command?.includes('archive-completed-stories')
      );
    }
    updateMetadata({ archival: { enabled: false } });
    success('Archival disabled');
  }

  // Disable statusLine
  if (feature === 'statusline' && settings.statusLine) {
    delete settings.statusLine;
    success('Status line disabled');
  }

  writeJSON('.claude/settings.json', settings);
  updateMetadata({
    features: { [feature]: { enabled: false, version: VERSION, at: new Date().toISOString() } },
  });

  return true;
}

// ============================================================================
// METADATA
// ============================================================================

function updateMetadata(updates) {
  const metaPath = 'docs/00-meta/agileflow-metadata.json';

  if (!fs.existsSync(metaPath)) {
    ensureDir('docs/00-meta');
    writeJSON(metaPath, { version: VERSION, created: new Date().toISOString() });
  }

  const meta = readJSON(metaPath) || {};

  // Deep merge
  if (updates.archival) {
    meta.archival = { ...meta.archival, ...updates.archival };
  }
  if (updates.features) {
    meta.features = meta.features || {};
    Object.entries(updates.features).forEach(([key, value]) => {
      meta.features[key] = { ...meta.features[key], ...value };
    });
  }

  meta.version = VERSION;
  meta.updated = new Date().toISOString();

  writeJSON(metaPath, meta);
}

function updateGitignore() {
  const entries = [
    '.claude/settings.local.json',
    '.claude/activity.log',
    '.claude/context.log',
    '.claude/hook.log',
    '.claude/prompt-log.txt',
    '.claude/session.log',
  ];

  let content = fs.existsSync('.gitignore') ? fs.readFileSync('.gitignore', 'utf8') : '';
  let added = false;

  entries.forEach(entry => {
    if (!content.includes(entry)) {
      content += `\n${entry}`;
      added = true;
    }
  });

  if (added) {
    fs.writeFileSync('.gitignore', content.trimEnd() + '\n');
  }
}

// ============================================================================
// STATUSLINE COMPONENTS
// ============================================================================

function setStatuslineComponents(enableComponents = [], disableComponents = []) {
  const metaPath = 'docs/00-meta/agileflow-metadata.json';

  if (!fs.existsSync(metaPath)) {
    warn('No metadata file found - run with --enable=statusline first');
    return false;
  }

  const meta = readJSON(metaPath);
  if (!meta) {
    error('Cannot parse metadata file');
    return false;
  }

  // Ensure statusline.components structure exists
  meta.features = meta.features || {};
  meta.features.statusline = meta.features.statusline || {};
  meta.features.statusline.components = meta.features.statusline.components || {};

  // Set defaults for any missing components
  STATUSLINE_COMPONENTS.forEach(comp => {
    if (meta.features.statusline.components[comp] === undefined) {
      meta.features.statusline.components[comp] = true;
    }
  });

  // Enable specified components
  enableComponents.forEach(comp => {
    if (STATUSLINE_COMPONENTS.includes(comp)) {
      meta.features.statusline.components[comp] = true;
      success(`Statusline component enabled: ${comp}`);
    } else {
      warn(`Unknown component: ${comp} (available: ${STATUSLINE_COMPONENTS.join(', ')})`);
    }
  });

  // Disable specified components
  disableComponents.forEach(comp => {
    if (STATUSLINE_COMPONENTS.includes(comp)) {
      meta.features.statusline.components[comp] = false;
      success(`Statusline component disabled: ${comp}`);
    } else {
      warn(`Unknown component: ${comp} (available: ${STATUSLINE_COMPONENTS.join(', ')})`);
    }
  });

  meta.updated = new Date().toISOString();
  writeJSON(metaPath, meta);

  return true;
}

function listStatuslineComponents() {
  const metaPath = 'docs/00-meta/agileflow-metadata.json';

  header('📊 Statusline Components');

  if (!fs.existsSync(metaPath)) {
    log('  No configuration found (defaults: all enabled)', c.dim);
    STATUSLINE_COMPONENTS.forEach(comp => {
      log(`  ✅ ${comp}: enabled (default)`, c.green);
    });
    return;
  }

  const meta = readJSON(metaPath);
  const components = meta?.features?.statusline?.components || {};

  STATUSLINE_COMPONENTS.forEach(comp => {
    const enabled = components[comp] !== false; // default true
    const icon = enabled ? '✅' : '❌';
    const color = enabled ? c.green : c.dim;
    log(`  ${icon} ${comp}: ${enabled ? 'enabled' : 'disabled'}`, color);
  });

  log('\nTo toggle: --show=<component> or --hide=<component>', c.dim);
  log(`Components: ${STATUSLINE_COMPONENTS.join(', ')}`, c.dim);
}

// ============================================================================
// PROFILES
// ============================================================================

function applyProfile(profileName, options = {}) {
  const profile = PROFILES[profileName];
  if (!profile) {
    error(`Unknown profile: ${profileName}`);
    log('Available: ' + Object.keys(PROFILES).join(', '));
    return false;
  }

  header(`🚀 Applying "${profileName}" profile`);
  log(profile.description, c.dim);

  // Enable features
  if (profile.enable) {
    profile.enable.forEach(f =>
      enableFeature(f, { archivalDays: profile.archivalDays || options.archivalDays })
    );
  }

  // Disable features
  if (profile.disable) {
    profile.disable.forEach(f => disableFeature(f));
  }

  return true;
}

// ============================================================================
// SUMMARY
// ============================================================================

function printSummary(actions) {
  header('✅ Configuration Complete!');

  if (actions.enabled?.length > 0) {
    log('\nEnabled:', c.green);
    actions.enabled.forEach(f => log(`  ✅ ${f}`, c.green));
  }

  if (actions.disabled?.length > 0) {
    log('\nDisabled:', c.dim);
    actions.disabled.forEach(f => log(`  ❌ ${f}`, c.dim));
  }

  if (actions.migrated) {
    log('\nMigrated: Fixed format issues', c.yellow);
  }

  log('\n' + '═'.repeat(55), c.red);
  log('🔴 RESTART CLAUDE CODE NOW!', c.red + c.bold);
  log('   Quit completely, wait 5 seconds, restart', c.red);
  log('═'.repeat(55), c.red);
}

// ============================================================================
// HELP
// ============================================================================

function printHelp() {
  log(`
${c.bold}AgileFlow Configure${c.reset} - Manage AgileFlow features

${c.cyan}Usage:${c.reset}
  node scripts/agileflow-configure.js [options]

${c.cyan}Profiles:${c.reset}
  --profile=full      All features (hooks, archival, statusline)
  --profile=basic     SessionStart + PreCompact + archival
  --profile=minimal   SessionStart + archival only
  --profile=none      Disable all AgileFlow features

${c.cyan}Feature Control:${c.reset}
  --enable=<list>     Enable features (comma-separated)
  --disable=<list>    Disable features (comma-separated)

  Features: sessionstart, precompact, stop, archival, statusline

${c.cyan}Statusline Components:${c.reset}
  --show=<list>       Show statusline components (comma-separated)
  --hide=<list>       Hide statusline components (comma-separated)
  --components        List statusline component status

  Components: agileflow, model, story, epic, wip, context, cost, git

${c.cyan}Settings:${c.reset}
  --archival-days=N   Set archival threshold (default: 7)

${c.cyan}Maintenance:${c.reset}
  --migrate           Fix old/invalid formats
  --validate          Check for issues (same as --detect)
  --detect            Show current configuration

${c.cyan}Examples:${c.reset}
  # Quick setup with all features
  node scripts/agileflow-configure.js --profile=full

  # Enable specific features
  node scripts/agileflow-configure.js --enable=sessionstart,precompact,stop

  # Disable a feature
  node scripts/agileflow-configure.js --disable=statusline

  # Show only agileflow branding and context in statusline
  node scripts/agileflow-configure.js --hide=model,story,epic,wip,cost,git

  # Re-enable git branch in statusline
  node scripts/agileflow-configure.js --show=git

  # List component status
  node scripts/agileflow-configure.js --components

  # Fix format issues
  node scripts/agileflow-configure.js --migrate

  # Check current status
  node scripts/agileflow-configure.js --detect
`);
}

// ============================================================================
// MAIN
// ============================================================================

function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  let profile = null;
  let enable = [];
  let disable = [];
  let show = [];
  let hide = [];
  let archivalDays = 7;
  let migrate = false;
  let detect = false;
  let components = false;
  let help = false;

  args.forEach(arg => {
    if (arg.startsWith('--profile=')) profile = arg.split('=')[1];
    else if (arg.startsWith('--enable='))
      enable = arg
        .split('=')[1]
        .split(',')
        .map(s => s.trim().toLowerCase());
    else if (arg.startsWith('--disable='))
      disable = arg
        .split('=')[1]
        .split(',')
        .map(s => s.trim().toLowerCase());
    else if (arg.startsWith('--show='))
      show = arg
        .split('=')[1]
        .split(',')
        .map(s => s.trim().toLowerCase());
    else if (arg.startsWith('--hide='))
      hide = arg
        .split('=')[1]
        .split(',')
        .map(s => s.trim().toLowerCase());
    else if (arg.startsWith('--archival-days=')) archivalDays = parseInt(arg.split('=')[1]) || 7;
    else if (arg === '--migrate') migrate = true;
    else if (arg === '--detect' || arg === '--validate') detect = true;
    else if (arg === '--components') components = true;
    else if (arg === '--help' || arg === '-h') help = true;
  });

  if (help) {
    printHelp();
    return;
  }

  // Components list mode
  if (components && show.length === 0 && hide.length === 0) {
    listStatuslineComponents();
    return;
  }

  // Component toggle mode
  if (show.length > 0 || hide.length > 0) {
    setStatuslineComponents(show, hide);
    listStatuslineComponents();
    return;
  }

  // Always detect first
  const status = detectConfig();
  const hasIssues = printStatus(status);

  // Detect only mode
  if (detect && !migrate && !profile && enable.length === 0 && disable.length === 0) {
    return;
  }

  // Migrate mode
  if (migrate) {
    migrateSettings();
    return;
  }

  // Auto-migrate if issues detected
  if (hasIssues && (profile || enable.length > 0)) {
    log('\n⚠️  Auto-migrating invalid formats...', c.yellow);
    migrateSettings();
  }

  const actions = { enabled: [], disabled: [], migrated: hasIssues };

  // Apply profile
  if (profile) {
    applyProfile(profile, { archivalDays });
    const p = PROFILES[profile];
    actions.enabled = p.enable || [];
    actions.disabled = p.disable || [];
  }

  // Enable specific features
  enable.forEach(f => {
    if (enableFeature(f, { archivalDays })) {
      actions.enabled.push(f);
    }
  });

  // Disable specific features
  disable.forEach(f => {
    if (disableFeature(f)) {
      actions.disabled.push(f);
    }
  });

  // Print summary if anything changed
  if (actions.enabled.length > 0 || actions.disabled.length > 0) {
    printSummary(actions);
  } else if (!detect) {
    log('\nNo changes made. Use --help for usage.', c.dim);
  }
}

main();
