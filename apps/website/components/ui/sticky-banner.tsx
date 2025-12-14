'use client';

import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/cn';

interface StickyBannerProps {
  className?: string;
  children: React.ReactNode;
  hideOnScroll?: boolean;
  onClose?: () => void;
}

export function StickyBanner({ className, children, hideOnScroll = false, onClose }: StickyBannerProps) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [closed, setClosed] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (hideOnScroll && !closed) {
      setHidden(latest > 40);
    }
  });

  const handleClose = () => {
    setHidden(true);
    setTimeout(() => {
      setClosed(true);
      onClose?.();
    }, 300);
  };

  if (closed) return null;

  return (
    <motion.div
      className={cn(
        'sticky top-0 z-50 flex items-center justify-center px-4 py-3 text-center text-sm',
        className,
      )}
      initial={{ y: 0 }}
      animate={{ y: hidden ? '-100%' : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="flex w-full items-center justify-center gap-4">
        <div className="flex-1">{children}</div>
        <button
          onClick={handleClose}
          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close banner"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
