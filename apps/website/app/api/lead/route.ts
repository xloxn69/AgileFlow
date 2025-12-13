import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // eslint-disable-next-line no-console
    console.log('[agileflow.website.lead]', body);
  } catch {
    // ignore
  }
  return NextResponse.json({ ok: true });
}

