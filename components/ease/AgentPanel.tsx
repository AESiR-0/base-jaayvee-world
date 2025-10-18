'use client'

import { useState, useEffect } from 'react'
import MerchantOnboardForm from './forms/MerchantOnboardForm'

interface AgentPanelProps {
  merchantId: string | null
}

export default function AgentPanel({ merchantId }: AgentPanelProps) {
  const [isValidMerchant, setIsValidMerchant] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (merchantId) {
      validateMerchantId()
    } else {
      setIsLoading(false)
    }
  }, [merchantId])

  const validateMerchantId = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/qr/resolve?code=${merchantId}`)
      const data = await response.json()
      setIsValidMerchant(response.ok && data.valid)
    } catch (error) {
      console.error('Error validating merchant ID:', error)
      setIsValidMerchant(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccess = () => {
    setShowSuccess(true)
  }

  if (isLoading) {
    return (
      <div className="p-6 md:p-10">
        <div className="bg-white border border-[#00719C] rounded-xl p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00719C] mx-auto mb-4"></div>
          <p className="text-[#0C0C0C]">Validating merchant ID...</p>
        </div>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="p-6 md:p-10">
        <div className="bg-white border border-[#00719C] rounded-xl p-6 text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-semibold text-[#0C0C0C] mb-2">Merchant Submitted for Verification</h2>
          <p className="text-gray-600 mb-4">
            The merchant has been successfully onboarded and is pending verification.
          </p>
          <button
            onClick={() => {
              setShowSuccess(false)
              setIsValidMerchant(null)
              setIsLoading(true)
              validateMerchantId()
            }}
            className="px-6 py-2 bg-[#00719C] text-white rounded-lg hover:bg-[#E8F6FA] hover:text-[#00719C]"
          >
            Onboard Another Merchant
          </button>
        </div>
      </div>
    )
  }

  if (!merchantId) {
    return (
      <div className="p-6 md:p-10">
        <div className="bg-white border border-[#00719C] rounded-xl p-6 text-center">
          <h1 className="text-2xl font-semibold text-[#0C0C0C] mb-4">Agent Portal</h1>
          <p className="text-gray-600 mb-4">
            Please provide a valid merchant ID to begin the onboarding process.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              <strong>Note:</strong> Access this page with a valid merchantId parameter in the URL.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (isValidMerchant === false) {
    return (
      <div className="p-6 md:p-10">
        <div className="bg-white border border-red-300 rounded-xl p-6 text-center">
          <div className="text-red-600 text-6xl mb-4">✗</div>
          <h2 className="text-2xl font-semibold text-[#0C0C0C] mb-2">Invalid Merchant ID</h2>
          <p className="text-gray-600 mb-4">
            The provided merchant ID is not valid or has already been used.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              <strong>Error:</strong> Merchant ID "{merchantId}" could not be validated.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#0C0C0C] mb-2">Agent Portal</h1>
        <p className="text-gray-600">Onboard and activate merchants using pre-assigned QR IDs</p>
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">
            <strong>Valid Merchant ID:</strong> {merchantId}
          </p>
        </div>
      </div>

      <MerchantOnboardForm merchantId={merchantId} onSuccess={handleSuccess} />
    </div>
  )
}
