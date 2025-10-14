// Referral tracking utilities for cross-domain sharing
export interface ReferralData {
  ref: string;
  source: string;
  timestamp: number;
  eventId?: string;
  userId?: string;
}

// Session storage keys
const REFERRAL_KEY = 'jaayvee_referral';
const REFERRAL_HISTORY_KEY = 'jaayvee_referral_history';

// Get referral from URL parameters
export function getReferralFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('ref') || urlParams.get('referral') || null;
}

// Get referral from session storage
export function getStoredReferral(): ReferralData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = sessionStorage.getItem(REFERRAL_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading referral from session storage:', error);
    return null;
  }
}

// Store referral in session storage
export function storeReferral(ref: string, source: string = 'direct', eventId?: string, userId?: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const referralData: ReferralData = {
      ref,
      source,
      timestamp: Date.now(),
      eventId,
      userId
    };
    
    sessionStorage.setItem(REFERRAL_KEY, JSON.stringify(referralData));
    
    // Also store in history for analytics
    const history = getReferralHistory();
    history.push(referralData);
    
    // Keep only last 10 referrals
    if (history.length > 10) {
      history.splice(0, history.length - 10);
    }
    
    sessionStorage.setItem(REFERRAL_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error storing referral in session storage:', error);
  }
}

// Get referral history
export function getReferralHistory(): ReferralData[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = sessionStorage.getItem(REFERRAL_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading referral history from session storage:', error);
    return [];
  }
}

// Clear referral data
export function clearReferral(): void {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem(REFERRAL_KEY);
  } catch (error) {
    console.error('Error clearing referral from session storage:', error);
  }
}

// Initialize referral tracking on page load
export function initializeReferralTracking(eventId?: string, userId?: string): ReferralData | null {
  if (typeof window === 'undefined') return null;
  
  // Check URL for referral parameter
  const urlRef = getReferralFromUrl();
  
  if (urlRef) {
    // Store new referral from URL
    storeReferral(urlRef, 'url', eventId, userId);
    return getStoredReferral();
  }
  
  // Check if we already have a stored referral
  const storedReferral = getStoredReferral();
  if (storedReferral) {
    // Update with current event/user context
    if (eventId || userId) {
      storeReferral(storedReferral.ref, storedReferral.source, eventId || storedReferral.eventId, userId || storedReferral.userId);
    }
    return storedReferral;
  }
  
  // No referral found, set as organic
  storeReferral('organic', 'direct', eventId, userId);
  return getStoredReferral();
}

// Generate referral URL
export function generateReferralUrl(baseUrl: string, ref: string, eventId?: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set('ref', ref);
  if (eventId) {
    url.searchParams.set('event', eventId);
  }
  return url.toString();
}

// Get referral for API calls
export function getReferralForApi(): { ref: string; source: string } {
  const referral = getStoredReferral();
  return {
    ref: referral?.ref || 'organic',
    source: referral?.source || 'direct'
  };
}
