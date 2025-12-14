'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { CountUp } from '@/components/ui/count-up';
import type { Stat } from '@/lib/landing-content';

export function StatsStrip({ stats }: { stats: Stat[] }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section aria-label="AgileFlow stats" className="py-10">
      <Container>
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-50px' }}
          className="surface rounded-card shadow-tile"
        >
          <div className="grid grid-cols-2 divide-x divide-y divide-[var(--border-subtle)] sm:grid-cols-4 sm:divide-y-0">
            {stats.map((stat) => (
              <div key={stat.label} className="px-5 py-4">
                <div className="text-[28px] font-semibold leading-none tracking-[-0.02em] text-[var(--text-primary)]">
                  <CountUp value={stat.value} />
                </div>
                <div className="mt-2 text-xs font-medium tracking-wide text-[var(--text-muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

