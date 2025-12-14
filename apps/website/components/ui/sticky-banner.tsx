'use client';

import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/cn';

interface StickyBannerProps {
  className?: string;
  children: React.ReactNode;
  hideOnScroll?: boolean;
}

export function StickyBanner({ className, children, hideOnScroll = false }: StickyBannerProps) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (hideOnScroll) {
      setHidden(latest > 40);
    }
  });

  return (
    <motion.div
      className={cn(
        'sticky top-0 z-50 flex items-center justify-center px-4 py-3 text-center text-sm',
        className,
      )}
      initial={{ y: 0 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}
