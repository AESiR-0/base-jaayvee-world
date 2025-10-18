'use client'

import { useState } from 'react'
import { auth } from '@/lib/firebaseClient'
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth'

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

    try {
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber
        }
      })

      const confirmationResult = await signInWithPhoneNumber(auth, formData.phone, recaptchaVerifier)
      setOtpSent(true)
    } catch (error) {
      console.error('Error sending OTP:', error)
    }
  }

  const verifyOTP = async () => {
    if (!otp) return

    try {
      // OTP verification logic would go here
      // For now, we'll simulate success
      await submitForm()
    } catch (error) {
      console.error('Error verifying OTP:', error)
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
        }
      )
    }
  }

  if (otpSent) {
    return (
      <div className="bg-white border border-[#00719C] rounded-xl p-6">
        <h2 className="text-xl font-semibold text-[#0C0C0C] mb-4">Verify Phone Number</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0C0C0C] mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00719C]"
              placeholder="Enter 6-digit OTP"
            />
          </div>
          <button
            onClick={verifyOTP}
            disabled={!otp || isSubmitting}
            className="w-full px-4 py-2 bg-[#00719C] text-white rounded-lg hover:bg-[#E8F6FA] hover:text-[#00719C] disabled:opacity-50"
          >
            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
        <div id="recaptcha-container"></div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#00719C] rounded-xl p-6">
      <h2 className="text-xl font-semibold text-[#0C0C0C] mb-6">Merchant Onboarding</h2>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00719C]"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00719C]"
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
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00719C]"
              placeholder="Enter shop address"
              rows={3}
              required
            />
            <button
              type="button"
              onClick={getCurrentLocation}
              className="px-3 py-2 bg-gray-100 text-[#0C0C0C] rounded-lg hover:bg-gray-200"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00719C]"
          />
        </div>

        <button
          type="button"
          onClick={sendOTP}
          disabled={!formData.name || !formData.phone || !formData.address}
          className="w-full px-4 py-2 bg-[#00719C] text-white rounded-lg hover:bg-[#E8F6FA] hover:text-[#00719C] disabled:opacity-50"
        >
          Send OTP & Submit
        </button>
      </form>
      <div id="recaptcha-container"></div>
    </div>
  )
}
