'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import AgentPanel from '@/components/ease/AgentPanel'
import MerchantPanel from '@/components/ease/MerchantPanel'
import UserInfluencerPanel from '@/components/ease/UserInfluencerPanel'

function EasePageContent() {
  const params = useSearchParams()
  const role = params.get('role')
  const merchantId = params.get('merchantId')

  if (role === 'agent') return <AgentPanel merchantId={merchantId} />
  if (role === 'merchant') return <MerchantPanel merchantId={merchantId} />
  if (role === 'user') return <UserInfluencerPanel merchantId={merchantId} />
  
  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-semibold text-[#0C0C0C] mb-4">Ease Portal</h1>
      <p className="text-gray-600 mb-6">Invalid or missing role parameter.</p>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
        <p className="text-blue-800 text-sm">
          <strong>Usage:</strong><br />
          • <code>/ease?role=agent&merchantId=QR_CODE</code><br />
          • <code>/ease?role=merchant&merchantId=MERCHANT_ID</code><br />
          • <code>/ease?role=user&merchantId=MERCHANT_ID</code>
        </p>
      </div>
    </div>
  )
}

export default function EasePage() {
  return (
    <Suspense fallback={
      <div className="p-10 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00719C] mx-auto mb-4"></div>
        <p className="text-[#0C0C0C]">Loading...</p>
      </div>
    }>
      <EasePageContent />
    </Suspense>
  )
}
