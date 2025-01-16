"use server"

import { connectDB } from "@/lib/services/db"
import { ScheduledTweet } from "@/lib/models/Schedule"
import { revalidatePath } from "next/cache"

export async function getScheduledTweets(userId: string) {
  try {
    const { db } = await connectDB()
    const scheduledTweets = await db
      .collection("scheduledTweets")
      .find({ userId })
      .toArray()

    return scheduledTweets.map(tweet => ({
      ...tweet,
      scheduledDate: new Date(tweet.scheduledDate)
    }))
  } catch (error) {
    console.error("Error fetching scheduled tweets:", error)
    throw new Error("Failed to fetch scheduled tweets")
  }
}

export async function scheduleNewTweet(
  userId: string,
  scheduledTweet: ScheduledTweet
) {
  try {
    const { db } = await connectDB()
    await db.collection("scheduledTweets").insertOne({
      ...scheduledTweet,
      userId,
      createdAt: new Date()
    })

    revalidatePath("/content-calendar")
    return { success: true }
  } catch (error) {
    console.error("Error scheduling tweet:", error)
    throw new Error("Failed to schedule tweet")
  }
}

export async function removeScheduledTweet(userId: string, tweetId: string) {
  try {
    const { db } = await connectDB()
    await db.collection("scheduledTweets").deleteOne({
      userId,
      id: tweetId
    })

    revalidatePath("/content-calendar")
    return { success: true }
  } catch (error) {
    console.error("Error removing scheduled tweet:", error)
    throw new Error("Failed to remove scheduled tweet")
  }
}
