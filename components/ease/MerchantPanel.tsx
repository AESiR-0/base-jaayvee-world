'use client'

import { useState, useEffect } from 'react'
import { auth, verifyOTP, createRecaptchaVerifier, clearRecaptchaVerifier, signInWithPhoneNumber } from '@/lib/firebaseClient'
import { useFirebase } from '@/lib/useFirebase'
import StatusCard from '@/components/common/StatusCard'

interface MerchantPanelProps {
  merchantId: string | null
}

interface MerchantProfile {
  name: string
  phone: string
  address: string
  active: boolean
}

interface MerchantStats {
  sales: number
  posts: number
  wallet: number
}

export default function MerchantPanel({ merchantId }: MerchantPanelProps) {
  const [profile, setProfile] = useState<MerchantProfile | null>(null)
  const [stats, setStats] = useState<MerchantStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isToggling, setIsToggling] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Authentication states
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [verificationId, setVerificationId] = useState('')
  const [authStep, setAuthStep] = useState<'phone' | 'otp'>('phone')
  const [authError, setAuthError] = useState('')
  const [isAuthLoading, setIsAuthLoading] = useState(false)
  
  const { isInitialized: isFirebaseReady, error: firebaseError } = useFirebase()

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      const token = await auth.currentUser?.getIdToken()
      if (token) {
        await loadMerchantData(token)
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Authentication error:', error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMerchantData = async (token: string) => {
    try {
      // Load profile
      const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/merchants/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        setProfile(profileData)
      }

      // Load stats
      const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/merchants/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error('Error loading merchant data:', error)
    }
  }

  const sendOTP = async (phoneNumber: string) => {
    try {
      console.log('🔍 Sending OTP to:', phoneNumber);
      
      // Clear any existing reCAPTCHA
      clearRecaptchaVerifier('merchant-recaptcha-container');
      console.log('🧹 Cleared reCAPTCHA');
      
      const recaptchaVerifier = createRecaptchaVerifier('merchant-recaptcha-container');
      console.log('🔐 Created reCAPTCHA verifier');
      
      console.log('📞 Calling signInWithPhoneNumber...');
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      console.log('✅ OTP sent successfully!', confirmationResult.verificationId);
      
      return {
        success: true,
        verificationId: confirmationResult.verificationId
      };
    } catch (error: any) {
      console.error('❌ Send OTP error:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/too-many-requests') {
        return {
          success: false,
          error: 'Too many OTP requests. Please wait 1-2 hours before trying again.'
        };
      } else if (error.code === 'auth/invalid-phone-number') {
        return {
          success: false,
          error: 'Invalid phone number format. Please use international format like +91 9876543210'
        };
      } else if (error.code === 'auth/captcha-check-failed') {
        return {
          success: false,
          error: 'Security verification failed. Please try again.'
        };
      } else if (error.code === 'auth/network-request-failed') {
        return {
          success: false,
          error: 'Network error. Please check your internet connection and try again.'
        };
      }
      
      return {
        success: false,
        verificationId: '',
        error: error.message || 'Failed to send OTP. Please try again.'
      };
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFirebaseReady) {
      setAuthError('Firebase is not ready. Please wait and try again.');
      return;
    }
    
    setIsAuthLoading(true);
    setAuthError('');

    try {
      const result = await sendOTP(phoneNumber);
      
      if (result.success && result.verificationId) {
        setVerificationId(result.verificationId);
        setAuthStep('otp');
        console.log('✅ OTP sent successfully');
      } else {
        setAuthError(result.error || 'Failed to send OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('Phone authentication error:', error);
      setAuthError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError('');

    try {
      const result = await verifyOTP(verificationId, otp);
      
      if (result.success && result.user) {
        // Store user data
        const token = await result.user.getIdToken();
        await loadMerchantData(token);
        setIsAuthenticated(true);
        console.log('✅ Authentication complete');
      } else {
        setAuthError(result.error || 'Authentication failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setAuthError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const toggleShopStatus = async () => {
    if (!profile) return

    setIsToggling(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/merchants/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          merchantId: merchantId,
          active: !profile.active
        })
      })

      if (response.ok) {
        setProfile(prev => prev ? { ...prev, active: !prev.active } : null)
      } else {
        throw new Error('Failed to toggle shop status')
      }
    } catch (error) {
      console.error('Error toggling shop status:', error)
    } finally {
      setIsToggling(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 md:p-10">
        <div className="bg-white border border-[#00719C] rounded-xl p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00719C] mx-auto mb-4"></div>
          <p className="text-[#0C0C0C]">Loading merchant dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6 md:p-10">
        <div className="bg-white border border-[#00719C] rounded-xl p-6">
          <h1 className="text-2xl font-semibold text-[#0C0C0C] mb-4 text-center">Merchant Login</h1>
          <p className="text-gray-600 mb-6 text-center">
            Please log in to access your merchant dashboard.
          </p>

          {!isFirebaseReady && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-yellow-800">
                ⏳ Initializing Firebase... Please wait.
              </p>
            </div>
          )}

          {firebaseError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-800">
                ❌ Firebase Error: {firebaseError}
              </p>
            </div>
          )}

          {authStep === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#0C0C0C]">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 9876543210"
                  className="mt-1 block w-full px-4 py-3 border border-[#00719C] rounded-lg focus:ring-2 focus:ring-[#00719C] focus:border-[#00719C]"
                />
              </div>

              <button
                type="submit"
                disabled={isAuthLoading || !isFirebaseReady}
                className="w-full px-6 py-2 bg-[#00719C] text-white rounded-lg hover:bg-[#E8F6FA] hover:text-[#00719C] disabled:opacity-50"
              >
                {isAuthLoading ? 'Sending OTP...' : !isFirebaseReady ? 'Initializing...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-[#0C0C0C]">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="mt-1 block w-full px-4 py-3 border border-[#00719C] rounded-lg focus:ring-2 focus:ring-[#00719C] focus:border-[#00719C]"
                />
                <p className="mt-2 text-sm text-gray-600">
                  OTP sent to {phoneNumber}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setAuthStep('phone')}
                  className="flex-1 py-3 px-4 border border-[#00719C] text-[#00719C] rounded-lg hover:bg-[#E8F6FA]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="flex-1 py-3 px-4 bg-[#00719C] text-white rounded-lg hover:bg-[#E8F6FA] hover:text-[#00719C] disabled:opacity-50"
                >
                  {isAuthLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </form>
          )}

          {authError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{authError}</p>
            </div>
          )}

          <div id="merchant-recaptcha-container" className="flex justify-center mt-4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#0C0C0C] mb-2">Merchant Dashboard</h1>
        <p className="text-gray-600">Manage your shop and view performance metrics</p>
      </div>

      <div className="grid gap-6">
        {/* Shop Status Toggle */}
        <div className="bg-white border border-[#00719C] rounded-xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-[#0C0C0C] mb-1">Shop Status</h3>
              <p className="text-gray-600">
                {profile?.active ? 'Your shop is currently open' : 'Your shop is currently closed'}
              </p>
            </div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={profile?.active || false}
                onChange={toggleShopStatus}
                disabled={isToggling}
                className="w-6 h-6 text-[#00719C] bg-gray-100 border-gray-300 rounded focus:ring-[#00719C] focus:ring-2"
              />
              <span className="text-lg font-medium text-[#0C0C0C]">
                {profile?.active ? 'Open' : 'Closed'}
              </span>
            </label>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid md:grid-cols-3 gap-4">
            <StatusCard
              title="Total Sales"
              value={`₹${stats.sales.toLocaleString()}`}
              description="All-time revenue"
            />
            <StatusCard
              title="Influencer Posts"
              value={stats.posts}
              description="Posts submitted"
            />
            <StatusCard
              title="Wallet Balance"
              value={`₹${stats.wallet.toLocaleString()}`}
              description="Available balance"
            />
          </div>
        )}

        {/* Profile Information */}
        {profile && (
          <div className="bg-white border border-[#00719C] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[#0C0C0C] mb-4">Shop Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Shop Name</label>
                <p className="text-[#0C0C0C]">{profile.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                <p className="text-[#0C0C0C]">{profile.phone}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                <p className="text-[#0C0C0C]">{profile.address}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
