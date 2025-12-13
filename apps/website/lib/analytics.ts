'use client';

type EventPayload = {
  name: string;
  properties?: Record<string, unknown>;
};

function safeString(value: unknown) {
  if (value == null) return undefined;
  if (typeof value === 'string') return value.slice(0, 200);
  return undefined;
}

export async function trackEvent(name: string, properties?: Record<string, unknown>) {
  const payload: EventPayload = {
    name,
    properties: {
      ...properties,
      path: safeString(typeof window !== 'undefined' ? window.location.pathname : undefined),
      ts: Date.now(),
    },
  };

  const va = (globalThis as unknown as { va?: { track?: (n: string, p?: unknown) => void } }).va;
  if (va?.track) {
    va.track(name, payload.properties);
    return;
  }

  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // best-effort
  }
}

