import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { User } from '@/types'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, token?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('rare_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Failed to parse stored user', e)
        localStorage.removeItem('rare_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User, token?: string) => {
    setUser(userData)
    localStorage.setItem('rare_user', JSON.stringify(userData))
    if (token) {
      localStorage.setItem('rare_token', token)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('rare_user')
    localStorage.removeItem('rare_token')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
