'use client'

import { useAuth } from '@/components/providers/AuthProvider'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: 0,
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
              <Link
                href={user ? '/dashboard' : '/signup'}
                className={`mt-8 block w-full py-3 px-6 rounded-md text-center font-medium
                  ${plan.highlighted ?
                    'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600' :
                    'bg-gray-800 text-white hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
              >
                {plan.cta}
              </Link>
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