'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { Section } from '@/components/ui/Section';
import { Pill } from '@/components/ui/Pill';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';
import { trackEvent } from '@/lib/analytics';

type Testimonial = {
  id: string;
  quote: string;
  person: string;
  meta: string;
  avatar: string;
};

export function TestimonialsCarousel() {
  const reduced = useReducedMotion();
  const testimonials = useMemo<Testimonial[]>(
    () => [
      {
        id: 'lead',
        quote:
          '“We finally have a repeatable repo workflow: stories, ADRs, and verification artifacts stay diffable and reviewable.”',
        person: 'E. Tan',
        meta: 'Tech lead • infra-heavy team',
        avatar: 'ET',
      },
      {
        id: 'solo',
        quote:
          '“It feels like a quiet system. I can ask an agent to implement a story and the trace is still in git.”',
        person: 'mari.codes',
        meta: 'Solo dev • Cursor',
        avatar: 'MC',
      },
      {
        id: 'diff',
        quote:
          '“Before: TODOs everywhere. After: versioned workflow.”\n\n- docs/03-stories/story-01.md\n+ docs/04-adrs/adr-0007.md',
        person: 'repo-diff',
        meta: 'Tiny proof • what changed',
        avatar: 'Δ',
      },
      {
        id: 'devops',
        quote:
          '“The verification harness is the point. We can measure AI changes and keep baselines clean in CI.”',
        person: 'S. Nguyen',
        meta: 'DevOps-minded builder',
        avatar: 'SN',
      },
    ],
    [],
  );

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.intersectionRatio < b.intersectionRatio ? 1 : -1))[0];
        if (!best) return;
        const idx = Number((best.target as HTMLElement).dataset.index ?? '0');
        setActive(idx);
      },
      { root: scroller, threshold: [0.5, 0.6, 0.7, 0.8] },
    );

    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasInteracted || reduced) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const interval = window.setInterval(() => {
      const next = (active + 1) % testimonials.length;
      cardRefs.current[next]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }, 9000);
    return () => window.clearInterval(interval);
  }, [active, hasInteracted, reduced, testimonials.length]);

  const go = (idx: number, reason: string) => {
    setHasInteracted(true);
    cardRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    trackEvent('carousel_navigate', { to: idx, reason });
  };

  return (
    <Section id="testimonials" alternate>
      <div className="grid gap-10">
        <div className="max-w-2xl">
          <Reveal>
            <Pill>Testimonials</Pill>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 text-2xl font-semibold tracking-tightish text-ink sm:text-3xl">
              Credibility, quietly.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-4 text-base leading-relaxed text-secondary">
              A few notes from builders who prefer structure, traceability, and repeatable systems.
            </p>
          </Reveal>
        </div>

        <div className="relative">
          <div className="absolute right-0 top-0 z-10 flex items-center gap-2">
            <button
              type="button"
              className="rounded-full border border-border bg-white p-2 text-secondary shadow-hairline transition hover:bg-black/[0.03] focus-ring"
              onClick={() => go(Math.max(active - 1, 0), 'prev')}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded-full border border-border bg-white p-2 text-secondary shadow-hairline transition hover:bg-black/[0.03] focus-ring"
              onClick={() => go(Math.min(active + 1, testimonials.length - 1), 'next')}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pr-10 pt-2 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onPointerDown={() => {
              setHasInteracted(true);
              trackEvent('carousel_interaction', { type: 'drag' });
            }}
          >
            {testimonials.map((t, idx) => (
              <div
                key={t.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                data-index={idx}
                className={cn(
                  'snap-start',
                  'min-w-[88%] sm:min-w-[78%] lg:min-w-[70%] xl:min-w-[64%]',
                  'rounded-card border border-border bg-white p-6 shadow-hairline transition duration-200 ease-quiet',
                  idx === active ? 'scale-[1.00]' : 'scale-[0.98] opacity-[0.92]',
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-panel text-xs font-semibold text-secondary">
                    {t.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-ink">{t.quote}</p>
                    <div className="mt-4 flex flex-col gap-0.5">
                      <div className="text-sm font-semibold tracking-tightish text-ink">{t.person}</div>
                      <div className="text-xs text-muted">{t.meta}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-2">
            {testimonials.map((t, idx) => (
              <button
                key={t.id}
                type="button"
                className={cn(
                  'h-2 w-2 rounded-full border border-border transition focus-ring',
                  idx === active ? 'bg-ink' : 'bg-white',
                )}
                aria-label={`Go to testimonial ${idx + 1}`}
                onClick={() => go(idx, 'dot')}
              />
            ))}
            <div className="ml-2 text-xs text-muted">Autoplay starts after interaction.</div>
          </div>
        </div>
      </div>
    </Section>
  );
}
