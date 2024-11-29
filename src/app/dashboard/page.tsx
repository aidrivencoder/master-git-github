'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/components/providers/AuthProvider'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          
          <div className="mt-6">
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Welcome back, {user?.displayName || user?.email}
                </h3>
                <div className="mt-4">
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Email
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          {user?.email}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Account Status
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          Active
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Completed Tutorials
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          {user?.progress?.completedTutorials?.length || 0}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
