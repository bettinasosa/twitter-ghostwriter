'use client'

import { createContext, useContext, useState, useEffect } from "react"
import { UserInterests } from "./models/User"
import { updateUser, getUser } from "@/app/actions/user"
import { useAuth } from "./AuthContext"

interface AppContextType {
  userInterests: UserInterests | null
  setUserInterests: (interests: UserInterests) => void
  isProfileComplete: boolean
  setIsProfileComplete: (complete: boolean) => void
  saveUserToDb: (data: { email: string; userInterests: UserInterests }) => Promise<void>
  isLoading: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userInterests, setUserInterests] = useState<UserInterests | null>(null)
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.email) {
        try {
          const userData = await getUser(user.email)
          if (userData.userInterests) {
            setUserInterests(userData.userInterests)
            setIsProfileComplete(true)
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [user?.email])

  const saveUserToDb = async (data: { email: string; userInterests: UserInterests }) => {
    await updateUser(data.email, { userInterests: data.userInterests })
    setUserInterests(data.userInterests)
    setIsProfileComplete(true)
  }

  return (
    <AppContext.Provider
      value={{
        userInterests,
        setUserInterests,
        isProfileComplete,
        setIsProfileComplete,
        saveUserToDb,
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
