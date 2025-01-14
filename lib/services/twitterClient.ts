import { TwitterApi } from "twitter-api-v2"

// Replace these with your API keys
const client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN!)

// Example: Fetch recent tweets by a specific user
const fetchUserTweets = async (username: string) => {
  try {
    const user = await client.v2.userByUsername(username)
    const tweets = await client.v2.userTimeline(user.data.id, {
      max_results: 10
    })
    console.log(tweets)
  } catch (error) {
    console.error("Error fetching tweets:", error)
  }
}

fetchUserTweets("exampleuser")
