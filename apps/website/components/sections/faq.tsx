'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useId, useState } from 'react';
import { Container } from '@/components/ui/container';
import type { LandingContent } from '@/lib/landing-content';
import { track } from '@/lib/track';

export function FAQ({ items }: { items: LandingContent['faq'] }) {
  const prefersReducedMotion = useReducedMotion();
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section aria-label="FAQ" className="py-20 sm:py-24 md:py-28">
      <Container>
        <div className="grid gap-10">
          <div className="max-w-[70ch]">
            <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-[var(--text-primary)] sm:text-[32px]">
              {items.heading}
            </h2>
          </div>

          <div className="surface rounded-card shadow-tile">
            <div className="divide-y divide-[var(--border-subtle)]">
              {items.items.map((item, idx) => {
                const isOpen = open === idx;
                const panelId = `${baseId}-${idx}`;
                return (
                  <div key={item.question} className="px-5 py-4">
                    <button
                      type="button"
                      className="focus-ring flex w-full items-start justify-between gap-4 rounded-md py-2 text-left"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => {
                        setOpen((current) => (current === idx ? null : idx));
                        track('faq_toggle', { question: item.question, open: !isOpen });
                      }}
                    >
                      <span className="text-sm font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
                        {item.question}
                      </span>
                      <motion.span
                        aria-hidden="true"
                        animate={prefersReducedMotion ? undefined : { rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="mt-0.5 shrink-0 text-[var(--text-muted)]"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M6 9l6 6 6-6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          id={panelId}
                          initial={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                          animate={prefersReducedMotion ? undefined : { height: 'auto', opacity: 1 }}
                          exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{item.answer}</p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

