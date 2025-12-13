'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

const THRESHOLDS = [25, 50, 75, 100] as const;

export function ScrollDepthTracker() {
  const sentRef = useRef(new Set<number>());

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrollTop = window.scrollY || doc.scrollTop || 0;
        const scrollHeight = doc.scrollHeight - doc.clientHeight;
        const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        for (const t of THRESHOLDS) {
          if (percent >= t && !sentRef.current.has(t)) {
            sentRef.current.add(t);
            trackEvent('scroll_depth', { percent: t });
          }
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}

