"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { CopyableTextBox } from "@/components/copyable-text-box"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Edit, Save, X, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAppContext } from "@/lib/AppContext"
import { format } from "date-fns"

export default function TweetPage() {
  const params = useParams()
  const router = useRouter()
  const { tweets, setTweets, scheduledTweets } = useAppContext()
  const [tweet, setTweet] = useState<Tweet | undefined>(undefined)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState("")
  const [editedContent, setEditedContent] = useState("")
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null)

  useEffect(() => {
    const foundTweet = tweets.find(t => t.id === params.id)
    if (foundTweet) {
      setTweet(foundTweet)
      setEditedTitle(foundTweet.title)
      setEditedContent(
        Array.isArray(foundTweet.content)
          ? foundTweet.content.join("\n\n")
          : foundTweet.content
      )
    }
  }, [params.id, tweets])

  useEffect(() => {
    const scheduledTweet = scheduledTweets.find(t => t.id === params.id)
    if (scheduledTweet) {
      setScheduledDate(scheduledTweet.scheduledDate)
    }
  }, [scheduledTweets, params.id])

  if (!tweet) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tweet not found</h1>
          <Button onClick={() => router.push("/ghost-writer")}>
            Return to Ghost Writer
          </Button>
        </div>
      </div>
    )
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    const updatedTweet = {
      ...tweet,
      title: editedTitle,
      content:
        tweet.type === "thread" ? editedContent.split("\n\n") : editedContent
    }
    setTweet(updatedTweet)
    setTweets(prevTweets =>
      prevTweets.map(t => (t.id === tweet.id ? updatedTweet : t))
    )
    setIsEditing(false)
    toast({
      title: "Tweet updated",
      description: "Your changes have been saved."
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedTitle(tweet.title)
    setEditedContent(
      Array.isArray(tweet.content) ? tweet.content.join("\n\n") : tweet.content
    )
  }

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          href="/ghost-writer"
          className="inline-flex items-center mb-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Ghost Writer
        </Link>
        <div className="flex justify-between items-center mb-6">
          {isEditing ? (
            <Input
              value={editedTitle}
              onChange={e => setEditedTitle(e.target.value)}
              className="text-3xl font-bold"
            />
          ) : (
            <h1 className="text-4xl font-medium tracking-tight text-gray-900 mb-1">
              {tweet.title}
            </h1>
          )}
          <Badge variant="outline" className="capitalize">
            {tweet.type.replace("-", " ")}
          </Badge>
        </div>

        {scheduledDate && (
          <div className="mt-4 p-2 bg-secondary rounded-md">
            <p className="text-sm font-medium">
              Scheduled for: {format(scheduledDate, "PPP")}
            </p>
          </div>
        )}

        {isEditing ? (
          <Textarea
            value={editedContent}
            onChange={e => setEditedContent(e.target.value)}
            className="min-h-[200px] mb-4"
          />
        ) : tweet.type === "thread" && Array.isArray(tweet.content) ? (
          <div className="space-y-4">
            {tweet.content.map((content, index) => (
              <div key={index}>
                <CopyableTextBox text={content} />
                {index < tweet.content.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <CopyableTextBox text={tweet.content as string} />
        )}

        <div className="mt-6 flex justify-end space-x-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Tweet
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
