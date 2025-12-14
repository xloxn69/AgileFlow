'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { track } from '@/lib/track';

async function copyToClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {}

  try {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {}

  return false;
}

export function CommandButton({
  command,
  eventName,
  className,
  label = 'Copy command',
}: {
  command: string;
  eventName: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const hintId = useId();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <button
      type="button"
      className={cn(
        'focus-ring group relative flex w-full items-center gap-3 rounded-card border border-[var(--border-default)] bg-[var(--bg-code)] px-4 py-3 text-left shadow-tile',
        'transition-shadow hover:shadow-tileHover',
        className,
      )}
      aria-label={label}
      aria-describedby={hintId}
      onClick={async () => {
        const ok = await copyToClipboard(command);
        track(eventName, { command, ok });
        setCopied(ok);
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setCopied(false), 1200);
      }}
    >
      <code className="text-sm text-[var(--text-primary)] md:text-[14px]">{command}</code>
      <span className="ml-auto text-xs font-medium tracking-wide text-[var(--text-muted)]">
        {copied ? 'Copied' : 'Copy'}
      </span>
      <span id={hintId} className="sr-only">
        Copies the command to your clipboard
      </span>
    </button>
  );
}

