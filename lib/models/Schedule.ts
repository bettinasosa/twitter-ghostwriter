import { Tweet } from "./Tweet"

export interface ScheduledTweet extends Tweet {
  userId: string
  scheduledDate: Date
} 