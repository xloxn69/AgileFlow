import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Intentionally minimal: by default this just lands in server logs.
    // Hook this into your analytics provider of choice (Vercel, PostHog, etc).
    // eslint-disable-next-line no-console
    console.log('[agileflow.website.track]', body);
  } catch {
    // ignore malformed payloads
  }

  return new NextResponse(null, { status: 204 });
}

