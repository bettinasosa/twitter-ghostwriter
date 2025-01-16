"use server"

import OpenAI from 'openai'
import { UserInterests } from '@/lib/models/User'
import { Tweet } from '@/lib/models/Tweet'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateNewTweet(
  userInterests: UserInterests | null,
  tweetType: "short-form" | "thread" | "long-form"
): Promise<Omit<Tweet, "id">> {
  if (!userInterests) {
    throw new Error("User interests not found")
  }

  try {
    const prompt = `Generate a ${tweetType} tweet about ${userInterests.topics.join(', ')} 
    with a ${userInterests.tones.join(', ')} tone. 
    The content should be suitable for ${userInterests.audience}.
    Use humor level: ${userInterests.humorLevel}%.
    Emoji usage: ${userInterests.emojiUsage}.
    Hashtag usage: ${userInterests.hashtagPreference}.
    Writing style: ${userInterests.preferredWritingStyles.join(', ')}.`

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a professional tweet writer with the persona: ${userInterests.aiPersona}. ${userInterests.aiBackstory}`
        },
        { role: "user", content: prompt }
      ],
      model: "gpt-4-turbo-preview",
    })

    const content = completion.choices[0].message.content
    if (!content) throw new Error("No content generated")

    return {
      title: `${tweetType} Tweet about ${userInterests.topics[0]}`,
      content: tweetType === "thread" ? content.split('\n\n') : content,
      type: tweetType,
      createdAt: Date.now()
    }
  } catch (error) {
    console.error("Error generating tweet:", error)
    throw new Error("Failed to generate tweet")
  }
}
