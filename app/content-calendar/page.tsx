"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format, startOfWeek, addDays, isSameDay } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useAppContext } from "@/lib/AppContext"
import Link from "next/link"
import { GeistSans } from "geist/font/sans"
import { ProfileRequiredRoute } from "@/components/ProtectedRoute"
import { Tweet } from "@/lib/models/Tweet"

interface ScheduledTweet extends Tweet {
  scheduledDate: Date
}

export default ProfileRequiredRoute(function ContentCalendarPage() {
  const { savedTweets, setSavedTweets } = useAppContext()
  const [scheduledTweets, setScheduledTweets] = useState<ScheduledTweet[]>([])
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date())
  )

  useEffect(() => {
    const storedScheduledTweets = JSON.parse(
      localStorage.getItem("scheduledTweets") || "[]"
    )
    setScheduledTweets(
      storedScheduledTweets.map((tweet: ScheduledTweet) => ({
        ...tweet,
        scheduledDate: new Date(tweet.scheduledDate)
      }))
    )
  }, [])

  const handleScheduleTweet = (tweet: Tweet, date: Date) => {
    const scheduledTweet: ScheduledTweet = {
      ...tweet,
      scheduledDate: date
    }
    setScheduledTweets(prev => [...prev, scheduledTweet])
    setSavedTweets(prev => prev.filter(t => t.id !== tweet.id))

    localStorage.setItem(
      "scheduledTweets",
      JSON.stringify([...scheduledTweets, scheduledTweet])
    )
    localStorage.setItem(
      "savedTweets",
      JSON.stringify(savedTweets.filter(t => t.id !== tweet.id))
    )
  }

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

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  )

  return (
    <div className="min-h-screen bg-yellow-50/40 pt-24">
      <div
        className={`${GeistSans.className} p-6 max-w-[1400px] mx-auto bg-white/80 backdrop-blur-md rounded-lg border border-white/20 shadow-xl`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-medium tracking-tight text-gray-900 mb-1">
            Content Calendar
          </h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {format(currentWeekStart, "MMM d, yyyy")} -{" "}
              {format(addDays(currentWeekStart, 6), "MMM d, yyyy")}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day, index) => (
            <Card key={index} className="min-h-[200px] border shadow-sm">
              <CardHeader className="p-2">
                <CardTitle className="text-sm font-medium">
                  {format(day, "EEE, MMM d")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                {scheduledTweets
                  .filter(tweet => isSameDay(tweet.scheduledDate, day))
                  .map(tweet => (
                    <div
                      key={tweet.id}
                      className="mb-2 p-2 bg-secondary rounded-md"
                    >
                      <Link
                        href={`/tweet/${tweet.id}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {tweet.title}
                      </Link>
                      <Badge className={cn("mt-1", getTagColor(tweet.type))}>
                        {tweet.type}
                      </Badge>
                    </div>
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-4xl font-medium tracking-tight text-gray-900 mb-1 mt-8">
          Saved Tweets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedTweets.map(tweet => (
            <Card key={tweet.id} className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">{tweet.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {Array.isArray(tweet.content)
                    ? tweet.content[0]
                    : tweet.content}
                </p>
                <div className="flex justify-between items-center">
                  <Badge className={cn(getTagColor(tweet.type))}>
                    {tweet.type}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleScheduleTweet(tweet, new Date())}
                  >
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
})
