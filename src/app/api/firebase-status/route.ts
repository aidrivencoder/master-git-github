import { NextResponse } from 'next/server'
import { checkFirebaseStatus } from '@/lib/firebase/utils/status-check'

export async function GET() {
  const status = await checkFirebaseStatus()
  
  if (!status.success) {
    return NextResponse.json({
      success: false,
      error: status.error
    }, { status: 500 })
  }

  return NextResponse.json(status)
}