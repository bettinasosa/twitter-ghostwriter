import { Tweet, User, UserInterests } from "../models/User"

export const dbService = {
  async getUser(email: string) {
    const response = await fetch(`/api/users?email=${email}`)
    if (!response.ok) throw new Error("Failed to fetch user")
    return response.json()
  },

  async updateUser(email: string, userData: Partial<User>) {
    const response = await fetch("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, ...userData })
    })
    if (!response.ok) throw new Error("Failed to update user")
    return response.json()
  },

  async updateUserInterests(email: string, interests: UserInterests) {
    return this.updateUser(email, { userInterests: interests })
  },

  async saveTweets(email: string, tweets: Tweet[]) {
    return this.updateUser(email, { tweets })
  },

  async saveScheduledTweets(email: string, scheduledTweets: Tweet[]) {
    return this.updateUser(email, { scheduledTweets })
  },

  async saveSavedTweets(email: string, savedTweets: Tweet[]) {
    return this.updateUser(email, { savedTweets })
  }
}
