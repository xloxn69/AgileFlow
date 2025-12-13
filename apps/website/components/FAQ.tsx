'use client';

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Section } from '@/components/ui/Section';
import { Pill } from '@/components/ui/Pill';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';
import { trackEvent } from '@/lib/analytics';
import { usePrefersReducedMotion } from '@/lib/reducedMotion';

type QA = { q: string; a: string };

export function FAQ() {
  const reduced = usePrefersReducedMotion();
  const items = useMemo<QA[]>(
    () => [
      {
        q: 'Does this replace Jira?',
        a: 'It complements or replaces trackers depending on your team. AgileFlow keeps planning + decision records in the repo so work stays traceable in git.',
      },
      {
        q: 'What if my team uses a different framework?',
        a: 'AgileFlow is framework-agnostic. The core output is versioned markdown and config files, not a UI tied to a stack.',
      },
      {
        q: 'Does it work without Claude?',
        a: 'Yes. The workflow scaffolding and documentation system stands on its own; AI integrations enhance generation and automation.',
      },
      {
        q: 'How does it handle token/context limits?',
        a: 'It keeps key context in files and can compress or summarize sections into durable docs so agents don’t rely on a single long chat history.',
      },
    ],
    [],
  );

  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" alternate>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <Reveal>
            <Pill>FAQ</Pill>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 text-2xl font-semibold tracking-tightish text-ink sm:text-3xl">
              Common questions.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-4 text-base leading-relaxed text-secondary">
              Short answers, written for teams who want durable process and clean diffs.
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <div className="grid gap-3">
            {items.map((item, idx) => {
              const expanded = open === idx;
              const contentId = `faq-${idx}`;
              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-card border border-border bg-white shadow-hairline"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-ring"
                    aria-expanded={expanded}
                    aria-controls={contentId}
                    onClick={() => {
                      setOpen(expanded ? null : idx);
                      trackEvent('faq_toggle', { index: idx, open: !expanded });
                    }}
                  >
                    <span className="text-sm font-semibold tracking-tightish text-ink">{item.q}</span>
                    <motion.span
                      className="text-muted"
                      animate={{ rotate: expanded ? 180 : 0 }}
                      transition={{ duration: reduced ? 0 : 0.12, ease: 'easeOut' }}
                      aria-hidden
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {expanded ? (
                      <motion.div
                        id={contentId}
                        key="content"
                        initial={reduced ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={reduced ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                        transition={{ duration: reduced ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className={cn('px-5 pb-5')}
                      >
                        <p className="text-sm leading-relaxed text-secondary">{item.a}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
