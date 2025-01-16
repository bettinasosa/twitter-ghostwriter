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

interface TwitterTrendResponse {
  category?: string
  post_count?: string | number
  trend_name: string
  trending_since?: string
  tweet_count?: number
}

interface TrendResponse {
  trend_name: string
  tweet_count?: number
}

export async function getPersonalizedTrends(): Promise<TrendingTopic[]> {
  try {
    // Using v2 endpoint for personalized trends
    const response = await twitterClient.v2.get("users/personalized_trends", {
      "personalized_trend.fields": [
        "category",
        "post_count",
        "trend_name",
        "trending_since"
      ]
    })

    if (response.data) {
      return response.data.map((trend: TwitterTrendResponse) => ({
        category: trend.category,
        post_count: trend.post_count || trend.tweet_count,
        trend_name: trend.trend_name,
        trending_since: trend.trending_since
      }))
    }
    return []
  } catch (error) {
    console.error("Error fetching personalized trends:", error)
    return []
  }
}

export async function getTrendingTopics(
  woeid: number = 1
): Promise<TrendingTopic[]> {
  try {
    // Using v2 endpoint for general trends
    const response = await twitterClient.v2.get(`trends/by/woeid/${woeid}`, {
      max_trends: 50,
      "trend.fields": ["trend_name", "tweet_count"]
    })

    if (response.data) {
      return response.data.map((trend: TrendResponse) => ({
        trend_name: trend.trend_name,
        post_count: trend.tweet_count
      }))
    }
    return []
  } catch (error) {
    console.error("Error fetching general trends:", error)
    return []
  }
}

// Function to get the best available trends
export async function getBestAvailableTrends(
  userToken?: string
): Promise<TrendingTopic[]> {
  try {
    // If user is authenticated, try personalized trends first
    if (userToken) {
      try {
        const personalizedTrends = await getPersonalizedTrends()
        if (personalizedTrends.length > 0) {
          return personalizedTrends
        }
      } catch (error) {
        console.error("Error fetching personalized trends:", error)
      }
    }

    // Fallback to general trends
    return getTrendingTopics()
  } catch (error) {
    console.error("Error fetching trends:", error)
    return []
  }
}
