'use client'

import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'

export function Header() {
  const { user, loading } = useAuth()

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-primary-600">
            GitHub Tutorial Platform
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/tutorials" className="text-gray-600 hover:text-gray-900">
            Tutorials
          </Link>
          {!loading && (
            <>
              {user ? (
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Link>
              ) : (
                <Link 
                  href="/login"
                  className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600"
                >
                  Sign In
                </Link>
              )}
            </>
          )}
        </div>
      </nav>
    </header>
  )
}