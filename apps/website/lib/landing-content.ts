import 'server-only';

import { codeToHtml } from '@/lib/shiki';
import { LINKS } from '@/lib/links';
import { getAgileFlowStats } from '@/lib/stats';

export type Stat = { value: number; label: string };

export type HowItWorksStep = {
  step: number;
  title: string;
  description: string;
  lottieSrc: string;
};

export type FeatureTile = {
  id: string;
  title: string;
  description: string;
  tag: string;
  size: 'large' | 'medium' | 'small';
  lottieSrc: string;
  modal: {
    title: string;
    body: string[];
    codeHtml?: string;
    docsHref: string;
  };
};

export type LandingContent = {
  version: string;
  hero: {
    eyebrow: string;
    headline: string;
    subhead: string;
    primaryCommand: string;
    altCommand: string;
    secondaryCta: { label: string; href: string };
    lottieSrc: string;
  };
  stats: Stat[];
  howItWorks: {
    heading: string;
    subhead: string;
    reassurance: string;
    steps: HowItWorksStep[];
  };
  features: {
    heading: string;
    subhead: string;
    tiles: FeatureTile[];
  };
  docsPreview: {
    heading: string;
    subhead: string;
    treeHtml: string;
    lottieSrc: string;
    callout: { title: string; body: string };
  };
  ideCards: {
    heading: string;
    cards: Array<{ name: string; path: string; lottieSrc: string }>;
  };
  commands: {
    heading: string;
    subhead: string;
    categories: Array<{
      id: string;
      name: string;
      commands: Array<{
        name: string;
        description: string;
        exampleHtml: string;
      }>;
    }>;
  };
  agents: {
    heading: string;
    subhead: string;
    lottieSrc: string;
    highlight: string;
    keyAgents: Array<{ name: string; summary: string }>;
  };
  testimonials: {
    heading: string;
    subhead: string;
    items: Array<
      | { kind: 'quote'; quote: string; name: string; role: string }
      | { kind: 'diff'; title: string; html: string; caption: string }
    >;
  };
  faq: {
    heading: string;
    items: Array<{ question: string; answer: string }>;
  };
  finalCta: {
    heading: string;
    subhead: string;
    primaryCommand: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  footer: {
    columns: Array<{ title: string; links: Array<{ label: string; href: string }> }>;
    bottom: string;
  };
};

export async function buildLandingContent(): Promise<LandingContent> {
  const stats = getAgileFlowStats();

  const docsTree = `docs/
├── 00-meta/          # Templates, guides, conventions
├── 01-brainstorming/ # Ideas and sketches
├── 02-practices/     # Testing, git, releasing, security
├── 03-decisions/     # Architecture Decision Records
├── 04-architecture/  # System design docs
├── 05-epics/         # Feature epics (EP-####)
├── 06-stories/       # User stories (US-####)
├── 07-testing/       # Test cases and acceptance tests
├── 08-project/       # Roadmap, backlog, milestones
├── 09-agents/        # Status tracking + message bus
└── 10-research/      # Technical research notes`;

  const [docsTreeHtml, storySnippet, adrSnippet, busSnippet, diffSnippet] = await Promise.all([
    codeToHtml(docsTree, 'text'),
    codeToHtml(
      `# US-0123: Context export for web AI

## Goal
Generate a one-page context summary for tools with strict limits.

## Acceptance Criteria
- Given a repo, when /agileflow:context:full runs, then \`docs/00-meta/context.md\` updates
- Given verbose docs, when /agileflow:compress runs, then duplicated sections are reduced
`,
      'markdown',
    ),
    codeToHtml(
      `# ADR-0042: Message bus format

## Decision
Use append-only JSONL: \`docs/09-agents/bus.jsonl\`

## Consequences
- Auditable coordination between agents
- Diff-friendly history in git
`,
      'markdown',
    ),
    codeToHtml(
      `{"ts":"2025-01-12T09:14:03Z","agent":"ui","type":"status","story":"US-0123","state":"in-progress"}
{"ts":"2025-01-12T09:19:27Z","agent":"ci","type":"check","story":"US-0123","state":"passing"}`,
      'json',
    ),
    codeToHtml(
      `diff --git a/README.md b/README.md
index 3b18c71..8c2aa0f 100644
--- a/README.md
+++ b/README.md
@@ -1,3 +1,14 @@
 # Repo
+
+## AgileFlow
+- Scaffolded docs-as-code workflow
+- Added epics, stories, ADRs, and testing folders
+- Introduced message bus for multi-agent coordination
`,
      'diff',
    ),
  ]);

  const commandExample = async (command: string, lines: string[]) =>
    codeToHtml([`/agileflow:${command}`, ...lines].join('\n'), 'bash');

  return {
    version: stats.version,
    hero: {
      eyebrow: 'Open-source • MIT License',
      headline: 'Agile delivery, in your repo—powered by AI.',
      subhead:
        'Scrum, Kanban, ADRs, and docs-as-code—scaffolded into Claude Code, Cursor, or Windsurf. Everything versioned. Nothing hidden.',
      primaryCommand: 'npm install --save-dev agileflow',
      altCommand: 'npx agileflow setup',
      secondaryCta: { label: 'See the docs structure', href: '#docs' },
      lottieSrc: '/lottie/hero-system-boot.json',
    },
    stats: [
      { value: stats.commands, label: 'Slash commands' },
      { value: stats.agents, label: 'Specialized agents' },
      { value: stats.skills, label: 'Code generation skills' },
      { value: stats.ides, label: 'IDEs supported' },
    ],
    howItWorks: {
      heading: 'How It Works',
      subhead: 'Install once. Scaffold structure. Operate with commands.',
      reassurance: 'All files are markdown. All changes are commits. Fully reversible.',
      steps: [
        {
          step: 1,
          title: 'Install',
          description: 'npm install --save-dev agileflow',
          lottieSrc: '/lottie/terminal-typing.json',
        },
        {
          step: 2,
          title: 'Scaffold',
          description: 'Run /agileflow:setup in your IDE',
          lottieSrc: '/lottie/folder-scaffold.json',
        },
        {
          step: 3,
          title: 'Work',
          description: 'Use commands to plan, record, verify, and ship',
          lottieSrc: '/lottie/command-flow.json',
        },
      ],
    },
    features: {
      heading: 'Systematic by default',
      subhead: 'A repeatable docs-as-code workflow that scales from solo to multi-agent.',
      tiles: [
        {
          id: 'epics-stories',
          title: 'Epics and stories',
          description: 'Turn ideas into testable increments with acceptance criteria.',
          tag: 'Planning',
          size: 'large',
          lottieSrc: '/lottie/kanban-markdown.json',
          modal: {
            title: 'Stories that stay reviewable',
            body: [
              'Stories are markdown files in your repo.',
              'Acceptance criteria is explicit and testable.',
              'Templates keep naming, status, and ownership consistent.',
              'Updates are diffs. Reviews are pull requests.',
              'WIP limits and lifecycle rules stay visible to everyone.',
              'Everything stays portable across IDEs and assistants.',
            ],
            codeHtml: storySnippet,
            docsHref: LINKS.docs,
          },
        },
        {
          id: 'adrs',
          title: 'Decision records',
          description: 'Stop re-deciding. Record decisions once, in markdown.',
          tag: 'Decisions',
          size: 'medium',
          lottieSrc: '/lottie/adr-decision.json',
          modal: {
            title: 'Architecture decisions in git',
            body: [
              'ADRs are first-class docs with consistent templates.',
              'Alternatives are captured alongside the chosen path.',
              'New teammates inherit context without meetings.',
              'Your architecture history is searchable and auditable.',
              'Decisions remain reviewable via diffs and PRs.',
              'No hosted system required.',
            ],
            codeHtml: adrSnippet,
            docsHref: LINKS.docs,
          },
        },
        {
          id: 'structure',
          title: 'Docs-as-code structure',
          description: '11 folders with clear hierarchy. Versioned and reviewable.',
          tag: 'Structure',
          size: 'medium',
          lottieSrc: '/lottie/docs-tree-growth.json',
          modal: {
            title: 'A folder system you can keep',
            body: [
              'Conventions live alongside the work they govern.',
              'Docs remain readable without a proprietary UI.',
              'Everything is portable across IDEs and assistants.',
              'Scaffolding is reversible: delete the folders, remove the config.',
              'Structure stays consistent as teams grow.',
              'History stays in git.',
            ],
            docsHref: LINKS.docs,
          },
        },
        {
          id: 'coordination',
          title: 'Multi-agent coordination',
          description: `${stats.agents} agents coordinate via an append-only message bus.`,
          tag: 'Agents',
          size: 'small',
          lottieSrc: '/lottie/message-bus-pulse.json',
          modal: {
            title: 'Auditable coordination',
            body: [
              'Agents operate in focused context windows.',
              'They exchange state through an append-only JSONL log.',
              'Logs are diffable, reviewable, and versioned in git.',
              'No hidden memory or opaque coordination layer.',
              'Coordination remains inspectable in code review.',
              'You can replay state from history.',
            ],
            codeHtml: busSnippet,
            docsHref: LINKS.docs,
          },
        },
        {
          id: 'sprint',
          title: 'Planning and WIP',
          description: 'Track velocity and WIP limits with explicit status.',
          tag: 'Planning',
          size: 'small',
          lottieSrc: '/lottie/velocity-chart.json',
          modal: {
            title: 'Planning with constraints',
            body: [
              'WIP limits stay visible in the repo.',
              'Status changes are documented, not implied.',
              'Metrics are computed from structured files.',
              'Works for solo flow or team cadence.',
              'Planning artifacts remain reviewable.',
              'No dashboards required.',
            ],
            docsHref: LINKS.docs,
          },
        },
        {
          id: 'verification',
          title: 'Verification harness',
          description: 'Keep a clean baseline with repeatable verification.',
          tag: 'Quality',
          size: 'small',
          lottieSrc: '/lottie/test-badge-flip.json',
          modal: {
            title: 'Verify before you ship',
            body: [
              'Verification is a first-class workflow step.',
              'Test expectations stay close to the story they serve.',
              'A session harness reduces broken baselines.',
              'Fits CI without requiring a hosted service.',
              'Keeps the repo in a known-good state.',
              'Failure states stay explicit.',
            ],
            docsHref: LINKS.docs,
          },
        },
        {
          id: 'pr',
          title: 'PR generation',
          description: 'Generate PR summaries from story context.',
          tag: 'Automation',
          size: 'small',
          lottieSrc: '/lottie/command-flow.json',
          modal: {
            title: 'PRs tied to the story',
            body: [
              'PR descriptions pull from story fields and acceptance criteria.',
              'Links to ADRs and tests remain consistent.',
              'Reviewers get context without a separate system.',
              'Keeps documentation durable after merge.',
              'Works with any git hosting.',
              'No hosted lock-in.',
            ],
            docsHref: LINKS.docs,
          },
        },
      ],
    },
    docsPreview: {
      heading: 'Docs structure preview',
      subhead: 'Scaffolded folders and conventions, committed to git.',
      treeHtml: docsTreeHtml,
      lottieSrc: '/lottie/docs-tree-growth.json',
      callout: {
        title: 'Single source of truth',
        body: 'docs/09-agents/status.json keeps WIP limits and lifecycle state explicit.',
      },
    },
    ideCards: {
      heading: 'IDE integrations',
      cards: [
        { name: 'Claude Code', path: '.claude/commands/agileflow/', lottieSrc: '/lottie/ide-config-check.json' },
        { name: 'Cursor', path: '.cursor/rules/agileflow/', lottieSrc: '/lottie/ide-config-check.json' },
        { name: 'Windsurf', path: '.windsurf/workflows/agileflow/', lottieSrc: '/lottie/ide-config-check.json' },
      ],
    },
    commands: {
      heading: 'Commands',
      subhead: 'Slash commands grouped by workflow stage.',
      categories: [
        {
          id: 'core',
          name: 'Core',
          commands: [
            {
              name: 'setup',
              description: 'Scaffold folders, templates, and config into the repo.',
              exampleHtml: await commandExample('setup', [
                'Scaffolding docs/…',
                'Created 11 folders and templates',
                'Configured IDE command packs',
              ]),
            },
            {
              name: 'help',
              description: 'Show the command surface area and conventions.',
              exampleHtml: await commandExample('help', [
                `Commands: ${stats.commands}`,
                `Agents: ${stats.agents}`,
                `Skills: ${stats.skills}`,
              ]),
            },
            {
              name: 'babysit',
              description: 'Keep work moving with status checks and reminders.',
              exampleHtml: await commandExample('babysit', ['Checked WIP limits', 'Flagged stale stories: 2']),
            },
          ],
        },
        {
          id: 'planning',
          name: 'Planning',
          commands: [
            {
              name: 'epic',
              description: 'Create or update an epic with scope and milestones.',
              exampleHtml: await commandExample('epic', ['Created docs/05-epics/EP-0042.md']),
            },
            {
              name: 'story',
              description: 'Create a story with acceptance criteria and ownership.',
              exampleHtml: await commandExample('story', ['Created docs/06-stories/US-0123.md']),
            },
            {
              name: 'sprint',
              description: 'Plan a sprint with WIP limits and story selection.',
              exampleHtml: await commandExample('sprint', ['Selected stories: 6', 'WIP limit: 3']),
            },
            {
              name: 'assign',
              description: 'Assign ownership for a story or task.',
              exampleHtml: await commandExample('assign', ['US-0123 → @devhandle']),
            },
            {
              name: 'status',
              description: 'Update lifecycle state: in-progress → in-review → done.',
              exampleHtml: await commandExample('status', ['US-0123: in-review', 'Updated docs/09-agents/status.json']),
            },
          ],
        },
        {
          id: 'docs',
          name: 'Documentation',
          commands: [
            {
              name: 'adr',
              description: 'Record an architecture decision with rationale and consequences.',
              exampleHtml: await commandExample('adr', ['Created docs/03-decisions/ADR-0042.md']),
            },
            {
              name: 'docs',
              description: 'Generate or refresh docs indexes and summaries.',
              exampleHtml: await commandExample('docs', ['Updated docs/00-meta/README.md']),
            },
            {
              name: 'readme-sync',
              description: 'Sync project README from structured repo docs.',
              exampleHtml: await commandExample('readme-sync', ['Updated README.md']),
            },
            {
              name: 'changelog',
              description: 'Generate a changelog from merged work.',
              exampleHtml: await commandExample('changelog', ['Updated CHANGELOG.md']),
            },
          ],
        },
        {
          id: 'quality',
          name: 'Quality',
          commands: [
            {
              name: 'verify',
              description: 'Run a verification pass that matches the story contract.',
              exampleHtml: await commandExample('verify', ['Harness: ready', 'Status: passing']),
            },
            {
              name: 'tests',
              description: 'Generate or update tests from acceptance criteria.',
              exampleHtml: await commandExample('tests', ['Added cases for US-0123', 'Updated docs/07-testing/']),
            },
            {
              name: 'ci',
              description: 'Add or update CI conventions for the workflow.',
              exampleHtml: await commandExample('ci', ['Updated .github/workflows/']),
            },
            {
              name: 'review',
              description: 'Prepare review context from story and ADR references.',
              exampleHtml: await commandExample('review', ['Summary ready', 'Linked ADR-0042, US-0123']),
            },
          ],
        },
        {
          id: 'analytics',
          name: 'Analytics',
          commands: [
            {
              name: 'board',
              description: 'Render a board view from story files and status.',
              exampleHtml: await commandExample('board', ['in-progress: 2', 'in-review: 1', 'done: 5']),
            },
            {
              name: 'velocity',
              description: 'Compute velocity over recent iterations from repo history.',
              exampleHtml: await commandExample('velocity', ['Last 3 sprints: 18, 21, 19']),
            },
            {
              name: 'metrics',
              description: 'Summarize WIP, cycle time, and blockers from structured state.',
              exampleHtml: await commandExample('metrics', ['Cycle time (p50): 2.1d', 'Blockers: 1']),
            },
            {
              name: 'blockers',
              description: 'List blocked work and the recorded reason.',
              exampleHtml: await commandExample('blockers', ['US-0107: waiting on API contract']),
            },
          ],
        },
        {
          id: 'devops',
          name: 'DevOps',
          commands: [
            {
              name: 'pr',
              description: 'Generate a PR description tied to a story and ADRs.',
              exampleHtml: await commandExample('pr', ['PR summary drafted', 'Includes acceptance criteria']),
            },
            {
              name: 'deploy',
              description: 'Record deploy notes alongside the work shipped.',
              exampleHtml: await commandExample('deploy', ['Created docs/08-project/deploy-2025-01-12.md']),
            },
            {
              name: 'packages',
              description: 'Keep package changes consistent across a monorepo.',
              exampleHtml: await commandExample('packages', ['Checked workspace versions', 'No drift detected']),
            },
            {
              name: 'impact',
              description: 'Summarize impact and follow-ups from shipped stories.',
              exampleHtml: await commandExample('impact', ['US-0123: shipped', 'Follow-ups: 2']),
            },
          ],
        },
      ],
    },
    agents: {
      heading: 'Agent architecture',
      subhead: 'Focused agents, coordinated through a message bus.',
      lottieSrc: '/lottie/message-bus-pulse.json',
      highlight:
        'Each agent operates in its own context window. Agents coordinate via an append-only message bus—auditable and versioned.',
      keyAgents: [
        { name: 'mentor', summary: 'End-to-end implementation guidance (orchestrator).' },
        { name: 'epic-planner', summary: 'Feature decomposition and milestone planning.' },
        { name: 'ui', summary: 'Front-end components and interaction patterns.' },
        { name: 'api', summary: 'Backend services and data contracts.' },
        { name: 'ci', summary: 'CI/CD pipelines and verification workflows.' },
        { name: 'security', summary: 'Vulnerability analysis and safe defaults.' },
        { name: 'research', summary: 'Technical research and tradeoff analysis.' },
      ],
    },
    testimonials: {
      heading: 'Testimonials',
      subhead: 'Quiet signals from developers who prefer systems.',
      items: [
        {
          kind: 'quote',
          quote:
            'Finally, a system that makes my AI assistants useful for planning. The ADR workflow alone saved us hours of re-discussion.',
          name: '@devhandle',
          role: 'Senior Engineer',
        },
        {
          kind: 'quote',
          quote:
            'I was skeptical about docs-as-code for agile, but having everything in git with clear structure changed how our team works.',
          name: 'Tech Lead',
          role: 'Series B startup',
        },
        {
          kind: 'quote',
          quote:
            'The multi-agent coordination is clever. Each agent stays focused, but they share context through the message bus.',
          name: '@anotherdev',
          role: 'Open source maintainer',
        },
        {
          kind: 'diff',
          title: 'What changes in a repo',
          html: diffSnippet,
          caption: 'Structure added as versioned files, not a hosted project.',
        },
      ],
    },
    faq: {
      heading: 'FAQ',
      items: [
        {
          question: 'Does this replace Jira?',
          answer:
            'AgileFlow is docs-as-code. It can complement or replace traditional tools—your call.',
        },
        {
          question: 'What if my team uses a different framework?',
          answer: 'Framework-agnostic. Works with any tech stack.',
        },
        {
          question: 'Does it work without Claude?',
          answer: 'Yes. Works with Cursor and Windsurf too. The docs structure works with any AI assistant.',
        },
        {
          question: 'How does it handle context limits?',
          answer:
            '/agileflow:compress reduces verbose fields. /agileflow:context:export exports a concise summary for web AI tools.',
        },
        {
          question: 'Is there a paid version?',
          answer: 'No. AgileFlow is free and open-source under MIT license.',
        },
      ],
    },
    finalCta: {
      heading: 'Install structure. Ship faster. Keep the record.',
      subhead: 'Takes ~2 minutes to scaffold. Fully reversible. MIT licensed.',
      primaryCommand: 'npm install --save-dev agileflow',
      secondaryLabel: 'Read the docs',
      secondaryHref: LINKS.docs,
    },
    footer: {
      columns: [
        {
          title: 'Product',
          links: [
            { label: 'Features', href: '#features' },
            { label: 'Commands', href: '#commands' },
            { label: 'Agents', href: '#agents' },
          ],
        },
        {
          title: 'Resources',
          links: [
            { label: 'Docs', href: LINKS.docs },
            { label: 'Changelog', href: `${LINKS.github}/blob/main/CHANGELOG.md` },
            { label: 'GitHub', href: LINKS.github },
          ],
        },
        {
          title: 'Community',
          links: [
            { label: 'Discussions', href: `${LINKS.github}/discussions` },
            { label: 'Contributing', href: `${LINKS.github}/blob/main/README.md` },
          ],
        },
      ],
      bottom: 'MIT License • © 2025 AgileFlow',
    },
  };
}

