import { 
  signInWithPopup, 
  GithubAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { auth } from './config'

export const githubAuth = new GithubAuthProvider()

export const signInWithGithub = () => {
  return signInWithPopup(auth, githubAuth)
}

export const signOut = () => {
  return firebaseSignOut(auth)
}

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}