'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { TweetEmbed } from "@/components/tweet-embed"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

export default function InterestingTweetsPage() {
  const [tweets, setTweets] = useState<string[]>([])
  const [newTweetUrl, setNewTweetUrl] = useState('')

  useEffect(() => {
    const storedTweets = localStorage.getItem('interestingTweets')
    if (storedTweets) {
      setTweets(JSON.parse(storedTweets))
    }
  }, [])

  const addTweet = () => {
    if (newTweetUrl) {
      const updatedTweets = [...tweets, newTweetUrl]
      setTweets(updatedTweets)
      localStorage.setItem('interestingTweets', JSON.stringify(updatedTweets))
      setNewTweetUrl('')
      toast({
        title: "Tweet added",
        description: "The tweet has been added to your interesting tweets.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-yellow-50/40 pt-24">
      <div className="max-w-[1400px] mx-auto px-6 bg-white/80 backdrop-blur-md rounded-lg border border-white/20 shadow-xl">
        <h1 className="text-4xl font-medium tracking-tight text-gray-900 mb-1">Interesting Tweets</h1>
        <div className="flex gap-2 mb-6">
          <Input
            type="text"
            placeholder="Enter tweet URL"
            value={newTweetUrl}
            onChange={(e) => setNewTweetUrl(e.target.value)}
          />
          <Button onClick={addTweet}>Add Tweet</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tweets.map((tweetUrl, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <TweetEmbed url={tweetUrl} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

