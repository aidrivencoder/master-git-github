import { 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { auth } from './config'
import { Logger } from '@/lib/utils/logger'

export const githubAuth = new GithubAuthProvider()
githubAuth.addScope('read:user')
githubAuth.addScope('user:email')

export const signInWithGithub = () => {
  return signInWithPopup(auth, githubAuth)
}

export const signOut = () => {
  return firebaseSignOut(auth)
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    Logger.info(`User signed in: ${result.user.email}`, 'Auth')
    return { user: result.user, error: null }
  } catch (error) {
    Logger.error(`Email sign-in failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'Auth', error)
    return { user: null, error }
  }
}

export async function signUpWithEmail(email: string, password: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    Logger.info(`New user created: ${result.user.email}`, 'Auth')
    return { user: result.user, error: null }
  } catch (error) {
    Logger.error(`Email sign-up failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'Auth', error)
    return { user: null, error }
  }
}