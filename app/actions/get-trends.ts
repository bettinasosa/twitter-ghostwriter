"use server"

import { TwitterApi } from "twitter-api-v2"

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET
})

export interface TrendingTopic {
  category?: string
  post_count?: string | number
  trend_name: string
  trending_since?: string
  url?: string
}

interface TwitterTrend {
  name: string
  tweet_volume: number | null
}

export async function fetchTrendingTopics(): Promise<TrendingTopic[]> {
  try {
    const response = await twitterClient.v2.get("trends/available", {
      max_trends: 50
    })

    if (response.data) {
      return response.data.map((trend: TwitterTrend) => ({
        trend_name: trend.name,
        post_count: trend.tweet_volume
      }))
    }
    return []
  } catch (error) {
    console.error("Error fetching trends:", error)
    return []
  }
}

// export async function fetchLocationTrends(lat: number, long: number): Promise<TrendingTopic[]> {
//   try {
//     return await getTrendingTopicsForLocation(lat, long)
//   } catch (error) {
//     console.error('Error fetching location trends:', error)
//     return []
//   }
// }
