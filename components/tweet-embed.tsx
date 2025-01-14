'use client'

import { useEffect } from 'react'
import Script from 'next/script'

// Add this type declaration
declare global {
  interface Window {
    twttr: any;
  }
}

interface TweetEmbedProps {
  url: string
}

export function TweetEmbed({ url }: TweetEmbedProps) {
  const tweetUrl = url.replace('x.com', 'twitter.com')

  useEffect(() => {
    // Load the embedded tweet
    if (window.twttr) {
      window.twttr.widgets.load()
    }
  }, [])

  return (
    <>
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
      />
      <div className="min-h-[200px] flex items-center justify-center">
        <blockquote className="twitter-tweet" data-conversation="none">
          <a href={tweetUrl}>Loading tweet...</a>
        </blockquote>
      </div>
    </>
  )
}

