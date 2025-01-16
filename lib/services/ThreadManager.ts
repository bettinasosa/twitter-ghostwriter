import OpenAI from "openai"
import Logger from "@/utils/logger"
import { UserInterests } from "@/lib/models/User"

export class ThreadManager {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }

  async createThread(userInterests: UserInterests): Promise<string> {
    try {
      const thread = await this.openai.beta.threads.create({
        messages: [
          {
            role: "user",
            content: `Initialize with user interests: ${JSON.stringify(
              userInterests
            )}`
          }
        ]
      })
      return thread.id
    } catch (error) {
      Logger.error("Failed to create thread", error)
      throw error
    }
  }

  async addMessage(threadId: string, content: string): Promise<void> {
    try {
      await this.openai.beta.threads.messages.create(threadId, {
        role: "user",
        content
      })
    } catch (error) {
      Logger.error("Failed to add message", error)
      throw error
    }
  }

  async getMessages(threadId: string): Promise<any[]> {
    try {
      const messages = await this.openai.beta.threads.messages.list(threadId)
      return messages.data
    } catch (error) {
      Logger.error("Failed to get messages", error)
      throw error
    }
  }
}

export const threadManager = new ThreadManager()
