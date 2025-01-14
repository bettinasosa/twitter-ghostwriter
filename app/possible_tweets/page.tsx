"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { generateNewTweet } from "../actions/generate-tweet"
import { toast } from "@/components/ui/use-toast"
import {
  AlertCircle,
  Bookmark,
  BookmarkCheck,
  Loader2,
  Trash2,
  Calendar
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface SavedTweet {
  savedAt: number
}

export default function PossibleTweetsPage() {
  // Initialize with empty arrays instead of undefined
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [savedTweets, setSavedTweets] = useState<SavedTweet[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSaved, setShowSaved] = useState(false)

  const handleGenerateNewTweet = async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log("Client: Starting tweet generation")
      const newTweet = await generateNewTweet()
      console.log("Client: Received new tweet:", newTweet)
      setTweets(prevTweets => [
        {
          id: ((prevTweets?.length || 0) + 1).toString(),
          ...newTweet
        },
        ...(prevTweets || [])
      ])
      toast({
        title: "New tweet generated",
        description: "A new tweet has been added to your list."
      })
    } catch (error) {
      console.error("Client: Error generating new tweet:", error)
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveTweet = (tweet: Tweet) => {
    const savedTweet: SavedTweet = {
      ...tweet,
      savedAt: Date.now()
    }
    setSavedTweets(prev => [savedTweet, ...(prev || [])])
    toast({
      title: "Tweet saved",
      description: "The tweet has been saved to your collection."
    })
  }

  const handleUnsaveTweet = (tweetId: string) => {
    setSavedTweets(prev => (prev || []).filter(tweet => tweet.id !== tweetId))
    toast({
      title: "Tweet removed",
      description: "The tweet has been removed from your saved collection."
    })
  }

  const handleDeleteTweet = (tweetId: string) => {
    setTweets(prev => (prev || []).filter(tweet => tweet.id !== tweetId))
    setSavedTweets(prev => (prev || []).filter(tweet => tweet.id !== tweetId))
    toast({
      title: "Tweet deleted",
      description: "The tweet has been permanently deleted."
    })
  }

  // Ensure we're working with arrays even if undefined
  const displayedTweets = showSaved ? savedTweets || [] : tweets || []

  const getTagColor = (type: string) => {
    switch (type) {
      case "short-form":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "long-form":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "thread":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-background via-muted/50 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-medium tracking-tight text-gray-900 mb-1">
              {showSaved ? "Saved Tweets" : "Generated Tweets"}
            </h1>
            <p className="text-gray-600">
              {showSaved
                ? "Your collection of saved tweets for later use"
                : "AI-generated tweets based on your profile"}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowSaved(!showSaved)}
              className={cn("min-w-[140px]", showSaved && "bg-secondary")}
            >
              {showSaved ? (
                <BookmarkCheck className="mr-2 h-4 w-4" />
              ) : (
                <Bookmark className="mr-2 h-4 w-4" />
              )}
              {showSaved ? "View All" : "View Saved"}
            </Button>
            <Button
              onClick={handleGenerateNewTweet}
              disabled={isLoading || showSaved}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate New Tweet"
              )}
            </Button>
            <Link href="/content-calendar">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Content Calendar
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedTweets.map(tweet => (
            <Card key={tweet.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium line-clamp-1 flex-grow pr-2">
                  {tweet.title}
                </CardTitle>
                <Badge className={cn("ml-2 shrink-0", getTagColor(tweet.type))}>
                  {tweet.type.replace("-", " ")}
                </Badge>
              </CardHeader>
              <CardContent className="flex-grow">
                <Link href={`/tweet/${tweet.id}`}>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {Array.isArray(tweet.content)
                      ? tweet.content[0]
                      : tweet.content}
                  </p>
                </Link>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-2">
                <div className="flex gap-2">
                  {!("savedAt" in tweet) ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-muted-foreground hover:text-foreground"
                      onClick={() => handleSaveTweet(tweet)}
                    >
                      <Bookmark className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-muted-foreground hover:text-foreground"
                      onClick={() => handleUnsaveTweet(tweet.id)}
                    >
                      <BookmarkCheck className="h-4 w-4 mr-1" />
                      Unsave
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteTweet(tweet.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
                {"savedAt" in tweet && (
                  <p className="text-xs text-muted-foreground">
                    Saved {new Date(tweet.savedAt).toLocaleDateString()}
                  </p>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {displayedTweets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {showSaved
                ? "You haven't saved any tweets yet. Save some tweets to view them here."
                : "No tweets generated yet. Click 'Generate New Tweet' to get started."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
