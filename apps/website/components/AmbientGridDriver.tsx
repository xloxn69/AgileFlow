'use client';

import { useEffect } from 'react';

export function AmbientGridDriver() {
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (media?.matches) return;

    let raf = 0;
    const update = () => {
      const y = window.scrollY || 0;
      const x = 0;
      const offsetX = `${Math.round(x * 0.02)}px`;
      const offsetY = `${Math.round(y * -0.03)}px`;
      document.documentElement.style.setProperty('--grid-x', offsetX);
      document.documentElement.style.setProperty('--grid-y', offsetY);
      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}

