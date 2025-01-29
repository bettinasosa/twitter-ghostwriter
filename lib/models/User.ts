import { z } from "zod"
import { ObjectId } from "mongodb"

export const UserInterestsSchema = z.object({
  topics: z.array(z.string()),
  tones: z.array(z.string()),
  audience: z.string(),
  goals: z.array(z.string()),
  postingFrequency: z.string(),
  aiPersona: z.string(),
  aiBackstory: z.string(),
  humorLevel: z.number(),
  emojiUsage: z.enum(["none", "minimal", "moderate", "liberal"]),
  hashtagPreference: z.enum(["none", "minimal", "moderate", "liberal"]),
  preferredWritingStyles: z.array(z.string()),
  twitterHandle: z.string()
})

export const UserSchema = z.object({
  _id: z.instanceof(ObjectId),
  id: z.string(), // UI friendly ID
  email: z.string().email(),
  password: z.string(),
  userInterests: UserInterestsSchema.nullable(),
  created_at: z.date(),
  updated_at: z.date()
})

export type UserInterests = z.infer<typeof UserInterestsSchema>
export type User = z.infer<typeof UserSchema>

export function mapUserFromDB(doc: any): User {
  return {
    _id: doc._id,
    id: doc._id.toString(),
    email: doc.email,
    password: doc.password,
    userInterests: doc.userInterests,
    created_at: new Date(doc.created_at),
    updated_at: new Date(doc.updated_at)
  }
}
