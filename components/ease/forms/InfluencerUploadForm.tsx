'use client'

import { useState } from 'react'
import { auth } from '@/lib/firebaseClient'

interface InfluencerUploadFormProps {
  merchantId: string | null
  onSuccess: () => void
}

export default function InfluencerUploadForm({ merchantId, onSuccess }: InfluencerUploadFormProps) {
  const [formData, setFormData] = useState({
    screenshot: null as File | null,
    storyLink: '',
    amount: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, screenshot: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.screenshot || !formData.storyLink) return

    setIsSubmitting(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      
      const formDataToSend = new FormData()
      formDataToSend.append('merchantId', merchantId || '')
      formDataToSend.append('screenshot', formData.screenshot)
      formDataToSend.append('storyLink', formData.storyLink)
      formDataToSend.append('amount', formData.amount)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/influencers/submissions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      })

      if (response.ok) {
        onSuccess()
      } else {
        throw new Error('Failed to submit influencer post')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#00719C] rounded-xl p-6">
      <h2 className="text-xl font-semibold text-[#0C0C0C] mb-6">Upload Influencer Post</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#0C0C0C] mb-2">
            Payment Screenshot *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00719C]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0C0C0C] mb-2">
            Story / Post Link *
          </label>
          <input
            type="url"
            name="storyLink"
            value={formData.storyLink}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00719C]"
            placeholder="https://instagram.com/stories/..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0C0C0C] mb-2">
            Amount Spent (Optional)
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00719C]"
            placeholder="₹"
          />
        </div>

        <button
          type="submit"
          disabled={!formData.screenshot || !formData.storyLink || isSubmitting}
          className="w-full px-4 py-2 bg-[#00719C] text-white rounded-lg hover:bg-[#E8F6FA] hover:text-[#00719C] disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Post'}
        </button>
      </div>
    </form>
  )
}
