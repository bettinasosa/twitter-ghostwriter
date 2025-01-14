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
  description: z.string(),
  tones: z.array(z.string()),
  audience: z.string(),
  goals: z.array(z.string()),
  postingFrequency: z.string(),
  aiPersona: z.string(),
  aiBackstory: z.string(),
  writingStyle: z.string(),
  humorLevel: z.number(),
  emojiUsage: z.enum(["none", "minimal", "moderate", "liberal"]),
  hashtagPreference: z.enum(["none", "few", "moderate", "many"]),
  twitterHandle: z.string().optional(),
  preferredWritingStyles: z.array(z.string())
})
export type UserInterests = z.infer<typeof UserInterestsSchema>

// User schema
export const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  image: z.string().optional(),
  tweets: z.array(TweetSchema).optional(),
  savedTweets: z.array(TweetSchema).optional(),
  scheduledTweets: z.array(TweetSchema).optional(),
  userInterests: UserInterestsSchema.optional()
})
export type User = z.infer<typeof UserSchema>
