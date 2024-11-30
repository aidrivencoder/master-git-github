'use client'

import { useCallback } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/components/providers/AuthProvider'
import { DisplayNameForm } from '@/components/profile/DisplayNameForm'
import { SubscriptionManager } from '@/components/profile/SubscriptionManager'

export default function ProfilePage() {
  const { user } = useAuth()

  const handleUpdate = useCallback(() => {
    // Force a re-render of the auth context
    window.location.reload()
  }, [])

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile
          </h1>
          
          <div className="mt-6 space-y-8">
            {/* Profile Information */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center space-x-4">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Profile'}
                      className="h-16 w-16 rounded-full"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <span className="text-2xl text-primary-600 dark:text-primary-400">
                        {(user?.displayName || user?.email || '?')[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Update Profile
                  </h3>
                  <DisplayNameForm
                    currentDisplayName={user?.displayName || ''}
                    onUpdate={handleUpdate}
                  />
                </div>
              </div>
            </div>

            {/* Subscription Management */}
            <SubscriptionManager />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
