'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../providers/AuthProvider'
import { checkPremiumAccess } from '@/lib/firebase/user'
import Link from 'next/link'

interface PremiumContentProps {
  children: React.ReactNode
}

export function PremiumContent({ children }: PremiumContentProps) {
  const { user } = useAuth()
  const [hasPremiumAccess, setHasPremiumAccess] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkAccess() {
      if (user) {
        const hasAccess = await checkPremiumAccess(user.id)
        setHasPremiumAccess(hasAccess)
      }
    }
    checkAccess()
  }, [user])

  if (hasPremiumAccess === null) {
    return <div className="animate-pulse">Loading...</div>
  }

  if (!hasPremiumAccess) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">
          Premium Content
        </h3>
        <p className="text-yellow-700 mb-4">
          This content is available exclusively to premium subscribers.
        </p>
        <Link
          href="/pricing"
          className="inline-block px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
        >
          Upgrade to Premium
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
