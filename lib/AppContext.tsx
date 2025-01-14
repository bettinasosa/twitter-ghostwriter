'use client'

import { createContext, useContext, useState } from "react"
import { UserInterests } from "./models/User"
import { updateUser } from "@/app/actions/user"

interface AppContextType {
  userInterests: UserInterests | null
  setUserInterests: (interests: UserInterests) => void
  isProfileComplete: boolean
  setIsProfileComplete: (complete: boolean) => void
  saveUserToDb: (data: { email: string; userInterests: UserInterests }) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userInterests, setUserInterests] = useState<UserInterests | null>(null)
  const [isProfileComplete, setIsProfileComplete] = useState(false)

  const saveUserToDb = async (data: { email: string; userInterests: UserInterests }) => {
    await updateUser(data.email, { userInterests: data.userInterests })
  }

  return (
    <AppContext.Provider
      value={{
        userInterests,
        setUserInterests,
        isProfileComplete,
        setIsProfileComplete,
        saveUserToDb
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
