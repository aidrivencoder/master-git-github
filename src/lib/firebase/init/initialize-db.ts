import { Logger } from '@/lib/utils/logger'

export async function initializeDatabase() {
  try {
    const response = await fetch('/api/init-db', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to initialize database')
    }

    Logger.info('Database initialized successfully', 'DatabaseInit')
    return data
  } catch (error) {
    Logger.error('Failed to initialize database', 'DatabaseInit', error)
    throw error
  }
}