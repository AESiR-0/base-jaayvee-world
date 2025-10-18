'use client'

import { useSearchParams } from 'next/navigation'
import AgentPanel from '@/components/ease/AgentPanel'
import MerchantPanel from '@/components/ease/MerchantPanel'
import UserInfluencerPanel from '@/components/ease/UserInfluencerPanel'

export default function EasePage() {
  const params = useSearchParams()
  const role = params.get('role')
  const merchantId = params.get('merchantId')

  if (role === 'agent') return <AgentPanel merchantId={merchantId} />
  if (role === 'merchant') return <MerchantPanel merchantId={merchantId} />
  if (role === 'user') return <UserInfluencerPanel merchantId={merchantId} />
  return <div className="p-10 text-center">Invalid or missing role.</div>
}
