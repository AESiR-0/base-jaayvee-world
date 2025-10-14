'use client';

import { useEffect, useState } from 'react';
import { initializeReferralTracking, getReferralForApi, generateReferralUrl } from '@/lib/referral';

export const dynamic = 'force-dynamic';

type Event = {
  id: number | string;
  title: string;
  startDate: string;
  endDate?: string | null;
  bannerUrl?: string | null;
  venue?: string | null;
  slug?: string | null;
};

const dummyEvents: Event[] = [
  {
    id: 1,
    title: "Tech Innovation Summit 2024",
    startDate: "2024-02-15T10:00:00Z",
    endDate: "2024-02-15T18:00:00Z",
    bannerUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
    venue: "Convention Center, Mumbai",
    slug: "tech-innovation-summit-2024"
  },
  {
    id: 2,
    title: "Startup Pitch Competition",
    startDate: "2024-02-20T14:00:00Z",
    endDate: "2024-02-20T17:00:00Z",
    bannerUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
    venue: "Innovation Hub, Bangalore",
    slug: "startup-pitch-competition"
  },
  {
    id: 3,
    title: "Digital Marketing Workshop",
    startDate: "2024-02-25T09:30:00Z",
    endDate: "2024-02-25T16:30:00Z",
    bannerUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    venue: "Online Event",
    slug: "digital-marketing-workshop"
  }
];


async function getEvents(): Promise<{ events: Event[] }> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/ease/talaash/api/getEvents`, { 
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!res.ok) {
      console.warn('API fetch failed, using dummy data');
      return { events: dummyEvents };
    }
    
    const data = await res.json();
    console.log('Fetched events from API:', data);
    return { events: data.events?.length > 0 ? data.events : dummyEvents };
  } catch (error) {
    console.warn('API fetch error, using dummy data:', error);
    return { events: dummyEvents };
  }
}

export default function TalaashPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize referral tracking
    initializeReferralTracking();

    // Fetch events
    getEvents().then(({ events }) => {
      setEvents(events);
      setLoading(false);
    });
  }, []);
  
  const handleBookNow = (event: Event) => {
    const { ref } = getReferralForApi();
    // Use slug if available, otherwise fallback to ID
    const eventSlug = (event as any).slug || event.id;
    const bookingUrl = generateReferralUrl(`https://talaash.thejaayveeworld.com/events/${eventSlug}`, ref, eventSlug.toString());
    window.open(bookingUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
          Upcoming Events — Talaash
        </h1>
        <div className="glass-card p-6 text-center text-gray-300">
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
        Upcoming Events — Talaash
      </h1>
      
      {!events.length && (
        <div className="glass-card p-6 text-center text-gray-300">
          <p>No upcoming events at the moment.</p>
        </div>
      )}
      
      <div className="grid gap-6 md:grid-cols-2">
        {events.map(ev => (
          <article key={ev.id} className="glass-card p-6 hover:bg-white/10 transition-all duration-300 flex flex-col h-full">
            {/* Image Section - Fixed Height */}
            <div className="mb-4 h-48 w-full rounded-xl overflow-hidden">
              {ev.bannerUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={ev.bannerUrl} 
                  alt={ev.title} 
                  className="h-full w-full object-cover" 
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
              )}
            </div>
            
            {/* Content Section - Flexible */}
            <div className="flex flex-col flex-grow">
              <h2 className="text-xl font-semibold text-white mb-3 line-clamp-2">{ev.title}</h2>
              
              <div className="text-sm text-gray-300 space-y-2 mb-6 flex-grow">
                <div>
                  📅 {new Date(ev.startDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                {ev.endDate && (
                  <div>
                    🕐 Ends: {new Date(ev.endDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                )}
                {ev.venue && (
                  <div className="line-clamp-1">📍 {ev.venue}</div>
                )}
              </div>
              
              {/* Button - Fixed at bottom */}
              <button
                onClick={() => handleBookNow(ev)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg mt-auto"
              >
                Book Now
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
