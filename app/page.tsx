'use client'

import { Hero } from '@/components/Hero'
import { FeatureCard } from '@/components/FeatureCard'
import { ButtonGroup } from '@/components/ButtonGroup'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import '../styles/animations.css'
import { GeistSans } from 'geist/font/sans'
import { useAuth } from '@/lib/AuthContext'

export default function LandingPage() {
  const { isLoggedIn } = useAuth()
  const features = [
    {
      title: "Configure Your AI Assistant",
      items: [
        "Set up your expertise and topics",
        "Configure your content tone and style",
        "Define your target audience",
        "Customize AI personality",
        "Set content preferences"
      ],
      delay: ""
    },
    {
      title: "Generate Content",
      items: [
        "Choose between tweets and threads",
        "Generate AI-powered content",
        "Edit and refine suggestions",
        "Save drafts for later",
        "Batch create content"
      ],
      delay: "delay-200"
    },
    {
      title: "Plan and Schedule",
      items: [
        "View content calendar",
        "Schedule posts",
        "Track scheduled content",
        "Manage content library",
        "Organize by campaign"
      ],
      delay: "delay-400"
    }
  ]

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-b from-white via-yellow-50 to-orange-100">
      <main className={`${GeistSans.className} relative min-h-screen flex flex-col items-center justify-center px-6 md:px-24 py-24`}>
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <Hero />
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
          {isLoggedIn ? (
            <Button 
              asChild
              className="mt-8 h-12 px-8 text-base bg-white hover:bg-white/90 text-gray-900 shadow-lg transition-all duration-300"
            >
              <Link href="/ghost-writer">
                Go to Ghost Writer
              </Link>
            </Button>
          ) : (
            <ButtonGroup />
          )}
        </div>
      </main>
    </div>
  )
}

