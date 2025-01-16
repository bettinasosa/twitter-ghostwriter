"use server"

import OpenAI from "openai"
import { UserInterests } from "@/lib/models/User"
import { Tweet } from "@/lib/models/Tweet"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateNewTweet(
  userInterests: UserInterests | null,
  tweetType: "short-form" | "thread" | "long-form",
  trend_name?: string
): Promise<Omit<Tweet, "id">> {
  if (!userInterests) {
    throw new Error("User interests not found")
  }

  try {
    const systemMessage = `
    You are a professional twitter ghost writter with the following persona:
    - Persona: ${userInterests.aiPersona}
    - Backstory: ${userInterests.aiBackstory}

    Your goal: Generate on-brand tweets that go viral, capture attention, and align with the specified style and tone.

    Important considerations:
    1. Tweet Type: ${tweetType}.
    2. Topics: ${userInterests.topics.join(", ")}.
    3. Tones: ${userInterests.tones.join(", ")}.
    4. Audience: ${userInterests.audience}.
    5. Humor Level: ${userInterests.humorLevel}%.
    6. Emoji Usage: ${userInterests.emojiUsage}.
    7. Hashtag Usage: ${userInterests.hashtagPreference}.
    8. Writing Style: ${userInterests.preferredWritingStyles.join(", ")}.

    Best Practices:
    - Start with a strong hook or question.
    - Keep the tweet(s) concise, scannable, and engaging.
    - If thread, separate each tweet clearly (each tweet on a new line or separated with blank lines).
    - Maintain coherence across the thread.
    - Use hashtags and emojis moderately and relevantly, based on the guidelines.
    - End with a clear Call-To-Action or concluding statement, if appropriate.
    - Avoid repetitive or generic phrasing.
  `

    const userPrompt = `Create a ${tweetType} about ${userInterests.topics.join(', ')} 
    that resonates with current trends as 2025 on twitter which are for instance ${trend_name} and your audience.
    
    Goals to achieve:
    ${userInterests.goals.map(goal => `- ${goal}`).join('\n')}
    
    Tone guidelines:
    ${userInterests.tones.map(tone => `- ${tone}`).join('\n')}
    
    Format requirements:
    ${tweetType === "thread" ? 
      "- Create a cohesive thread (2-5 tweets)\n- Each tweet should work standalone but connect to a larger narrative\n- Use hooks to encourage reading the full thread" :
      tweetType === "long-form" ? 
      "- Utilize the full 280 characters effectively\n- Structure content for maximum impact\n- Include a clear call-to-action" :
      "- Keep it concise and impactful\n- Optimize for virality\n- Make every word count"
    }
    
    Additional context:
    - Posting frequency: ${userInterests.postingFrequency}
    - Twitter handle: ${userInterests.twitterHandle}
    
    Remember to:
    1. Be timely and relevant
    2. Encourage engagement
    3. Use appropriate hashtags strategically
    4. Create shareable content
    5. Maintain the specified tone and style`

    // 3) Make OpenAI API call
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      presence_penalty: 0.3, // Encourage unique content
      frequency_penalty: 0.5, // Reduce repetition
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userPrompt }
      ]
    })

    const content = completion.choices[0].message.content
    if (!content) throw new Error("No content generated")

    return {
      title: `${tweetType} Tweet about ${userInterests.topics[0]}`,
      content: tweetType === "thread" ? content.split("\n\n") : content,
      type: tweetType,
      createdAt: Date.now()
    }
  } catch (error) {
    console.error("Error generating tweet:", error)
    throw new Error("Failed to generate tweet")
  }
}
