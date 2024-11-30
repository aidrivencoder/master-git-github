'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, Transition } from '@headlessui/react'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../components/providers/AuthProvider'
import { ThemeToggle } from '../../components/theme/ThemeToggle'
import { signOut } from '../../lib/firebase/auth'

export function Header() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

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
                <Menu as="div" className="relative ml-3">
                  <Menu.Button className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    <UserCircleIcon className="h-8 w-8" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/profile"
                            className={`${
                              active ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } block px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                          >
                            Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            href="/dashboard"
                            className={`${
                              active ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } block px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                          >
                            Dashboard
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleSignOut}
                            className={`${
                              active ? 'bg-gray-100 dark:bg-gray-700' : ''
                            } block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                          >
                            Sign Out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
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
