'use client'

import { useState } from 'react'
import { auth, verifyOTP, createRecaptchaVerifier, clearRecaptchaVerifier, signInWithPhoneNumber } from '@/lib/firebaseClient'
import { useFirebase } from '@/lib/useFirebase'

interface MerchantOnboardFormProps {
  merchantId: string | null
  onSuccess: () => void
}

export default function MerchantOnboardForm({ merchantId, onSuccess }: MerchantOnboardFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    shopPhoto: null as File | null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [verificationId, setVerificationId] = useState('')
  const [authError, setAuthError] = useState('')
  const [isAuthLoading, setIsAuthLoading] = useState(false)
  
  const { isInitialized: isFirebaseReady, error: firebaseError } = useFirebase()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, shopPhoto: file }))
    }
  }

  const sendOTP = async () => {
    if (!formData.phone) return

    if (!isFirebaseReady) {
      setAuthError('Firebase is not ready. Please wait and try again.');
      return;
    }

    setIsAuthLoading(true);
    setAuthError('');

    try {
      console.log('🔍 Sending OTP to:', formData.phone);
      
      // Clear any existing reCAPTCHA
      clearRecaptchaVerifier('agent-recaptcha-container');
      console.log('🧹 Cleared reCAPTCHA');
      
      const recaptchaVerifier = createRecaptchaVerifier('agent-recaptcha-container');
      console.log('🔐 Created reCAPTCHA verifier');
      
      console.log('📞 Calling signInWithPhoneNumber...');
      const confirmationResult = await signInWithPhoneNumber(auth, formData.phone, recaptchaVerifier);
      console.log('✅ OTP sent successfully!', confirmationResult.verificationId);
      
      setVerificationId(confirmationResult.verificationId);
      setOtpSent(true);
    } catch (error: any) {
      console.error('❌ Send OTP error:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/too-many-requests') {
        setAuthError('Too many OTP requests. Please wait 1-2 hours before trying again.');
      } else if (error.code === 'auth/invalid-phone-number') {
        setAuthError('Invalid phone number format. Please use international format like +91 9876543210');
      } else if (error.code === 'auth/captcha-check-failed') {
        setAuthError('Security verification failed. Please try again.');
      } else if (error.code === 'auth/network-request-failed') {
        setAuthError('Network error. Please check your internet connection and try again.');
      } else {
        setAuthError(error.message || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setIsAuthLoading(false);
    }
  }

  const verifyOTPAndSubmit = async () => {
    if (!otp) return

    setIsAuthLoading(true);
    setAuthError('');

    try {
      console.log('🔍 Verifying OTP:', otp);
      
      const result = await verifyOTP(verificationId, otp);
      
      if (result.success && result.user) {
        console.log('✅ OTP verified successfully');
        await submitForm();
      } else {
        setAuthError(result.error || 'Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('❌ Verify OTP error:', error);
      setAuthError(error.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsAuthLoading(false);
    }
  }

  const submitForm = async () => {
    setIsSubmitting(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      
      const formDataToSend = new FormData()
      formDataToSend.append('merchantId', merchantId || '')
      formDataToSend.append('name', formData.name)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('address', formData.address)
      if (formData.shopPhoto) {
        formDataToSend.append('shopPhoto', formData.shopPhoto)
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/merchant/activate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      })

      if (response.ok) {
        onSuccess()
      } else {
        throw new Error('Failed to activate merchant')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setAuthError('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real implementation, you'd reverse geocode this
          setFormData(prev => ({
            ...prev,
            address: `${position.coords.latitude}, ${position.coords.longitude}`
          }))
        },
        (error) => {
          console.error('Error getting location:', error)
          setAuthError('Failed to get location. Please enter address manually.');
        }
      )
    } else {
      setAuthError('Geolocation is not supported by this browser.');
    }
  }

  if (otpSent) {
    return (
      <div className="bg-white border border-[#00719C] rounded-xl p-6">
        <h2 className="text-xl font-semibold text-[#0C0C0C] mb-4">Verify Phone Number</h2>
        
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

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0C0C0C] mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border border-[#00719C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00719C]"
              placeholder="Enter 6-digit OTP"
            />
            <p className="mt-2 text-sm text-gray-600">
              OTP sent to {formData.phone}
            </p>
          </div>
          
          <button
            onClick={verifyOTPAndSubmit}
            disabled={!otp || isAuthLoading || isSubmitting}
            className="w-full px-4 py-2 bg-[#00719C] text-white rounded-lg hover:bg-[#E8F6FA] hover:text-[#00719C] disabled:opacity-50"
          >
            {isAuthLoading ? 'Verifying...' : isSubmitting ? 'Submitting...' : 'Verify OTP & Submit'}
          </button>
          
          <button
            onClick={() => {
              setOtpSent(false);
              setOtp('');
              setVerificationId('');
              setAuthError('');
            }}
            className="w-full px-4 py-2 border border-[#00719C] text-[#00719C] rounded-lg hover:bg-[#E8F6FA]"
          >
            Back to Form
          </button>
        </div>

        {authError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{authError}</p>
          </div>
        )}

        <div id="agent-recaptcha-container" className="flex justify-center mt-4"></div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#00719C] rounded-xl p-6">
      <h2 className="text-xl font-semibold text-[#0C0C0C] mb-6">Merchant Onboarding</h2>
      
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

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#0C0C0C] mb-2">
            Shop Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-[#00719C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00719C]"
            placeholder="Enter shop name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0C0C0C] mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-[#00719C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00719C]"
            placeholder="+91 9876543210"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0C0C0C] mb-2">
            Shop Address *
          </label>
          <div className="flex gap-2">
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 border border-[#00719C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00719C]"
              placeholder="Enter shop address"
              rows={3}
              required
            />
            <button
              type="button"
              onClick={getCurrentLocation}
              className="px-3 py-2 bg-gray-100 text-[#0C0C0C] rounded-lg hover:bg-gray-200"
              title="Get current location"
            >
              📍
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0C0C0C] mb-2">
            Shop Photo (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-[#00719C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00719C]"
          />
        </div>

        <button
          type="button"
          onClick={sendOTP}
          disabled={!formData.name || !formData.phone || !formData.address || !isFirebaseReady || isAuthLoading}
          className="w-full px-4 py-2 bg-[#00719C] text-white rounded-lg hover:bg-[#E8F6FA] hover:text-[#00719C] disabled:opacity-50"
        >
          {isAuthLoading ? 'Sending OTP...' : !isFirebaseReady ? 'Initializing...' : 'Send OTP & Submit'}
        </button>
      </form>

      {authError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{authError}</p>
        </div>
      )}

      <div id="agent-recaptcha-container" className="flex justify-center mt-4"></div>
    </div>
  )
}
