'use client';

import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Container } from '@/components/ui/container';
import type { LandingContent } from '@/lib/landing-content';
import { cn } from '@/lib/cn';
import { track } from '@/lib/track';

const GAP = 16;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function initials(name: string) {
  const cleaned = name.replace(/^@/, '').trim();
  if (!cleaned) return 'AF';
  const parts = cleaned.split(/\s+/).slice(0, 2);
  return parts.map((p) => p.slice(0, 1).toUpperCase()).join('');
}

export function Testimonials({ content }: { content: LandingContent['testimonials'] }) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const x = useMotionValue(0);

  const items = content.items;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContainerWidth(el.getBoundingClientRect().width));
    ro.observe(el);
    setContainerWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const cardWidth = useMemo(() => {
    if (!containerWidth) return 360;
    return Math.min(440, Math.floor(containerWidth * 0.82));
  }, [containerWidth]);

  const trackWidth = useMemo(() => items.length * cardWidth + (items.length - 1) * GAP, [cardWidth, items.length]);
  const maxDrag = Math.max(0, trackWidth - containerWidth);

  useEffect(() => {
    const target = -(cardWidth + GAP) * index;
    if (prefersReducedMotion) {
      x.set(target);
      return;
    }
    animate(x, target, { duration: 0.32, ease: 'easeOut' });
  }, [cardWidth, index, prefersReducedMotion, x]);

  return (
    <section id="testimonials" className="scroll-mt-24 py-20 sm:py-24 md:py-28">
      <Container>
        <div className="grid gap-10">
          <div className="max-w-[70ch]">
            <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-[var(--text-primary)] sm:text-[32px]">
              {content.heading}
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-[var(--text-secondary)]">{content.subhead}</p>
          </div>

          <div className="surface rounded-card shadow-tile">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] px-5 py-4">
              <div className="text-xs font-medium tracking-wide text-[var(--text-secondary)]">Developer notes</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-white/60 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  aria-label="Previous testimonial"
                  onClick={() => {
                    setIndex((v) => clamp(v - 1, 0, items.length - 1));
                    track('testimonial_prev');
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M15 18l-6-6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-white/60 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  aria-label="Next testimonial"
                  onClick={() => {
                    setIndex((v) => clamp(v + 1, 0, items.length - 1));
                    track('testimonial_next');
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M9 18l6-6-6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-5 py-6">
              <div
                ref={containerRef}
                tabIndex={0}
                className="focus-ring relative overflow-hidden rounded-card outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'ArrowLeft') setIndex((v) => clamp(v - 1, 0, items.length - 1));
                  if (e.key === 'ArrowRight') setIndex((v) => clamp(v + 1, 0, items.length - 1));
                }}
              >
                <motion.div
                  className="flex"
                  style={{ x, gap: `${GAP}px` }}
                  drag={prefersReducedMotion ? false : 'x'}
                  dragConstraints={{ left: -maxDrag, right: 0 }}
                  dragElastic={0.08}
                  onDragStart={() => track('testimonial_drag_start')}
                  onDragEnd={() => {
                    const raw = Math.round(-x.get() / (cardWidth + GAP));
                    const next = clamp(raw, 0, items.length - 1);
                    setIndex(next);
                    track('testimonial_drag_end', { index: next });
                  }}
                >
                  {items.map((item, i) => {
                    const active = i === index;
                    return (
                      <motion.div
                        key={item.kind === 'quote' ? item.quote : item.title}
                        className={cn('shrink-0')}
                        style={{ width: cardWidth }}
                        animate={
                          prefersReducedMotion
                            ? undefined
                            : { opacity: active ? 1 : 0.7, scale: active ? 1 : 0.98 }
                        }
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        {item.kind === 'quote' ? (
                          <div className="surface-opaque rounded-card p-6 shadow-tile">
                            <p className="text-[15px] leading-7 text-[var(--text-primary)]">“{item.quote}”</p>
                            <div className="mt-6 flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--bg-secondary)] font-mono text-xs text-[var(--text-muted)]">
                                {initials(item.name)}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
                                  {item.name}
                                </div>
                                <div className="text-xs font-medium tracking-wide text-[var(--text-muted)]">
                                  {item.role}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="surface-opaque rounded-card p-6 shadow-tile">
                            <div className="text-sm font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
                              {item.title}
                            </div>
                            <div className="mt-4 rounded-card border border-[var(--border-default)] bg-[var(--bg-code)] p-4">
                              <div className="code-shiki text-sm" dangerouslySetInnerHTML={{ __html: item.html }} />
                            </div>
                            <div className="mt-4 text-xs font-medium tracking-wide text-[var(--text-muted)]">
                              {item.caption}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={cn(
                      'focus-ring h-10 w-10 rounded-full border text-xs',
                      i === index
                        ? 'border-[var(--border-default)] bg-white text-[var(--text-primary)]'
                        : 'border-[var(--border-subtle)] bg-white/60 text-[var(--text-muted)] hover:text-[var(--text-primary)]',
                    )}
                    aria-label={`Go to testimonial ${i + 1}`}
                    onClick={() => {
                      setIndex(i);
                      track('testimonial_dot', { index: i });
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
