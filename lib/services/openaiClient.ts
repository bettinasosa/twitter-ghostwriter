import OpenAI from "openai"
import { config } from "@/config"

class OpenAIClient {
  public client: OpenAI

  constructor() {
    if (!config.openAI.apiKey) {
      console.error("OpenAI API key is missing")
      throw new Error("OpenAI API key is required")
    }

    this.client = new OpenAI({
      apiKey: config.openAI.apiKey
    })

    // Test the client initialization
    if (!this.client) {
      throw new Error("Failed to initialize OpenAI client")
    }
  }
}

export const openAIClient = new OpenAIClient()
