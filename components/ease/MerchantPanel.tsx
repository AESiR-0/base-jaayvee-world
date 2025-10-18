'use client'

import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebaseClient'
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

  const handleLogin = async () => {
    // In a real implementation, this would trigger Firebase phone auth
    // For now, we'll simulate authentication
    setIsAuthenticated(true)
    const mockToken = 'mock-token'
    await loadMerchantData(mockToken)
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
        <div className="bg-white border border-[#00719C] rounded-xl p-6 text-center">
          <h1 className="text-2xl font-semibold text-[#0C0C0C] mb-4">Merchant Login</h1>
          <p className="text-gray-600 mb-6">
            Please log in to access your merchant dashboard.
          </p>
          <button
            onClick={handleLogin}
            className="px-6 py-2 bg-[#00719C] text-white rounded-lg hover:bg-[#E8F6FA] hover:text-[#00719C]"
          >
            Login with Phone Number
          </button>
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
