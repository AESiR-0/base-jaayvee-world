'use client'

import { useState, useEffect } from 'react'
import { auth, verifyOTP, createRecaptchaVerifier, clearRecaptchaVerifier, signInWithPhoneNumber } from '@/lib/firebaseClient'
import { useFirebase } from '@/lib/useFirebase'
import InfluencerUploadForm from './forms/InfluencerUploadForm'

interface UserInfluencerPanelProps {
  merchantId: string | null
}

export default function UserInfluencerPanel({ merchantId }: UserInfluencerPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [merchantInfo, setMerchantInfo] = useState<{ name: string } | null>(null)
  
  // Authentication states
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [verificationId, setVerificationId] = useState('')
  const [authStep, setAuthStep] = useState<'method' | 'phone' | 'otp'>('method')
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone')
  const [authError, setAuthError] = useState('')
  const [isAuthLoading, setIsAuthLoading] = useState(false)
  
  const { isInitialized: isFirebaseReady, error: firebaseError } = useFirebase()

  useEffect(() => {
    checkAuthentication()
    if (merchantId) {
      loadMerchantInfo()
    }
  }, [merchantId])

  const checkAuthentication = async () => {
    try {
      const token = await auth.currentUser?.getIdToken()
      if (token) {
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

  const loadMerchantInfo = async () => {
    try {
      // In a real implementation, you'd fetch merchant info
      setMerchantInfo({ name: 'Sample Shop' })
    } catch (error) {
      console.error('Error loading merchant info:', error)
    }
  }

  const sendOTP = async (phoneNumber: string) => {
    try {
      console.log('🔍 Sending OTP to:', phoneNumber);
      
      // Clear any existing reCAPTCHA
      clearRecaptchaVerifier('user-recaptcha-container');
      console.log('🧹 Cleared reCAPTCHA');
      
      const recaptchaVerifier = createRecaptchaVerifier('user-recaptcha-container');
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

  const sendEmailOTP = async (email: string) => {
    try {
      // For email authentication, we'll use a simplified approach
      // In a real implementation, you might use Firebase's email link authentication
      // or integrate with a custom email service
      console.log('🔍 Sending email OTP to:', email);
      
      // Simulate email OTP sending
      return new Promise<{ success: boolean; verificationId: string; error?: string }>((resolve) => {
        setTimeout(() => {
          // For demo purposes, we'll simulate success
          resolve({
            success: true,
            verificationId: `email-${Date.now()}` // Mock verification ID
          });
        }, 1000);
      });
    } catch (error: any) {
      console.error('❌ Send email OTP error:', error);
      return {
        success: false,
        verificationId: '',
        error: error.message || 'Failed to send email OTP. Please try again.'
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsAuthLoading(true);
    setAuthError('');

    try {
      const result = await sendEmailOTP(email);
      
      if (result.success && result.verificationId) {
        setVerificationId(result.verificationId);
        setAuthStep('otp');
        console.log('✅ Email OTP sent successfully');
      } else {
        setAuthError(result.error || 'Failed to send email OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('Email authentication error:', error);
      setAuthError(error.message || 'Failed to send email OTP. Please try again.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError('');

    try {
      let result;
      
      if (authMethod === 'phone') {
        result = await verifyOTP(verificationId, otp);
      } else {
        // For email, we'll simulate verification
        // In a real implementation, you'd verify the email OTP
        result = {
          success: otp === '123456', // Mock verification
          user: { uid: 'email-user', email: email }
        };
      }
      
      if (result.success && result.user) {
        setIsAuthenticated(true);
        console.log('✅ Authentication complete');
      } else {
        setAuthError(authMethod === 'phone' 
          ? (result.error || 'Authentication failed. Please try again.')
          : 'Invalid OTP. Please try again.'
        );
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setAuthError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowSuccess(true)
  }

  if (isLoading) {
    return (
      <div className="p-6 md:p-10">
        <div className="bg-white border border-[#00719C] rounded-xl p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00719C] mx-auto mb-4"></div>
          <p className="text-[#0C0C0C]">Loading...</p>
        </div>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="p-6 md:p-10">
        <div className="bg-white border border-[#00719C] rounded-xl p-6 text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-semibold text-[#0C0C0C] mb-2">Post Submitted Successfully</h2>
          <p className="text-gray-600 mb-4">
            Your influencer post has been submitted for cashback review.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800">
              <strong>What's next?</strong> Your post will be reviewed and you'll receive cashback if approved.
            </p>
          </div>
          <button
            onClick={() => {
              setShowSuccess(false)
              setIsAuthenticated(false)
            }}
            className="px-6 py-2 bg-[#00719C] text-white rounded-lg hover:bg-[#E8F6FA] hover:text-[#00719C]"
          >
            Submit Another Post
          </button>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6 md:p-10">
        <div className="bg-white border border-[#00719C] rounded-xl p-6">
          <h1 className="text-2xl font-semibold text-[#0C0C0C] mb-4 text-center">Influencer Portal</h1>
          <p className="text-gray-600 mb-6 text-center">
            Upload your purchase screenshot and social media post to claim cashback.
          </p>
          
          {merchantInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800">
                <strong>Shop:</strong> {merchantInfo.name}
              </p>
            </div>
          )}

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

          {authStep === 'method' && (
            <div className="space-y-3">
              <button
                onClick={() => {
                  setAuthMethod('phone');
                  setAuthStep('phone');
                }}
                className="w-full px-6 py-2 bg-[#00719C] text-white rounded-lg hover:bg-[#E8F6FA] hover:text-[#00719C]"
              >
                Login with Phone Number
              </button>
              <button
                onClick={() => {
                  setAuthMethod('email');
                  setAuthStep('phone'); // We'll use the same form structure
                }}
                className="w-full px-6 py-2 bg-gray-100 text-[#0C0C0C] rounded-lg hover:bg-gray-200"
              >
                Login with Email
              </button>
            </div>
          )}

          {authStep === 'phone' && authMethod === 'phone' && (
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

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setAuthStep('method')}
                  className="flex-1 py-3 px-4 border border-[#00719C] text-[#00719C] rounded-lg hover:bg-[#E8F6FA]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isAuthLoading || !isFirebaseReady}
                  className="flex-1 py-3 px-4 bg-[#00719C] text-white rounded-lg hover:bg-[#E8F6FA] hover:text-[#00719C] disabled:opacity-50"
                >
                  {isAuthLoading ? 'Sending OTP...' : !isFirebaseReady ? 'Initializing...' : 'Send OTP'}
                </button>
              </div>
            </form>
          )}

          {authStep === 'phone' && authMethod === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#0C0C0C]">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="mt-1 block w-full px-4 py-3 border border-[#00719C] rounded-lg focus:ring-2 focus:ring-[#00719C] focus:border-[#00719C]"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setAuthStep('method')}
                  className="flex-1 py-3 px-4 border border-[#00719C] text-[#00719C] rounded-lg hover:bg-[#E8F6FA]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="flex-1 py-3 px-4 bg-[#00719C] text-white rounded-lg hover:bg-[#E8F6FA] hover:text-[#00719C] disabled:opacity-50"
                >
                  {isAuthLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </div>
            </form>
          )}

          {authStep === 'otp' && (
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
                  placeholder={authMethod === 'email' ? '123456' : '123456'}
                  className="mt-1 block w-full px-4 py-3 border border-[#00719C] rounded-lg focus:ring-2 focus:ring-[#00719C] focus:border-[#00719C]"
                />
                <p className="mt-2 text-sm text-gray-600">
                  OTP sent to {authMethod === 'phone' ? phoneNumber : email}
                  {authMethod === 'email' && (
                    <span className="block text-xs text-gray-500 mt-1">
                      Demo: Use "123456" as OTP
                    </span>
                  )}
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

          {authMethod === 'phone' && (
            <div id="user-recaptcha-container" className="flex justify-center mt-4"></div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#0C0C0C] mb-2">Influencer Portal</h1>
        <p className="text-gray-600 mb-4">
          Upload your purchase screenshot and social media post to claim cashback.
        </p>
        {merchantInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              <strong>Shop:</strong> {merchantInfo.name}
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-6">
        {/* Instructions */}
        <div className="bg-white border border-[#00719C] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[#0C0C0C] mb-4">How to Claim Cashback</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#00719C] text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <p className="text-gray-700">Take a screenshot of your payment confirmation</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#00719C] text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <p className="text-gray-700">Post about your purchase on social media (Instagram, Facebook, etc.)</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#00719C] text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <p className="text-gray-700">Upload both the screenshot and post link below</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#00719C] text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
              <p className="text-gray-700">Receive cashback after verification</p>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <InfluencerUploadForm merchantId={merchantId} onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
