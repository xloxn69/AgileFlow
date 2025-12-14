'use client';

import { useMotionValueEvent, useScroll } from 'framer-motion';
import { useRef } from 'react';
import { track } from '@/lib/track';

const thresholds = [25, 50, 75, 100] as const;

export function ScrollDepthTracker() {
  const { scrollYProgress } = useScroll();
  const seen = useRef<Set<number>>(new Set());

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const percent = Math.round(value * 100);
    for (const threshold of thresholds) {
      if (percent >= threshold && !seen.current.has(threshold)) {
        seen.current.add(threshold);
        track('scroll_depth', { depth: threshold });
      }
    }
  });

  return null;
}

