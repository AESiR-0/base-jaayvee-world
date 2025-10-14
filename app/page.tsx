'use client';

import Link from 'next/link';
import { ventures } from '@/lib/ventures';
import { useEffect } from 'react';
import { initializeReferralTracking, getReferralForApi, generateReferralUrl } from '@/lib/referral';

export default function Home() {
  useEffect(() => {
    // Initialize referral tracking
    initializeReferralTracking();
  }, []);
  return (
    <div className="linktree-container">
      {/* Floating particles for space effect */}
      <div className="floating-particle" style={{ top: '10%', left: '10%' }}></div>
      <div className="floating-particle" style={{ top: '20%', right: '15%' }}></div>
      <div className="floating-particle" style={{ bottom: '30%', left: '20%' }}></div>
      <div className="floating-particle" style={{ bottom: '20%', right: '10%' }}></div>
      
      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-avatar">
          <div className="profile-avatar-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/static/logo(icon) white/jaayvee world icon-03.png" 
              alt="The Jaayvee World" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
          The Jaayvee World
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          Explore our ventures across different domains
        </p>
      </div>

      {/* Links Container */}
      <div className="links-container">
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
                className="link-item glass-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={v.logoUrl} 
                  alt={v.name} 
                  className="link-logo" 
                />
                <span className="link-text">{v.name}</span>
                <div className="link-arrow">
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
              </Link>
            );
          }

          return (
            <button
              key={v.id}
              onClick={handleClick}
              className="link-item glass-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={v.logoUrl} 
                alt={v.name} 
                className="link-logo" 
              />
              <span className="link-text">{v.name}</span>
              <div className="link-arrow">
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-white/10">
        <div className="text-center">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">The Jaayvee World</h3>
            <p className="text-sm text-gray-400">Where every connection creates a story worth sharing</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <Link 
              href="/privacy-policy" 
              className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms-and-conditions" 
              className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
            >
              Terms & Conditions
            </Link>
            <Link 
              href="/refund-policy" 
              className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
            >
              Refund Policy
            </Link>
          </div>
          
          <div className="text-xs text-gray-500">
            <p>© 2024 The Jaayvee World. All rights reserved.</p>
            <p className="mt-1">contact@talaashbyjaayvee.com | +91 9879143185</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
