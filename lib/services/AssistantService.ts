"use server"

import OpenAI from "openai"
import Logger from "@/utils/logger"
import { UserInterests } from "@/lib/models/User"

class AssistantService {
  // @ts-ignore
  private openai: OpenAI
  private assistantId: string | null = null


  constructor() {
    if (typeof window === 'undefined') { // Only initialize on server
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      })
    }
  }

  async getOrCreateAssistant(
    userId: string,
    userInterests: UserInterests,
    fileIds: string[]
  ): Promise<string> {
    'use server'
    try {
      const assistantName = `Twitter Ghost Writer - ${userId}`
      const instructions = this.generateInstructions(userInterests)

      const assistants = await this.openai.beta.assistants.list()
      const existingAssistant = assistants.data.find(
        a => a.name === assistantName
      )

      if (existingAssistant) {
        return existingAssistant.id
      }

      const assistant = await this.openai.beta.assistants.create({
        name: assistantName,
        instructions,
        model: "gpt-4-turbo-preview",
        // @ts-ignore
        file_ids: fileIds,
        tools: [
          { type: "file_search" },
          {
            type: "function",
            function: {
              name: "generate_tweet",
              description: "Generate a new tweet based on user preferences and context",
              parameters: {
                type: "object",
                properties: {
                  content: { type: "string" },
                  type: { type: "string", enum: ["short-form", "thread", "long-form"] },
                  thinking: { type: "string" },
                  topics: { type: "array", items: { type: "string" } },
                  suggested_hashtags: { type: "array", items: { type: "string" } }
                },
                required: ["content", "type", "thinking"]
              }
            }
          }
        ]
      })

      return assistant.id
    } catch (error) {
      Logger.error("Failed to create/get assistant", error)
      throw error
    }
  }

  async deleteAssistant(): Promise<void> {
    if (this.assistantId) {
      await this.openai.beta.assistants.del(this.assistantId)
      this.assistantId = null
    }
  }

  private generateInstructions(userInterests: UserInterests): string {
    return `You are a world-class Twitter/X ghost writer with expertise in social media strategy and content creation. Your role is to help users create engaging, authentic, and strategic content while maintaining their unique voice. Follow these guidelines:

    1. Content Strategy
      • Analyze trending topics relevant to the user's interests
      • Maintain consistency with the user's brand voice
      • Balance promotional and engaging content
      • Consider optimal posting times and frequency
      • Track performance patterns from previous tweets

    2. Writing Guidelines
      • Match the user's specified tone and style
      • Use appropriate emoji density (${userInterests.emojiUsage})
      • Apply hashtag strategy (${userInterests.hashtagPreference})
      • Ensure content is engaging and shareable
      • Maintain authenticity in voice and message

    3. Audience Engagement
      • Target content for ${userInterests.audience}
      • Focus on achieving ${userInterests.goals.join(", ")}
      • Encourage meaningful interactions
      • Create conversation-starting content
      • Consider cultural and contextual relevance

    4. Content Types
      • Short-form: Concise, impactful tweets
      • Threads: Coherent, engaging storylines
      • Long-form: Maximum impact within character limit
      • Mix content types based on topic and goal

    5. Context Utilization
      • Learn from successful past tweets
      • Avoid repeating discarded content patterns
      • Build upon engagement patterns
      • Reference user's uploaded materials appropriately
      • Stay aligned with overall content strategy

    6. Quality Control
      • Verify content meets platform guidelines
      • Check for potential sensitivities
      • Ensure clarity and readability
      • Maintain professional standards
      • Review for typos and formatting`
  }
}

export const assistantService = new AssistantService()

// Format all responses as JSON:
//     {
//         "thinking": "Detailed explanation of strategy and reasoning",
//         "content": "The actual tweet content",
//         "type": "short-form|thread|long-form",
//         "metrics": {
//             "estimated_engagement": "high|medium|low",
//             "target_audience": ["specific segments"],
//             "best_posting_time": "suggested time"
//         },
//         "context": {
//             "trending_topics_used": ["topics"],
//             "reference_materials": ["relevant files used"],
//             "similar_past_tweets": ["references"]
//         },
//         "suggestions": {
//             "hashtags": ["recommended hashtags"],
//             "follow_up_content": ["ideas for related tweets"],
//             "engagement_tips": ["ways to boost interaction"]
//         },
//         "debug": {
//             "context_used": boolean,
//             "content_type_reasoning": "explanation",
//             "audience_targeting": "strategy used"
//         }
//     }
