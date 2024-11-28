export function validateEnvironmentVariables(): { isValid: boolean; error?: string } {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY'
  ]

  const missingVars = requiredVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    return {
      isValid: false,
      error: `Missing required environment variables: ${missingVars.join(', ')}. Please check your .env.local file.`
    }
  }

  // Validate private key format
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
  if (!privateKey?.trim().includes('-----BEGIN PRIVATE KEY-----') || !privateKey?.trim().includes('-----END PRIVATE KEY-----')) {
    return {
      isValid: false,
      error: 'Invalid FIREBASE_PRIVATE_KEY format. The key must include the full certificate including BEGIN and END markers.'
    }
  }

  return { isValid: true }
}