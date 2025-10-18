'use client'

import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebaseClient'
import InfluencerUploadForm from './forms/InfluencerUploadForm'

interface UserInfluencerPanelProps {
  merchantId: string | null
}

export default function UserInfluencerPanel({ merchantId }: UserInfluencerPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [merchantInfo, setMerchantInfo] = useState<{ name: string } | null>(null)

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

  const handleLogin = async () => {
    // In a real implementation, this would trigger Firebase phone auth or email auth
    // For now, we'll simulate authentication
    setIsAuthenticated(true)
  }

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
        <div className="bg-white border border-[#00719C] rounded-xl p-6 text-center">
          <h1 className="text-2xl font-semibold text-[#0C0C0C] mb-4">Influencer Portal</h1>
          <p className="text-gray-600 mb-6">
            Upload your purchase screenshot and social media post to claim cashback.
          </p>
          {merchantInfo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800">
                <strong>Shop:</strong> {merchantInfo.name}
              </p>
            </div>
          )}
          <div className="space-y-3">
            <button
              onClick={handleLogin}
              className="w-full px-6 py-2 bg-[#00719C] text-white rounded-lg hover:bg-[#E8F6FA] hover:text-[#00719C]"
            >
              Login with Phone Number
            </button>
            <button
              onClick={handleLogin}
              className="w-full px-6 py-2 bg-gray-100 text-[#0C0C0C] rounded-lg hover:bg-gray-200"
            >
              Login with Email
            </button>
          </div>
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
