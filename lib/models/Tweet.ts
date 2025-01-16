export interface Tweet {
  id: string
  title: string
  content: string | string[]
  type: "short-form" | "thread" | "long-form"
  createdAt: number
}

export interface SavedTweet extends Tweet {
  savedAt: number
}
