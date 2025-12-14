export type TrackProperties = Record<string, unknown>;

export function track(event: string, properties?: TrackProperties) {
  if (typeof window === 'undefined') return;

  const payload = {
    event,
    properties: properties ?? {},
    ts: Date.now(),
    path: window.location.pathname,
  };

  try {
    const ok = window.navigator.sendBeacon(
      '/api/track',
      new Blob([JSON.stringify(payload)], { type: 'application/json' }),
    );
    if (ok) return;
  } catch {}

  void fetch('/api/track', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

