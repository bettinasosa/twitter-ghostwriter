import { getUsersCollection } from "./db"
import { User } from "../models/User"

export const mongoService = {
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
    return result?.value
  }
}
