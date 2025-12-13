'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Section } from '@/components/ui/Section';
import { Pill } from '@/components/ui/Pill';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';
import { trackEvent } from '@/lib/analytics';
import { usePrefersReducedMotion } from '@/lib/reducedMotion';

type Step = {
  id: string;
  title: string;
  caption: string;
  command: string;
  output: string[];
  files: string[];
};

export function WorkflowDemo() {
  const steps = useMemo<Step[]>(
    () => [
      {
        id: 'setup',
        title: 'Setup',
        caption: 'Scaffold docs + IDE config',
        command: 'npx agileflow setup',
        output: [
          'created docs/00-meta/',
          'created docs/03-decisions/',
          'created docs/05-epics/',
          'created docs/06-stories/',
          'created docs/09-agents/',
          'created .claude/commands/',
        ],
        files: ['docs/', '.claude/commands/', '.cursor/rules/'],
      },
      {
        id: 'plan',
        title: 'Plan',
        caption: 'Epic → stories → AC',
        command: 'agileflow epic create "Auth system"',
        output: [
          'created docs/05-epics/epic-01.md',
          '',
          'agileflow story create --epic 01',
          'created docs/06-stories/story-01.md',
          'created docs/06-stories/story-02.md',
        ],
        files: ['docs/05-epics/', 'docs/06-stories/'],
      },
      {
        id: 'implement',
        title: 'Implement',
        caption: 'Assign agents + track',
        command: 'agileflow assign story-01 --agent api',
        output: [
          'agent: api',
          'story: story-01',
          'status: in_progress',
          '',
          'context loaded from docs/06-stories/',
        ],
        files: ['docs/09-agents/status.json', 'docs/06-stories/story-01.md'],
      },
      {
        id: 'verify',
        title: 'Verify',
        caption: 'Baseline + CI check',
        command: 'agileflow verify --baseline create',
        output: [
          'running tests...',
          'status: not_run → passing',
          'baseline: v1 recorded',
          'ci: green',
        ],
        files: ['docs/09-agents/status.json'],
      },
      {
        id: 'ship',
        title: 'Ship',
        caption: 'PR description ready',
        command: 'agileflow pr',
        output: [
          '## Summary',
          '- Implemented auth endpoints',
          '- Added JWT validation',
          '',
          'Ready to open PR',
        ],
        files: ['CHANGELOG.md', '.github/'],
      },
    ],
    [],
  );

  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const step = steps[active]!;

  return (
    <Section id="workflow" alternate>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="max-w-2xl">
          <Reveal>
            <Pill>Workflow</Pill>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 text-2xl font-semibold tracking-tightish text-ink sm:text-3xl">
              A walkthrough without a video.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-4 text-base leading-relaxed text-secondary">
              Click through each step. Commands and files stay versioned in git.
            </p>
          </Reveal>
        </div>

        {/* Step tabs */}
        <div className="flex flex-wrap gap-2">
          {steps.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setActive(idx);
                trackEvent('workflow_step_click', { step: s.id });
              }}
              className={cn(
                'relative rounded-full border px-4 py-2 text-sm font-medium transition duration-200 ease-quiet focus-ring',
                idx === active
                  ? 'border-ink bg-ink text-white'
                  : 'border-border bg-white text-secondary hover:border-ink/20 hover:text-ink',
              )}
            >
              <span className="mr-2 text-xs opacity-50">{String(idx + 1).padStart(2, '0')}</span>
              {s.title}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div className="rounded-card border border-border bg-white shadow-hairline overflow-hidden">
          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-hairline bg-panel/50 px-5 py-3">
            <div className="text-sm font-semibold tracking-tightish text-ink">{step.title}</div>
            <div className="text-xs text-muted">{step.caption}</div>
          </div>

          {/* Panel body */}
          <div className="grid gap-4 p-5 md:grid-cols-3">
            {/* Command + Output */}
            <div className="md:col-span-2 space-y-3">
              {/* Command */}
              <div className="rounded-tile border border-border bg-ink px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-white/50 font-mono text-sm">$</span>
                  {reduced ? (
                    <code className="font-mono text-sm text-white">{step.command}</code>
                  ) : (
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.code
                        key={step.id + '-cmd'}
                        className="font-mono text-sm text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {step.command}
                      </motion.code>
                    </AnimatePresence>
                  )}
                </div>
              </div>

              {/* Output */}
              <div className="rounded-tile border border-border bg-panel p-4 min-h-[140px]">
                {reduced ? (
                  <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-secondary">
                    {step.output.join('\n')}
                  </pre>
                ) : (
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.pre
                      key={step.id + '-out'}
                      className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-secondary"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {step.output.join('\n')}
                    </motion.pre>
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* Files sidebar */}
            <div className="md:col-span-1">
              <div className="rounded-tile border border-border bg-white p-4 shadow-hairline h-full">
                <div className="text-xs font-medium tracking-caps text-muted mb-3">Files touched</div>
                {reduced ? (
                  <div className="space-y-2">
                    {step.files.map((f) => (
                      <div
                        key={f}
                        className="rounded-lg border border-hairline bg-panel px-3 py-2 font-mono text-[12px] text-secondary"
                      >
                        {f}
                      </div>
                    ))}
                  </div>
                ) : (
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={step.id + '-files'}
                      className="space-y-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {step.files.map((f) => (
                        <div
                          key={f}
                          className="rounded-lg border border-hairline bg-panel px-3 py-2 font-mono text-[12px] text-secondary"
                        >
                          {f}
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <div className="text-xs text-muted">
          All output maps to versioned files. Review changes in git diff.
        </div>
      </div>
    </Section>
  );
}
