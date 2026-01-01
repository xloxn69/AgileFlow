'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/cn';

interface StickyBannerProps {
  className?: string;
  children: React.ReactNode;
  storageKey?: string;
}

export function StickyBanner({
  className,
  children,
  storageKey = 'agileflow-banner-dismissed',
}: StickyBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if banner was dismissed
    const dismissed = localStorage.getItem(storageKey);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, [storageKey]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(storageKey, 'true');
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'relative z-50 flex items-center justify-center gap-4 px-4 py-2.5 text-center text-sm',
        className,
      )}
    >
      <div className="flex-1">{children}</div>
      <button
        onClick={handleDismiss}
        className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Dismiss banner"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
