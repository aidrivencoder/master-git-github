'use client'

import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export function Header() {
  const { user, loading } = useAuth()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-primary-600 dark:text-primary-500">
            GitHub Tutorial Platform
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/tutorials" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Tutorials
          </Link>
          <ThemeToggle />
          {!loading && (
            <>
              {user ? (
                <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Dashboard
                </Link>
              ) : (
                <Link 
                  href="/login"
                  className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700"
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