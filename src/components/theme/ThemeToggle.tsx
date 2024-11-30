'use client'

import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <div className={`absolute inset-0 transform transition-transform duration-300 ${theme === 'light' ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}>
          <MoonIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className={`absolute inset-0 transform transition-transform duration-300 ${theme === 'dark' ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'}`}>
          <SunIcon className="w-5 h-5 text-amber-500 dark:text-amber-400" />
        </div>
      </div>
    </button>
  )
}
