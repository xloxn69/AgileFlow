'use client';

import { animate, useInView, useMotionValue, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { MOTION } from '@/lib/motion';

export function CountUp({ value, className }: { value: number; className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const mv = useMotionValue(0);
  const [current, setCurrent] = useState(0);

  useMotionValueEvent(mv, 'change', (latest) => setCurrent(Math.round(latest)));

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) {
      setCurrent(value);
      return;
    }

    const controls = animate(mv, value, { duration: 0.55, ease: MOTION.reveal.ease });
    return () => controls.stop();
  }, [inView, mv, prefersReducedMotion, value]);

  return (
    <span ref={ref} className={cn('font-mono tabular-nums', className)}>
      {prefersReducedMotion ? value : current}
    </span>
  );
}
