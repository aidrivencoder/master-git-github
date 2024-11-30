'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User as FirebaseUser, Auth } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { User } from '@/types/user'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

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
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          // Convert Firestore Timestamps to Dates
          const user: User = {
            ...userData,
            subscription: {
              ...userData.subscription,
              validUntil: userData.subscription?.validUntil?.toDate(),
            },
            createdAt: userData.createdAt?.toDate(),
            updatedAt: userData.updatedAt?.toDate(),
          } as User
          setUser(user)
        } else {
          // Fallback to basic user data if Firestore document doesn't exist
          const userData: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || undefined,
            subscription: {
              tier: 'free',
              status: 'none'
            },
            progress: {
              completedTutorials: [],
              achievements: []
            },
            createdAt: new Date(),
            updatedAt: new Date()
          }
          setUser(userData)
        }
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
