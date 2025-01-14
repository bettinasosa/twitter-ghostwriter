"use server"

import { UserInterests, Tweet } from "@/lib/models/User"

export async function generateNewTweet(
  userInterests: UserInterests,
  tweetType: "short-form" | "thread" | "long-form",
  customTopic?: string,
  customInstructions?: string
): Promise<Tweet> {
  console.log("Server action: Starting generateNewTweet")
  console.log(
    "Server action: User interests:",
    JSON.stringify(userInterests, null, 2)
  )

  try {
    const apiUrl = "https://zf6ymc1e8vxul74g.vercel.app/api/generate-tweet"
    console.log("Server action: Preparing to fetch from API URL:", apiUrl)
    const currentDate = new Date().toISOString().split("T")[0]
    const tweetTypeInstructions = {
      "short-form":
        "Generate a concise, impactful tweet within the 280 character limit.",
      thread:
        "Create a thread of 3-5 connected tweets that dive deeper into a topic.",
      "long-form":
        "Produce a longer, article-style tweet of 500-1000 characters, suitable for platforms that allow extended content."
    }

    const prompt = `
      You are an AI assistant tasked with generating tweets for a user with the following profile:

      Twitter Handle: ${userInterests.twitterHandle || "Not provided"}
      Topics of expertise: ${userInterests.topics.join(", ")}
      User description: ${userInterests.description}
      Preferred tones: ${userInterests.tones.join(", ")}
      Preferred writing styles: ${userInterests.preferredWritingStyle.join(
        ", "
      )}
      Target audience: ${userInterests.audience}
      Account goals: ${userInterests.goals.join(", ")}
      Posting frequency: ${userInterests.postingFrequency}
      AI Persona: ${userInterests.aiPersona}
      AI Backstory: ${userInterests.aiBackstory}
      Humor level (0-100): ${userInterests.humorLevel}
      Emoji usage: ${userInterests.emojiUsage}
      Hashtag preference: ${userInterests.hashtagPreference}

      Today's date: ${currentDate}

      Tweet Type: ${tweetType}
      ${tweetTypeInstructions[tweetType]}

      Please generate a tweet that:
      1. Aligns with the user's expertise, interests, and goals
      2. Matches the specified writing styles, tones, and humor level
      3. Is appropriate for the target audience
      4. Uses emojis and hashtags according to the user's preferences
      5. Considers current trending topics and recent developments in the user's field of expertise
      6. Provides valuable insights, sparks discussion, or shares knowledge
      7. Is engaging and likely to be shared or commented on
      8. Follows the specified tweet type format
      ${
        customTopic
          ? `9. Focuses on the following custom topic: ${customTopic}`
          : ""
      }
      ${
        customInstructions
          ? `10. Follows these additional instructions: ${customInstructions}`
          : ""
      }

      Please format the response as a JSON object with the following structure:
      {
        "title": "A brief, catchy title for the tweet",
        "content": "The full text of the tweet",
        "type": "${tweetType}"
      }

      For threads, provide an array of tweets as the content.
    `

    console.log("the prompt", prompt)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Server action: Error response from API:", errorData)
      console.error("Server action: Response status:", response.status)
      console.error("Server action: Response statusText:", response.statusText)
      throw new Error(
        `Failed to generate tweet: ${response.statusText}. Details: ${errorData}`
      )
    }

    const generatedTweet = await response.json()
    console.log(
      "Server action: Generated tweet:",
      JSON.stringify(generatedTweet, null, 2)
    )

    return generatedTweet
  } catch (error) {
    console.error("Server action: Error in generateNewTweet:", error)
    console.error("Server action: Error stack:", error?.stack!)
    throw error
  }
}
