import { z } from "zod"

export const TweetTypeSchema = z.enum(["short-form", "thread", "long-form"])
export type TweetType = z.infer<typeof TweetTypeSchema>

export const TweetSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.union([z.string(), z.array(z.string())]),
  type: TweetTypeSchema
})
export type Tweet = z.infer<typeof TweetSchema>
