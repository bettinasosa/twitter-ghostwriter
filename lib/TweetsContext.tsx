'use client'

import { createContext, useContext, useState } from "react"
import { Tweet, SavedTweet } from "./models/Tweet"

interface TweetsContextType {
  tweets: Tweet[]
  savedTweets: SavedTweet[]
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