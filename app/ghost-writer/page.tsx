"use client"

import { useState, useEffect } from "react"
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
  Calendar,
  PenTool,
  AlignLeft,
  Hash,
  List,
  TrendingUp
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { useAppContext } from "@/lib/AppContext"
import { useTweets } from "@/lib/TweetsContext"
import { Tweet } from "@/lib/models/Tweet"
import { GeistSans } from "geist/font/sans"
import { ProfileRequiredRoute } from "@/components/ProtectedRoute"
import { fetchTrendingTopics, TrendingTopic } from "../actions/get-trends"

export default function GhostWriterPage() {
  const { userInterests } = useAppContext()
  const { tweets, savedTweets, addTweet, deleteTweet, saveTweet, unsaveTweet } =
    useTweets()
  const [isLoading, setIsLoading] = useState(false)
  const [isTrendsLoading, setIsTrendsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSaved, setShowSaved] = useState(false)
  const [selectedTweetType, setSelectedTweetType] = useState<
    "short-form" | "thread" | "long-form"
  >("short-form")
  const [trends, setTrends] = useState<TrendingTopic[]>([])

  useEffect(() => {
    const loadTrends = async () => {
      setIsTrendsLoading(true)
      try {
        const trendingTopics = await fetchTrendingTopics()
        setTrends(trendingTopics)
      } catch (error) {
        console.error("Error loading trends:", error)
        toast({
          title: "Error loading trends",
          description: "Unable to load trending topics",
          variant: "destructive"
        })
      } finally {
        setIsTrendsLoading(false)
      }
    }

    loadTrends()
  }, [])

  const handleGenerateNewTweet = async (trend?: TrendingTopic) => {
    setIsLoading(true)
    setError(null)
    try {
      const newTweet = await generateNewTweet(
        userInterests,
        selectedTweetType,
        trend?.trend_name
      )
      addTweet(newTweet)
      toast({
        title: "New tweet generated",
        description: trend
          ? `Generated tweet about "${trend.trend_name}"`
          : "A new tweet has been added to your list."
      })
    } catch (error) {
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
    saveTweet(tweet)
    toast({
      title: "Tweet saved",
      description: "The tweet has been saved to your collection."
    })
  }

  const handleUnsaveTweet = (tweetId: string) => {
    unsaveTweet(tweetId)
    toast({
      title: "Tweet removed",
      description: "The tweet has been removed from your saved collection."
    })
  }

  const handleDeleteTweet = (tweetId: string) => {
    deleteTweet(tweetId)
    toast({
      title: "Tweet deleted",
      description: "The tweet has been permanently deleted."
    })
  }

  const displayedTweets = showSaved ? savedTweets : tweets

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
    <div className="min-h-screen bg-yellow-50/40 pt-24">
      <div
        className={`${GeistSans.className} p-6 max-w-[1400px] mx-auto bg-white/80 backdrop-blur-md rounded-lg border border-white/20 shadow-xl`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-medium tracking-tight text-gray-900 mb-1">
              Ghost Writer
            </h1>
            <p className="text-gray-600">
              AI-generated tweets based on your profile and custom inputs
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
            <Link href="/content-calendar">
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Content Calendar
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <Button
              variant={
                selectedTweetType === "short-form" ? "default" : "outline"
              }
              onClick={() => setSelectedTweetType("short-form")}
            >
              <Hash className="mr-2 h-4 w-4" />
              Short Form
            </Button>
            <Button
              variant={selectedTweetType === "thread" ? "default" : "outline"}
              onClick={() => setSelectedTweetType("thread")}
            >
              <List className="mr-2 h-4 w-4" />
              Thread
            </Button>
            <Button
              variant={
                selectedTweetType === "long-form" ? "default" : "outline"
              }
              onClick={() => setSelectedTweetType("long-form")}
            >
              <AlignLeft className="mr-2 h-4 w-4" />
              Long Form
            </Button>
          </div>
          <Button onClick={() => handleGenerateNewTweet()} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <PenTool className="mr-2 h-4 w-4" />
                Generate Tweet
              </>
            )}
          </Button>
        </div>

        {error && (
          <Alert
            variant="destructive"
            className="mb-6 border-0 bg-red-500/10 text-white"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Trending Topics Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-lg font-medium">Trending Topics</h2>
            {isTrendsLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
          {trends.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {trends.map((trend, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-1 cursor-pointer hover:bg-secondary/80"
                  onClick={() => handleGenerateNewTweet(trend)}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {trend.trend_name}
                  {trend.post_count && (
                    <span className="ml-2 text-xs opacity-70">
                      {Intl.NumberFormat("en", { notation: "compact" }).format(
                        Number(trend.post_count)
                      )}
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          ) : (
            !isTrendsLoading && (
              <p className="text-sm text-muted-foreground">
                No trending topics available
              </p>
            )
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedTweets.map(tweet => (
            <Card key={tweet.id} className="flex flex-col border shadow-sm">
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
                    Saved {new Date(tweet.savedAt as number).toLocaleDateString()}
                  </p>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {displayedTweets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {showSaved
                ? "You haven't saved any tweets yet. Save some tweets to view them here."
                : "No tweets generated yet. Use the 'Generate Tweet' button to get started."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
