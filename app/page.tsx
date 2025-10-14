'use client';

import Link from 'next/link';
import { ventures } from '@/lib/ventures';
import { useEffect, useState } from 'react';
import { initializeReferralTracking, getReferralForApi, generateReferralUrl } from '@/lib/referral';
import Image from 'next/image';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Initialize referral tracking
    initializeReferralTracking();
  }, []);

  const handleAffiliateClick = (url: string) => {
    const { ref } = getReferralForApi();
    const referralUrl = generateReferralUrl(url, ref);
    window.open(referralUrl, '_blank', 'noopener,noreferrer');
    setIsModalOpen(false);
  };
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
            <Image
              src="/static/logo(icon) white/jaayvee world icon-03.png" 
              alt="The Jaayvee World" 
              className="w-full h-full object-contain"
              width={80}
              height={80}
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
            } else if (v.internalPath) {
              window.location.href = v.internalPath;
            }
          };

          return (
            <button
              key={v.id}
              onClick={handleClick}
              className="link-item glass-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <Image
                src={v.logoUrl} 
                alt={v.name} 
                className="" 
                width={80}
                height={80}
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

      {/* Curious to know more section */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Curious to know more?
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          Click Here
        </button>
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

      {/* Affiliate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Join The Jaayvee World</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-300 mb-8 text-center">
              Choose how you'd like to collaborate with us and start earning!
            </p>

            <div className="space-y-4">
              {/* Influencers */}
              <button
                onClick={() => handleAffiliateClick('https://influencer.thejaayveeworld.com')}
                className="w-full glass-card p-6 text-left hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-1">Influencers</h4>
                    <p className="text-gray-300 text-sm">Wanna work and earn with the jaayvee world by being affiliated with us?</p>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 group-hover:text-white transition-colors">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
              </button>

              {/* Agents */}
              <button
                onClick={() => handleAffiliateClick('https://agents.thejaayveeworld.com')}
                className="w-full glass-card p-6 text-left hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-1">Agents</h4>
                    <p className="text-gray-300 text-sm">Earn on field with the jaayvee world</p>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 group-hover:text-white transition-colors">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
              </button>

              {/* Partners */}
              <button
                onClick={() => handleAffiliateClick('https://earnwithfun.thejaayveeworld.com')}
                className="w-full glass-card p-6 text-left hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-1">Partners</h4>
                    <p className="text-gray-300 text-sm">Earn with Fun while making events with the jaayvee event planner</p>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 group-hover:text-white transition-colors">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
              </button>

              {/* Sellers */}
              <button
                onClick={() => handleAffiliateClick('https://sellers.thejaayveeworld.com')}
                className="w-full glass-card p-6 text-left hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-1">Sellers</h4>
                    <p className="text-gray-300 text-sm">Sell and earn with the jaayvee world marketplace</p>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 group-hover:text-white transition-colors">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
