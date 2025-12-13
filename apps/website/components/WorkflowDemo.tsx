'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
  panel: {
    header: string;
    lines: string[];
    side?: string[];
  };
};

export function WorkflowDemo() {
  const steps = useMemo<Step[]>(
    () => [
      {
        id: 'setup',
        title: 'Setup',
        caption: 'Scaffold docs + IDE config',
        panel: {
          header: 'Scaffold',
          lines: [
            'npx agileflow setup',
            '',
            'created docs/00-meta/',
            'created docs/03-stories/',
            'created docs/04-adrs/',
            'created docs/09-agents/',
          ],
          side: ['.cursor/rules/agileflow.md', '.windsurf/agents.json', '.claude/commands/agileflow.yml'],
        },
      },
      {
        id: 'plan',
        title: 'Plan',
        caption: 'Epic → stories → AC',
        panel: {
          header: 'Plan',
          lines: [
            'agileflow epic create "Repo-native delivery"',
            'agileflow story create --epic 01 --count 6',
            '',
            'generated docs/03-stories/story-01.md',
            'generated docs/03-stories/story-02.md',
          ],
        },
      },
      {
        id: 'implement',
        title: 'Implement',
        caption: 'Assign agents + track changes',
        panel: {
          header: 'Implement',
          lines: [
            'agileflow agent assign --story story-02 --agent "refactorer"',
            '',
            'agent: refactorer',
            'context: docs/03-stories/story-02.md',
            'output: git diff + notes',
          ],
        },
      },
      {
        id: 'verify',
        title: 'Verify',
        caption: 'Baseline + passing state',
        panel: {
          header: 'Verify',
          lines: [
            'agileflow verify --baseline create',
            '',
            'status: not_run → passing',
            'baseline: v1 recorded',
            'ci: green',
          ],
        },
      },
      {
        id: 'ship',
        title: 'Ship',
        caption: 'PR description generated',
        panel: {
          header: 'Ship',
          lines: [
            'agileflow pr generate',
            '',
            'summary: structured change log',
            'risk: notes + rollback path',
            'ready: open PR',
          ],
        },
      },
    ],
    [],
  );

  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const nodes = sentinelRefs.current.filter(Boolean) as HTMLDivElement[];
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1))[0];
        if (!visible) return;
        const idx = Number((visible.target as HTMLElement).dataset.index ?? '0');
        setActive(idx);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 },
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  const step = steps[active] ?? steps[0]!;

  return (
    <Section id="workflow" alternate>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <Reveal>
            <Pill>Workflow demo</Pill>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 text-2xl font-semibold tracking-tightish text-ink sm:text-3xl">
              A walkthrough without a video.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-4 text-base leading-relaxed text-secondary">
              Scroll to see the panel update. Each step maps to commands and files you can review in git.
            </p>
          </Reveal>

          <div className="mt-8">
            <div className="lg:sticky lg:top-24">
              <ol className="relative grid gap-2">
                {steps.map((s, idx) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      className={cn(
                        'relative w-full rounded-tile border px-4 py-3 text-left shadow-hairline transition duration-200 ease-quiet focus-ring',
                        idx === active
                          ? 'border-border bg-white text-ink'
                          : 'border-hairline bg-white/70 text-secondary hover:bg-white hover:text-ink',
                      )}
                      onClick={() => {
                        trackEvent('workflow_step_click', { step: s.id });
                        sentinelRefs.current[idx]?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
                      }}
                      aria-current={idx === active ? 'step' : undefined}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold tracking-tightish">{s.title}</div>
                        <div className="text-xs font-medium tracking-caps text-muted">
                          {String(idx + 1).padStart(2, '0')}
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-muted">{s.caption}</div>
                      {idx === active && !reduced ? (
                        <motion.div
                          layoutId="workflow-underline"
                          className="absolute inset-x-4 bottom-0 h-px bg-black/30"
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        />
                      ) : null}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="relative">
            {steps.map((s, idx) => (
              <div
                key={s.id}
                ref={(el) => {
                  sentinelRefs.current[idx] = el;
                }}
                data-index={idx}
                className="h-24 lg:h-40"
                aria-hidden
              />
            ))}

            <div className="lg:sticky lg:top-24">
              <div className="rounded-card border border-border bg-white shadow-hairline">
                <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
                  <div className="text-sm font-semibold tracking-tightish text-ink">{step.panel.header}</div>
                  <div className="text-xs font-medium tracking-caps text-muted">
                    {steps[active]?.title}
                  </div>
                </div>

                <div className="grid gap-4 p-5 lg:grid-cols-12">
                  <div className="lg:col-span-8">
                    <div className="rounded-tile border border-border bg-panel p-4">
                      {reduced ? (
                        <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-ink">
                          {step.panel.lines.join('\n')}
                        </pre>
                      ) : (
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.pre
                            key={step.id}
                            className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-ink"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          >
                            {step.panel.lines.join('\n')}
                          </motion.pre>
                        </AnimatePresence>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="rounded-tile border border-border bg-white p-4 shadow-hairline">
                      <div className="text-xs font-medium tracking-caps text-muted">files</div>
                      <div className="mt-3 space-y-2 font-mono text-[12px] text-secondary">
                        {(step.panel.side ?? ['docs/03-stories/', 'docs/04-adrs/', 'docs/09-agents/']).map((l) => (
                          <div key={l} className="rounded-full border border-hairline bg-white px-3 py-2">
                            {l}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-muted">
                Crossfades update in ~250ms. Reduced motion disables scroll-driven animation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
