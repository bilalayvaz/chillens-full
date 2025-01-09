// contexts/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react'
import { useLogin } from '@lens-protocol/react-web'

interface AuthContextType {
  isAuthenticated: boolean
  activeProfile: string | null
  authenticate: (address: string, profileId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeProfile, setActiveProfile] = useState<string | null>(null)
  const { execute: login } = useLogin()

  const authenticate = async (address: string, profileId: string) => {
    try {
      await login({ address })
      setIsAuthenticated(true)
      setActiveProfile(profileId)
    } catch (error) {
      console.error('Auth error:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      activeProfile,
      authenticate 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}