"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { Tweet, SavedTweet, mapTweetFromDB } from "./models/Tweet"
import { useAuth } from "./AuthContext"
import { getScheduledTweets } from "@/app/actions/schedule"

interface TweetsContextType {
  tweets: Tweet[]
  savedTweets: SavedTweet[]
  scheduledTweets: Tweet[]
  addTweet: (tweet: Omit<Tweet, "id">) => void
  deleteTweet: (id: string) => void
  saveTweet: (tweet: Tweet) => void
  unsaveTweet: (id: string) => void
  setTweets: React.Dispatch<React.SetStateAction<Tweet[]>>
  setSavedTweets: React.Dispatch<React.SetStateAction<SavedTweet[]>>
}

const TweetsContext = createContext<TweetsContextType | undefined>(undefined)

export function TweetsProvider({ children }: { children: React.ReactNode }) {
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [savedTweets, setSavedTweets] = useState<SavedTweet[]>([])
  const [scheduledTweets, setScheduledTweets] = useState<Tweet[]>([])
  const { user } = useAuth()

  useEffect(() => {
    const loadScheduledTweets = async () => {
      if (user?.id) {
        try {
          const dbTweets = await getScheduledTweets(user.id)
          const mappedTweets = dbTweets.map(mapTweetFromDB)
          setScheduledTweets(mappedTweets)
        } catch (error) {
          console.error("Error loading scheduled tweets:", error)
        }
      }
    }

    loadScheduledTweets()
  }, [user?.id])

  const addTweet = (newTweet: Omit<Tweet, "id">) => {
    const tweet: Tweet = {
      ...newTweet,
      id: (tweets.length + 1).toString()
    }
    setTweets(prev => [tweet, ...prev])
  }

  const deleteTweet = (id: string) => {
    setTweets(prev => prev.filter(tweet => tweet.id !== id))
    setSavedTweets(prev => prev.filter(tweet => tweet.id !== id))
  }

  const saveTweet = (tweet: Tweet) => {
    const savedTweet: SavedTweet = {
      ...tweet,
      savedAt: Date.now()
    }
    setSavedTweets(prev => [savedTweet, ...prev])
  }

  const unsaveTweet = (id: string) => {
    setSavedTweets(prev => prev.filter(tweet => tweet.id !== id))
  }

  return (
    <TweetsContext.Provider
      value={{
        tweets,
        savedTweets,
        scheduledTweets,
        addTweet,
        deleteTweet,
        saveTweet,
        unsaveTweet,
        setTweets,
        setSavedTweets
      }}
    >
      {children}
    </TweetsContext.Provider>
  )
}

export const useTweets = () => {
  const context = useContext(TweetsContext)
  if (context === undefined) {
    throw new Error("useTweets must be used within a TweetsProvider")
  }
  return context
}
