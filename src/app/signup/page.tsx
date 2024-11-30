import Link from 'next/link'
import { SignUpForm } from '@/components/auth/SignUpForm'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 space-y-8">
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>

            {/* Header */}
            <div className="space-y-2">
              <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                Create your account
              </h2>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Join our community of developers mastering Git and GitHub
              </p>
            </div>

            {/* Form */}
            <SignUpForm />

            {/* Footer */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Interactive Tutorials</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Real-time Practice</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
