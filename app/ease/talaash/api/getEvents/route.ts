import { NextResponse } from 'next/server';

// Fetch from jaayvee-world (talaash) events API
const BASE = process.env.JAAYVEE_WORLD_API_BASE || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://talaash.thejaayveeworld.com';
const ENDPOINT = process.env.JAAYVEE_WORLD_EVENTS_ENDPOINT || '/api/events';

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
      console.warn(`Failed to fetch from ${remoteUrl.toString()}: ${res.status}`);
      return NextResponse.json({ events: [], error: 'REMOTE_FAILED' }, { status: 200 });
    }

    const payload = await res.json().catch(() => ({} as any));

    // Accept common shapes: { events: [...] }, { data: [...] }, or [...]
    // jaayvee-world returns { success: true, data: [...] }
    const raw: any[] =
      Array.isArray(payload) ? payload :
      Array.isArray(payload?.events) ? payload.events :
      Array.isArray(payload?.data) ? payload.data : [];

    const events = raw.map((e: any, i: number) => {
      // Handle venue object - extract name or format as string
      let venue = null;
      if (e.venue) {
        if (typeof e.venue === 'string') {
          venue = e.venue;
        } else if (typeof e.venue === 'object' && e.venue.name) {
          venue = e.venue.name;
        } else if (typeof e.venue === 'object') {
          // Format venue object as readable string
          const parts = [];
          if (e.venue.name) parts.push(e.venue.name);
          if (e.venue.city) parts.push(e.venue.city);
          if (e.venue.state) parts.push(e.venue.state);
          venue = parts.join(', ');
        }
      } else if (e.venueName) {
        venue = e.venueName;
      } else if (e.location) {
        venue = e.location;
      }

      return {
        id: e.id ?? e.eventId ?? i,
        title: e.title ?? e.name ?? 'Untitled Event',
        startDate: e.startDate ?? e.startsAt ?? e.start_time ?? e.start ?? e.date ?? null,
        endDate: e.endDate ?? e.endsAt ?? e.end_time ?? e.end ?? null,
        bannerUrl: e.bannerUrl ?? e.banner ?? e.imageUrl ?? e.cover ?? null, // jaayvee-world uses 'banner'
        venue: venue,
        slug: e.slug ?? e.eventSlug ?? e.urlSlug ?? null,
      };
    }).filter(x => x.startDate);

    return NextResponse.json({ events });
  } catch {
    return NextResponse.json({ events: [], error: 'UNEXPECTED' }, { status: 200 });
  }
}
