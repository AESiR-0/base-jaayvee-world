'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ventures } from '@/lib/ventures';
import { useEffect } from 'react';
import { initializeReferralTracking, getReferralForApi, generateReferralUrl } from '@/lib/referral';

export default function EaseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize referral tracking
    initializeReferralTracking();
  }, []);

  // Generate venture site URL (e.g., talaash.thejaayvee.world)
  const getVentureSiteUrl = (ventureId: string): string => {
    return `https://${ventureId}.thejaayveeworld.com`;
  };

  return (
    <div className="flex min-h-[100svh]">
      <aside className="w-64 border-r border-white/10 p-4 glass">
        {/* Logo Section with Glass Effect */}
        <div className="mb-6 text-center">
          <div className="profile-avatar mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
            <div className="profile-avatar-inner" style={{ fontSize: '1.5rem' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <Link href="/">
                <img 
                  src="/static/logo(icon) white/jaayvee world icon-03.png" 
                  alt="The Jaayvee World" 
                  className="w-full h-full object-contain"
                />
              </Link>
            </div>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
            The Jaayvee World
          </h1>
        </div>
        
        <nav className="grid gap-3">
          {ventures.map(v => {
            // Check if this venture is the selected/current one
            const isSelectedVenture = v.internalPath && pathname.startsWith(v.internalPath);

            const handleClick = (e: React.MouseEvent) => {
              if (v.href) {
                const { ref } = getReferralForApi();
                const referralUrl = generateReferralUrl(v.href, ref);
                window.open(referralUrl, '_blank', 'noopener,noreferrer');
              } else if (v.internalPath && isSelectedVenture) {
                // If it's the selected venture, redirect to the venture's site
                e.preventDefault();
                const ventureSiteUrl = getVentureSiteUrl(v.id);
                window.location.href = ventureSiteUrl;
              }
            };

            if (v.internalPath) {
              // If it's the selected venture, use button to redirect to site
              if (isSelectedVenture) {
                return (
                  <button
                    key={v.id}
                    onClick={handleClick}
                    className="flex items-center gap-3 rounded-xl border border-white/10 p-3 glass-card hover:bg-white/10 transition-all duration-300"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v.logoUrl} alt={v.name} className="h-8 w-8 object-contain" />
                    <span className="text-sm font-semibold text-white">{v.name}</span>
                  </button>
                );
              }

              // Otherwise, use Link for internal navigation
              return (
                <Link 
                  key={v.id} 
                  href={v.internalPath} 
                  className="flex items-center gap-3 rounded-xl border border-white/10 p-3 glass-card hover:bg-white/10 transition-all duration-300"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.logoUrl} alt={v.name} className="h-8 w-8 object-contain" />
                  <span className="text-sm font-semibold text-white">{v.name}</span>
                </Link>
              );
            }

            return (
              <button
                key={v.id}
                onClick={handleClick}
                className="flex items-center gap-3 rounded-xl border border-white/10 p-3 glass-card hover:bg-white/10 transition-all duration-300"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.logoUrl} alt={v.name} className="h-8 w-8 object-contain" />
                <span className="text-sm font-semibold text-white">{v.name}</span>
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
