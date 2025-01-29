import { z } from "zod"
import { ObjectId } from "mongodb"

export const TweetSchema = z.object({
  _id: z.instanceof(ObjectId),
  id: z.string(), // UI friendly ID
  title: z.string(),
  content: z.union([z.string(), z.array(z.string())]),
  type: z.enum(["short-form", "thread", "long-form"]),
  scheduledDate: z.date().optional(),
  userId: z.instanceof(ObjectId),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const SavedTweetSchema = TweetSchema.extend({
  savedAt: z.number()
})

export type Tweet = z.infer<typeof TweetSchema>
export type SavedTweet = z.infer<typeof SavedTweetSchema>

// Helper function to convert MongoDB document to UI model
export function mapTweetFromDB(doc: any): Tweet {
  return {
    _id: doc._id,
    id: doc._id.toString(), // Use MongoDB _id as UI id
    title: doc.title,
    content: doc.content,
    type: doc.type,
    scheduledDate: doc.scheduledDate ? new Date(doc.scheduledDate) : undefined,
    userId: doc.userId,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt)
  }
}
