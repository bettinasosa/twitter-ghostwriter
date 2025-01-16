"use server"

import { TwitterApi } from "twitter-api-v2"

// Create a client with only bearer token for app-only auth
const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN!)

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
    console.log("Fetching trends with bearer token:", process.env.TWITTER_BEARER_TOKEN?.slice(0, 10) + "...")
    
    // Using v1.1 endpoint for worldwide trends (woeid: 1)
    const response = await twitterClient.v1.get('trends/place.json', {
      id: '1' // 1 is the woeid for worldwide
    })
    console.log("Twitter API response:", response)

    if (response?.[0]?.trends) {
      return response[0].trends.map((trend: TwitterTrend) => ({
        trend_name: trend.name,
        post_count: trend.tweet_volume
      }))
    }
    
    console.log("No trends found in response")
    return []
  } catch (error) {
    console.error("Detailed error fetching trends:", error)
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
