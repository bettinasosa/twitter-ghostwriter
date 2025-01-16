'use server'

import { getTrendingTopics, TrendingTopic } from '@/lib/services/twitterClient'

export async function fetchTrendingTopics(): Promise<TrendingTopic[]> {
  try {
    return await getTrendingTopics()
  } catch (error) {
    console.error('Error fetching trending topics:', error)
    return []
  }
}

export async function fetchLocationTrends(lat: number, long: number): Promise<TrendingTopic[]> {
  try {
    return await getTrendingTopicsForLocation(lat, long)
  } catch (error) {
    console.error('Error fetching location trends:', error)
    return []
  }
} 