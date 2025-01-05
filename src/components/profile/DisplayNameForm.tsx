'use client'

import { useState } from 'react'
import { updateUserDisplayName } from '@/lib/firebase/user'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface DisplayNameFormProps {
  currentDisplayName: string
  onUpdate: () => void
}

export function DisplayNameForm({ currentDisplayName, onUpdate }: DisplayNameFormProps) {
  const [displayName, setDisplayName] = useState(currentDisplayName)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)
    setLoading(true)

    const { success } = await updateUserDisplayName(displayName)
    
    if (success) {
      setSuccess(true)
      onUpdate()
    }
    
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {success && (
        <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md dark:bg-green-900/50 dark:text-green-400">
          Display name updated successfully!
        </div>
      )}

      <div>
        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Display Name
        </label>
        <input
          type="text"
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800"
          required
          minLength={2}
          maxLength={50}
        />
      </div>

      <button
        type="submit"
        disabled={loading || displayName === currentDisplayName}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 dark:bg-primary-500 dark:hover:bg-primary-600"
      >
        {loading ? <LoadingSpinner size="sm" /> : 'Update Display Name'}
      </button>
    </form>
  )
}