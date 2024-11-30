'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../providers/AuthProvider'
import { checkPremiumAccess } from '../../lib/firebase/user'
import Link from 'next/link'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface PremiumContentProps {
  children: React.ReactNode
}

export function PremiumContent({ children }: PremiumContentProps) {
  const { user, loading: authLoading } = useAuth()
  const [hasPremiumAccess, setHasPremiumAccess] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [checkAttempts, setCheckAttempts] = useState(0)
  const MAX_CHECK_ATTEMPTS = 3

  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout

    async function checkAccess() {
      if (authLoading) {
        return // Wait for auth to complete
      }

      if (!user) {
        if (mounted) {
          setHasPremiumAccess(false)
          setIsLoading(false)
        }
        return
      }

      try {
        const hasAccess = await checkPremiumAccess(user.uid)
        if (mounted) {
          setHasPremiumAccess(hasAccess)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error checking premium access:', error)
        if (mounted) {
          if (checkAttempts >= MAX_CHECK_ATTEMPTS) {
            setHasPremiumAccess(false)
            setIsLoading(false)
          } else {
            timeoutId = setTimeout(() => {
              setCheckAttempts(prev => prev + 1)
            }, Math.min(1000 * Math.pow(2, checkAttempts), 5000))
          }
        }
      }
    }

    checkAccess()

    return () => {
      mounted = false
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [user, authLoading, checkAttempts])

  // Show loading state while either auth is loading or premium check is in progress
  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner 
          size="lg"
          label="Loading premium content..."
          color="primary"
        />
      </div>
    )
  }

  // Only show upgrade UI when we're certain user is not premium
  if (hasPremiumAccess === false) {
    return (
      <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
          Premium Content
        </h3>
        <p className="text-yellow-700 dark:text-yellow-300 mb-4">
          This content is available exclusively to premium subscribers.
        </p>
        <Link
          href="/pricing"
          className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          Upgrade to Premium
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
