'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { createCheckoutSession } from '@/lib/stripe/checkout'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface Plan {
  name: string
  price: number
  priceId: string | null
  features: string[]
  cta: string
  highlighted: boolean
}

const plans: Plan[] = [
  {
    name: 'Free',
    price: 0,
    priceId: null, // Free plan doesn't need a Stripe price ID
    features: [
      'Access to basic tutorials',
      'Community support',
      'Basic Git commands',
      'Limited progress tracking'
    ],
    cta: 'Get Started',
    highlighted: false
  },
  {
    name: 'Premium',
    price: 9.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || '',
    features: [
      'All basic tutorials',
      'Advanced Git workflows',
      'Priority support',
      'Progress tracking',
      'Offline access',
      'Premium tutorials',
      'Certificate of completion'
    ],
    cta: 'Go Premium',
    highlighted: true
  }
]

export default function PricingPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string | null) => {
    if (!priceId) return // Free plan
    
    try {
      setLoading(true)
      setError(null)
      await createCheckoutSession(priceId)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
          Choose the plan that best fits your needs
        </p>
      </div>

      {error && (
        <div className="mt-8 rounded-md bg-red-50 p-4">
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

      <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-lg shadow-lg divide-y divide-gray-200 dark:divide-gray-700
              ${plan.highlighted ? 
                'bg-primary-50 dark:bg-primary-900 border-2 border-primary-500 dark:border-primary-400' : 
                'bg-white dark:bg-gray-800'}`}
          >
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {plan.name}
              </h2>
              <p className="mt-4">
                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                  ${plan.price}
                </span>
                <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                  /month
                </span>
              </p>
              {!user ? (
                <a
                  href="/signup"
                  className={`mt-8 block w-full py-3 px-6 rounded-md text-center font-medium
                    ${plan.highlighted ?
                      'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600' :
                      'bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                >
                  Sign up
                </a>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.priceId)}
                  disabled={loading}
                  className={`mt-8 block w-full py-3 px-6 rounded-md text-center font-medium
                    ${plan.highlighted ?
                      'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600' :
                      'bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600'}
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {plan.cta}
                </button>
              )}
            </div>
            <div className="px-6 pt-6 pb-8">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                What's included
              </h3>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex space-x-3">
                    <svg
                      className={`flex-shrink-0 h-5 w-5 ${
                        plan.highlighted ? 
                          'text-primary-500 dark:text-primary-400' : 
                          'text-green-500 dark:text-green-400'
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
