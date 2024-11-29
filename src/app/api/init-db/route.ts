import { NextResponse } from 'next/server'
import { initializeCollections } from '@/lib/firebase/init/initialize-collections'
import { Logger } from '@/lib/utils/logger'

export async function POST() {
  try {
    Logger.info('Starting database initialization', 'InitDB')
    await initializeCollections()

    return NextResponse.json({
      success: true,
      message: 'Database collections initialized successfully'
    })
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to initialize database'
    Logger.error(`Database initialization failed: ${errorMessage}`, 'InitDB', error)
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 })
  }
}