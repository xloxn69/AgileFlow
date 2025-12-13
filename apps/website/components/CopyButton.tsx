'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';

export function CopyButton({
  label,
  copiedLabel = 'Copied',
  value,
  eventName,
  variant = 'primary',
}: {
  label: string;
  copiedLabel?: string;
  value: string;
  eventName: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant={variant}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        } catch {
          // ignore
        }
        trackEvent(eventName, { value });
      }}
    >
      {copied ? copiedLabel : label}
    </Button>
  );
}

