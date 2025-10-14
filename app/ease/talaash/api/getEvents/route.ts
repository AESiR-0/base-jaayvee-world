import { NextResponse } from 'next/server';

const BASE = process.env.TALAASH_API_BASE || 'https://talaash.thejaayveeworld.com';
const ENDPOINT = process.env.TALAASH_EVENTS_ENDPOINT || '/api/getRecentEvents';

/**
 * Proxies Talaash events API and normalizes the payload:
 * { events: Array<{ id, title, startDate, endDate?, bannerUrl?, venue? }> }
 * If a "ref" cookie exists, forward it as ?ref=... (harmless if unused).
 */
export async function GET(req: Request) {
  try {
    const refCookie = (req.headers.get('cookie') || '')
      .split('; ')
      .find(x => x.startsWith('ref='))?.split('=')[1];

    const remoteUrl = new URL(ENDPOINT, BASE);
    if (refCookie) remoteUrl.searchParams.set('ref', refCookie);

    const res = await fetch(remoteUrl.toString(), {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });

    if (!res.ok) {
      return NextResponse.json({ events: [], error: 'REMOTE_FAILED' }, { status: 200 });
    }

    const payload = await res.json().catch(() => ({} as any));

    // Accept common shapes: { events: [...] }, { data: [...] }, or [...]
    const raw: any[] =
      Array.isArray(payload) ? payload :
      Array.isArray(payload?.events) ? payload.events :
      Array.isArray(payload?.data) ? payload.data : [];

    const events = raw.map((e: any, i: number) => ({
      id: e.id ?? e.eventId ?? i,
      title: e.title ?? e.name ?? 'Untitled Event',
      startDate: e.startDate ?? e.startsAt ?? e.start_time ?? e.start ?? e.date ?? null,
      endDate: e.endDate ?? e.endsAt ?? e.end_time ?? e.end ?? null,
      bannerUrl: e.bannerUrl ?? e.banner ?? e.imageUrl ?? e.cover ?? null,
      venue: e.venue ?? e.venueName ?? e.location ?? null,
    })).filter(x => x.startDate);

    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ events: [], error: 'UNEXPECTED' }, { status: 200 });
  }
}
