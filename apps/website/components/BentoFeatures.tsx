'use client';

import { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Pill } from '@/components/ui/Pill';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';
import { LottiePlayer } from '@/components/ui/LottiePlayer';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';
import { LINKS } from '@/lib/links';

type Feature = {
  id: string;
  title: string;
  description: string;
  tag: string;
  lottie: string;
  size: 'large' | 'medium' | 'small';
  modal: {
    body: string[];
    snippet: { lang: string; code: string };
    docsHref: string;
  };
};

function tileSpan(size: Feature['size']) {
  if (size === 'large') return 'lg:col-span-6 lg:row-span-2';
  if (size === 'medium') return 'lg:col-span-6 lg:row-span-1';
  return 'lg:col-span-3 lg:row-span-1';
}

function Snippet({ lang, code }: { lang: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-tile border border-border bg-white shadow-hairline">
      <div className="flex items-center justify-between border-b border-hairline px-4 py-2 text-xs text-muted">
        <span className="font-medium tracking-caps">snippet</span>
        <span className="font-mono text-[12px] text-secondary">{lang}</span>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-relaxed text-ink">
        <code className="font-mono">{code.trimEnd()}</code>
      </pre>
    </div>
  );
}

export function BentoFeatures() {
  const features = useMemo<Feature[]>(
    () => [
      {
        id: 'epics-to-stories',
        title: 'Epics → Stories → AC',
        description: 'Turn ideas into testable increments.',
        tag: 'Planning',
        lottie: '/lottie/kanban-to-markdown.json',
        size: 'large',
        modal: {
          body: [
            'Start from an epic.',
            'Break it into stories.',
            'Write acceptance criteria in a predictable format.',
            'Keep planning artifacts as markdown.',
            'Review and refine via code review.',
            'Generate structure—not prose.',
          ],
          snippet: {
            lang: 'md',
            code: [
              '# Story: Setup scaffold',
              '',
              '## Acceptance criteria',
              '- Given a repo without AgileFlow',
              '- When I run `npx agileflow setup`',
              '- Then docs/ and agent configs are created',
            ].join('\n'),
          },
          docsHref: LINKS.docs,
        },
      },
      {
        id: 'adrs',
        title: 'ADRs that actually get written',
        description: 'Stop re-deciding the same architecture.',
        tag: 'Docs',
        lottie: '/lottie/adr-decision.json',
        size: 'medium',
        modal: {
          body: [
            'Record decisions while context is fresh.',
            'Use a consistent template.',
            'Capture alternatives as options.',
            'Collapse to the chosen path.',
            'Link the decision to the work.',
            'Keep history searchable in git.',
          ],
          snippet: {
            lang: 'md',
            code: [
              '# ADR: Verification harness',
              '',
              '## Decision',
              'Adopt a baseline + re-run verification policy in CI.',
            ].join('\n'),
          },
          docsHref: LINKS.docs,
        },
      },
      {
        id: 'docs-structure',
        title: 'Docs-as-code structure',
        description: 'Your process becomes readable.',
        tag: 'Docs',
        lottie: '/lottie/docs-tree-growth.json',
        size: 'medium',
        modal: {
          body: [
            'Scaffold a docs tree that matches how teams work.',
            'Keep files durable and diffable.',
            'Refactor structure as the project evolves.',
            'Avoid hidden state in a web UI.',
            'Ship conventions as versioned files.',
            'Make the process readable for humans and agents.',
          ],
          snippet: {
            lang: 'text',
            code: ['docs/00-meta', 'docs/01-process', 'docs/03-stories', 'docs/04-adrs', 'docs/09-agents'].join(
              '\n',
            ),
          },
          docsHref: LINKS.docs,
        },
      },
      {
        id: 'message-bus',
        title: 'Multi-agent message bus',
        description: 'Separate contexts, one shared truth.',
        tag: 'Agents',
        lottie: '/lottie/message-bus-pulse.json',
        size: 'small',
        modal: {
          body: [
            'Run specialized agents in parallel.',
            'Keep contexts separated by role.',
            'Emit events into a log stream.',
            'Audit what changed and why.',
            'Ground shared facts in files.',
            'Avoid scattered chat-only history.',
          ],
          snippet: {
            lang: 'jsonl',
            code: ['{"agent":"planner","event":"story.created"}', '{"agent":"tester","event":"baseline.verified"}'].join(
              '\n',
            ),
          },
          docsHref: LINKS.docs,
        },
      },
      {
        id: 'velocity',
        title: 'Sprint planning with velocity',
        description: 'Plan with data, not vibes.',
        tag: 'Planning',
        lottie: '/lottie/velocity-planning.json',
        size: 'small',
        modal: {
          body: [
            'Use throughput to set expectations.',
            'Avoid over-committing.',
            'Make WIP limits explicit.',
            'Track scope changes in files.',
            'Keep plans repeatable across repos.',
            'Use the repo as the source of truth.',
          ],
          snippet: { lang: 'bash', code: 'agileflow sprint plan --capacity 24' },
          docsHref: LINKS.docs,
        },
      },
      {
        id: 'verification',
        title: 'CI + verification harness',
        description: 'No broken baselines.',
        tag: 'CI',
        lottie: '/lottie/verification.json',
        size: 'small',
        modal: {
          body: [
            'Treat verification as a first-class artifact.',
            'Record a baseline for expected behavior.',
            'Move status from not_run → passing.',
            'Keep CI outcomes versioned and visible.',
            'Make AI changes measurable.',
            'Keep baselines clean over time.',
          ],
          snippet: { lang: 'bash', code: 'agileflow verify --baseline create' },
          docsHref: LINKS.docs,
        },
      },
    ],
    [],
  );

  const [active, setActive] = useState<Feature | null>(null);

  return (
    <Section id="features">
      <div className="flex flex-col gap-10">
        <div className="max-w-2xl">
          <Reveal>
            <Pill>Core features</Pill>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 text-2xl font-semibold tracking-tightish text-ink sm:text-3xl">
              Bento blocks that behave like a system.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-4 text-base leading-relaxed text-secondary">
              Modular tiles, quiet motion, and micro-demos—each one maps to versioned files and repeatable commands.
            </p>
          </Reveal>
        </div>

        <div
          className={cn(
            'grid auto-rows-[180px] gap-4',
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-12',
          )}
        >
          {features.map((feature, idx) => (
            <Reveal key={feature.id} delay={0.04 * Math.min(idx, 6)}>
              <button
                type="button"
                className={cn(
                  'group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-card border border-border bg-white p-5 text-left shadow-hairline transition duration-200 ease-quiet focus-ring',
                  'hover:-translate-y-0.5 hover:border-black/20 hover:shadow-tileHover',
                  tileSpan(feature.size),
                )}
                onClick={() => {
                  setActive(feature);
                  trackEvent('feature_modal_open', { feature: feature.id });
                }}
              >
                <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.35] texture-grid" />
                <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.08] texture-noise" />

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2">
                      <span className="text-sm font-semibold tracking-tightish text-ink">
                        {feature.title}
                      </span>
                      <span className="rounded-full border border-border bg-white px-2 py-0.5 text-[11px] font-medium tracking-caps text-muted">
                        {feature.tag}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-secondary">{feature.description}</div>
                  </div>
                  <span className="text-xs text-muted transition group-hover:text-secondary">
                    Open
                  </span>
                </div>

                <div className="relative mt-5 flex flex-1 items-end">
                  <LottiePlayer
                    src={feature.lottie}
                    className={cn(
                      'w-full',
                      feature.size === 'large'
                        ? 'h-56 sm:h-60'
                        : feature.size === 'medium'
                          ? 'h-40'
                          : 'h-28',
                    )}
                    poster={
                      <div className="h-12 w-12 rounded-xl border border-border bg-white shadow-hairline" />
                    }
                  />
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        title={active?.title ?? 'Feature'}
      >
        {active ? (
          <div className="grid gap-4">
            <div className="text-sm leading-relaxed text-secondary">
              {active.modal.body.map((line) => (
                <p key={line} className="mb-2 last:mb-0">
                  {line}
                </p>
              ))}
            </div>
            <Snippet lang={active.modal.snippet.lang} code={active.modal.snippet.code} />
            <div className="flex flex-wrap gap-2">
              <Button
                href={active.modal.docsHref}
                variant="secondary"
                target="_blank"
                rel="noreferrer"
                eventName="feature_docs_click"
                eventProps={{ feature: active.id }}
              >
                Read docs <ExternalLink className="h-4 w-4" />
              </Button>
              <Button variant="ghost" onClick={() => setActive(null)}>
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </Section>
  );
}
