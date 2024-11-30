'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { createCheckoutSession } from '@/lib/stripe/checkout'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { auth } from '@/lib/firebase/config'
import { PaymentHistory } from '@/types/user'

export function SubscriptionManager() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCancelSubscription = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const idToken = await auth.currentUser?.getIdToken()
      if (!idToken) {
        throw new Error('Not authenticated')
      }
      
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      window.location.reload()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePaymentMethod = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const idToken = await auth.currentUser?.getIdToken()
      if (!idToken) {
        throw new Error('Not authenticated')
      }
      
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      })

      const { url } = await response.json()
      window.location.href = url
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'past_due':
        return 'bg-red-100 text-red-800'
      case 'canceled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Subscription Status
          </h3>
          
          <div className="mt-3 max-w-xl text-sm text-gray-500 dark:text-gray-400">
            <p>
              Current plan: {user?.subscription?.tier || 'free'}
            </p>
            {user?.subscription?.validUntil && (
              <p className="mt-1">
                Valid until: {new Date(user.subscription.validUntil).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="mt-3">
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
              getStatusBadgeColor(user?.subscription?.status || 'none')
            }`}>
              {user?.subscription?.status || 'none'}
            </span>
          </div>

          <div className="mt-5 space-x-4">
            {user?.subscription?.tier === 'premium' && user?.subscription?.status === 'active' ? (
              <>
                <button
                  type="button"
                  onClick={handleUpdatePaymentMethod}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Update Payment Method
                </button>
                <button
                  type="button"
                  onClick={handleCancelSubscription}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel Subscription
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => window.location.href = '/pricing'}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Subscribe Now
              </button>
            )}
          </div>

          {loading && (
            <div className="mt-4">
              <LoadingSpinner />
            </div>
          )}
        </div>
      </div>

      {user?.subscription?.tier === 'premium' && user?.paymentHistory && user.paymentHistory.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Payment History
            </h3>
            <div className="mt-4">
              <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {user.paymentHistory.map((payment: PaymentHistory) => (
                            <tr key={payment.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {new Date(payment.created * 1000).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                ${(payment.amount / 100).toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${
                                  getStatusBadgeColor(payment.status)
                                }`}>
                                  {payment.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
