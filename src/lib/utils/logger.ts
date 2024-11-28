type LogLevel = 'info' | 'warn' | 'error'

interface LogMessage {
  level: LogLevel
  message: string
  timestamp: string
  context?: string
  error?: unknown
}

export class Logger {
  private static formatError(error: unknown): string {
    if (error instanceof Error) {
      return `${error.name}: ${error.message}`
    }
    return String(error)
  }

  private static createLogMessage(
    level: LogLevel,
    message: string,
    context?: string,
    error?: unknown
  ): LogMessage {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error: error ? this.formatError(error) : undefined
    }
  }

  static info(message: string, context?: string) {
    const log = this.createLogMessage('info', message, context)
    console.log(`[${log.timestamp}] [${log.context || 'APP'}] ${message}`)
  }

  static warn(message: string, context?: string, error?: unknown) {
    const log = this.createLogMessage('warn', message, context, error)
    console.warn(`[${log.timestamp}] [${log.context || 'APP'}] WARNING: ${message}`, error || '')
  }

  static error(message: string, context?: string, error?: unknown) {
    const log = this.createLogMessage('error', message, context, error)
    console.error(`[${log.timestamp}] [${log.context || 'APP'}] ERROR: ${message}`, error || '')
  }
}