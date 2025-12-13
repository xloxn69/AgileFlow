'use client';

import { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

function getFocusable(container: HTMLElement) {
  const elements = container.querySelectorAll<HTMLElement>(
    [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(','),
  );
  return Array.from(elements).filter((el) => !el.hasAttribute('disabled'));
}

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const titleId = useMemo(() => `modal-${Math.random().toString(36).slice(2)}`, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const overlayEl = overlayRef.current;
    if (!overlayEl) return;

    const focusables = getFocusable(overlayEl);
    focusables[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const overlayNow = overlayRef.current;
      if (!overlayNow) return;
      const nodes = getFocusable(overlayNow);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === first || !overlayNow.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onMouseDown={(e) => {
          e.preventDefault();
          onClose();
        }}
        aria-hidden
      />
      <div
        className={cn(
          'relative w-full max-w-2xl overflow-hidden rounded-card border border-border bg-white shadow-tileHover',
        )}
      >
        <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
          <h3 id={titleId} className="text-base font-semibold tracking-tightish">
            {title}
          </h3>
          <button
            type="button"
            className="rounded-full p-2 text-secondary transition hover:bg-black/[0.03] focus-ring"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
