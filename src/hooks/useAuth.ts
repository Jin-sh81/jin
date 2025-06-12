import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { AuthState } from '../types'

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(
      auth,
      (user: User | null) => {
        setAuthState({
          user: user ? {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          } : null,
          loading: false,
          error: null,
        })
      },
      (error) => {
        setAuthState({
          user: null,
          loading: false,
          error: error.message,
        })
      }
    )

    return () => unsubscribe()
  }, [])

  return authState
} 