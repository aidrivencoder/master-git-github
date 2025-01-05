import React, { useState, useEffect } from 'react'

interface GitCommandSimulatorProps {
  expectedCommand: string
  onSuccess: () => void
}

export function GitCommandSimulator({ expectedCommand, onSuccess }: GitCommandSimulatorProps) {
  const [command, setCommand] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)

  // Reset state when component unmounts or when expectedCommand changes
  useEffect(() => {
    setCommand('')
    setOutput('')
    setError('')
    setIsCorrect(false)
  }, [expectedCommand])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setOutput('')
    
    if (command.trim() === expectedCommand.trim()) {
      setOutput('Command is correct! Click Next to continue.')
      setIsCorrect(true)
    } else {
      setError('Incorrect command. Try again!')
      setIsCorrect(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommand(e.target.value)
    setError('')
    setOutput('')
    setIsCorrect(false)
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 rounded-lg p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <span className="text-green-400 select-none">$</span>
          <input
            type="text"
            value={command}
            onChange={handleInputChange}
            className="flex-1 bg-transparent text-white focus:outline-none focus:ring-1 focus:ring-green-400 rounded px-2 py-1"
            placeholder="Type your git command..."
            autoComplete="off"
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200 font-medium text-sm"
          >
            Check
          </button>
        </form>
        
        {output && (
          <div className="mt-3 text-green-400 dark:text-green-300 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{output}</span>
          </div>
        )}
        
        {error && (
          <div className="mt-3 text-red-400 dark:text-red-300 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Type the command and click &quot;Check&quot; to verify. Once correct, use the Next button to continue.
      </p>

      {isCorrect && (
        <button
          onClick={onSuccess}
          className="mt-2 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium text-sm"
        >
          Next
        </button>
      )}
    </div>
  )
}