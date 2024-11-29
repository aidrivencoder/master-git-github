'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User as FirebaseUser, Auth } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { User } from '@/types/user'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const authInstance: Auth = auth

  useEffect(() => {
    const unsubscribe = authInstance.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || undefined,
          subscription: {
            tier: 'free'
          },
          progress: {
            completedTutorials: [],
            achievements: []
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
        setUser(userData)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [authInstance])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
