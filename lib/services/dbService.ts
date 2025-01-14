import { getUsersCollection } from "./db"
import { Tweet, User, UserInterests } from "../models/User"

export const dbService = {
  async getUser(email: string) {
    const collection = await getUsersCollection()
    return collection.findOne({ email })
  },

  async updateUser(email: string, userData: Partial<User>) {
    const collection = await getUsersCollection()
    const result = await collection.findOneAndUpdate(
      { email },
      { $set: userData },
      { returnDocument: "after", upsert: true }
    )
    return result!.value
  },

  async updateUserInterests(email: string, interests: UserInterests) {
    const collection = await getUsersCollection()
    const result = await collection.findOneAndUpdate(
      { email },
      { $set: { userInterests: interests } },
      { returnDocument: "after" }
    )
    return result!.value
  },

  async saveTweets(email: string, tweets: Tweet[]) {
    const collection = await getUsersCollection()
    const result = await collection.findOneAndUpdate(
      { email },
      { $set: { tweets } },
      { returnDocument: "after" }
    )
    return result!.value
  },

  async saveScheduledTweets(email: string, scheduledTweets: Tweet[]) {
    const collection = await getUsersCollection()
    const result = await collection.findOneAndUpdate(
      { email },
      { $set: { scheduledTweets } },
      { returnDocument: "after" }
    )
    return result!.value
  },

  async saveSavedTweets(email: string, savedTweets: Tweet[]) {
    const collection = await getUsersCollection()
    const result = await collection.findOneAndUpdate(
      { email },
      { $set: { savedTweets } },
      { returnDocument: "after" }
    )
    return result!.value
  }
}
