'use client';

import Link from 'next/link';
import { ventures } from '@/lib/ventures';
import { useEffect } from 'react';
import { initializeReferralTracking, getReferralForApi, generateReferralUrl } from '@/lib/referral';

export default function EaseLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize referral tracking
    initializeReferralTracking();
  }, []);
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
            const handleClick = () => {
              if (v.href) {
                const { ref } = getReferralForApi();
                const referralUrl = generateReferralUrl(v.href, ref);
                window.open(referralUrl, '_blank', 'noopener,noreferrer');
              }
            };

            if (v.internalPath) {
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
