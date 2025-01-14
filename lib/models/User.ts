import { z } from "zod"

// Define the base schemas
export const TweetTypeSchema = z.enum(["short-form", "thread", "long-form"])
export type TweetType = z.infer<typeof TweetTypeSchema>

export const TweetSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.union([z.string(), z.array(z.string())]),
  type: TweetTypeSchema
})
export type Tweet = z.infer<typeof TweetSchema>

export const UserInterestsSchema = z.object({
  topics: z.array(z.string()),
  tones: z.array(z.string()),
  audience: z.string(),
  goals: z.array(z.string()),
  postingFrequency: z.string(),
  aiPersona: z.string(),
  aiBackstory: z.string(),
  humorLevel: z.number().min(0).max(100),
  emojiUsage: z.enum(["none", "minimal", "moderate", "liberal"]),
  hashtagPreference: z.enum(["none", "minimal", "moderate", "liberal"]),
  preferredWritingStyles: z.array(z.string()),
  twitterHandle: z.string()
})

// Update User schema to include auth fields
export const UserSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  password: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  userInterests: UserInterestsSchema.nullable()
})

export type UserInterests = z.infer<typeof UserInterestsSchema>
export type User = z.infer<typeof UserSchema>

// Helper type for creating a new user
export type CreateUserInput = Omit<User, '_id' | 'created_at' | 'updated_at'>
