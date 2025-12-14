'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

export function BackgroundTexture() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const x = useTransform(scrollY, [0, 1400], [0, 8]);
  const y = useTransform(scrollY, [0, 1400], [0, -8]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-50 overflow-hidden">
      <motion.div className="absolute inset-0 bg-dot-grid" style={prefersReducedMotion ? undefined : { x, y }} />
      <div className="absolute inset-0 bg-noise opacity-[0.06] mix-blend-multiply" />
      <div className="absolute inset-0 bg-vignette" />
    </div>
  );
}

