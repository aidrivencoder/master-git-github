import { useState } from 'react'

interface GitCommandSimulatorProps {
  expectedCommand: string
  onSuccess: () => void
}

export function GitCommandSimulator({ expectedCommand, onSuccess }: GitCommandSimulatorProps) {
  const [command, setCommand] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (command.trim() === expectedCommand.trim()) {
      setOutput('Command executed successfully!')
      onSuccess()
    } else {
      setError('Incorrect command. Try again!')
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 rounded-lg p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <span className="text-green-400">$</span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className="flex-1 bg-transparent text-white focus:outline-none"
            placeholder="Type your git command..."
          />
        </form>
        
        {output && (
          <div className="mt-2 text-green-400">
            {output}
          </div>
        )}
        
        {error && (
          <div className="mt-2 text-red-400">
            {error}
          </div>
        )}
      </div>

      {output && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Great job! You've successfully executed the command.
        </div>
      )}
    </div>
  )
}
