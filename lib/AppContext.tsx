import React, { createContext, useContext, useState, useEffect } from "react"
import { Tweet, User, UserInterests, UserSchema } from "./models/User"
import { dbService } from "./services/dbService"

interface AppContextType {
  tweets: Tweet[]
  setTweets: React.Dispatch<React.SetStateAction<Tweet[]>>
  savedTweets: Tweet[]
  setSavedTweets: React.Dispatch<React.SetStateAction<Tweet[]>>
  scheduledTweets: Tweet[]
  setScheduledTweets: React.Dispatch<React.SetStateAction<Tweet[]>>
  userInterests: UserInterests | null
  setUserInterests: React.Dispatch<React.SetStateAction<UserInterests | null>>
  addTweet: (tweet: Tweet) => Promise<void>
  isProfileComplete: boolean
  setIsProfileComplete: React.Dispatch<React.SetStateAction<boolean>>
  currentUser: User | null
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>
  saveUserToDb: (userData: Partial<User>) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [savedTweets, setSavedTweets] = useState<Tweet[]>([])
  const [scheduledTweets, setScheduledTweets] = useState<Tweet[]>([])
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [userInterests, setUserInterests] = useState<UserInterests | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Load user data when currentUser changes
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser?.email) {
        const user = await dbService.getUser(currentUser.email)
        if (user) {
          if (user.tweets) setTweets(user.tweets)
          if (user.savedTweets) setSavedTweets(user.savedTweets)
          if (user.scheduledTweets) setScheduledTweets(user.scheduledTweets)
          if (user.userInterests) {
            setUserInterests(user.userInterests)
            setIsProfileComplete(true)
          }
        }
      }
    }

    loadUserData()
  }, [currentUser?.email])

  // Save data to MongoDB whenever it changes
  useEffect(() => {
    const saveData = async () => {
      if (currentUser?.email) {
        await Promise.all([
          dbService.saveTweets(currentUser.email, tweets),
          dbService.saveSavedTweets(currentUser.email, savedTweets),
          dbService.saveScheduledTweets(currentUser.email, scheduledTweets)
        ])
      }
    }

    if (currentUser?.email) {
      saveData()
    }
  }, [tweets, savedTweets, scheduledTweets, currentUser?.email])

  const addTweet = async (tweet: Tweet) => {
    const newTweets = [tweet, ...tweets]
    setTweets(newTweets)
    if (currentUser?.email) {
      await dbService.saveTweets(currentUser.email, newTweets)
    }
  }

  const saveUserToDb = async (userData: Partial<User>) => {
    try {
      const validatedUser = UserSchema.partial().parse(userData)
      const user = await dbService.updateUser(
        validatedUser.email!,
        validatedUser
      )

      if (!user) {
        throw new Error("Failed to save user")
      }

      setCurrentUser(user)

      if (user.userInterests) {
        setUserInterests(user.userInterests)
        setIsProfileComplete(true)
      }
    } catch (error) {
      console.error("Error saving user to database:", error)
      throw error
    }
  }

  return (
    <AppContext.Provider
      value={{
        tweets,
        setTweets,
        savedTweets,
        setSavedTweets,
        scheduledTweets,
        setScheduledTweets,
        userInterests,
        setUserInterests,
        addTweet,
        isProfileComplete,
        setIsProfileComplete,
        currentUser,
        setCurrentUser,
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
