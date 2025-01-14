import React, { createContext, useContext, useState, useEffect } from "react"
import { User } from "@/lib/models/User"
import { signIn, signOut, useSession } from "next-auth/react"

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { data: session, status } = useSession()

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (session?.user?.email) {
          const response = await fetch(
            `/api/auth/user?email=${encodeURIComponent(session.user.email)}`
          )
          const userData = await response.json()
          if (userData) {
            setUser(userData as User)
          }
        }
      } catch (error) {
        console.error("Error checking auth state:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [session])

  const signup = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (signInResult?.error) {
        throw new Error(signInResult.error)
      }

      const userData = await response.json()
      setUser(userData as User)
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (signInResult?.error) {
        throw new Error(signInResult.error)
      }

      const response = await fetch(
        `/api/auth/user?email=${encodeURIComponent(email)}`
      )
      const userData = await response.json()
      setUser(userData as User)
    } catch (error) {
      console.error("Error logging in:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut({ redirect: false })
      setUser(null)
    } catch (error) {
      console.error("Error logging out:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        signup,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
