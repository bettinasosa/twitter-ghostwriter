"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GeistSans } from "geist/font/sans"
import { useAuth } from "@/lib/AuthContext"
import { useRouter } from "next/navigation"
import { ProfileRequiredRoute } from "@/components/ProtectedRoute"
import { useAppContext } from "@/lib/AppContext"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { useState, useEffect } from "react"
import { suggestedTopics } from "@/lib/mock-data"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { BasicInfo } from "@/components/profile/BasicInfo"
import { TopicsSection } from "@/components/profile/TopicsSection"

export default ProfileRequiredRoute(function AccountPage() {
  const { userInterests, setUserInterests, setIsProfileComplete } =
    useAppContext()
  const [availableTopics, setAvailableTopics] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  // Initialize userInterests with default values if null
  useEffect(() => {
    if (!userInterests) {
      setUserInterests({
        topics: [],
        description: "",
        tones: [],
        audience: "",
        goals: [],
        postingFrequency: "",
        aiPersona: "",
        aiBackstory: "",
        writingStyle: "",
        humorLevel: 50,
        emojiUsage: "minimal",
        hashtagPreference: "moderate",
        preferredWritingStyles: []
      })
    }
  }, [userInterests, setUserInterests])

  useEffect(() => {
    setAvailableTopics(suggestedTopics || [])
  }, [])

  const addTopic = (topic: string) => {
    if (topic && userInterests && !userInterests.topics.includes(topic)) {
      setUserInterests(prev => ({
        ...prev!,
        topics: [...prev!.topics, topic]
      }))
    }
  }

  const removeTopic = (topicToRemove: string) => {
    if (userInterests) {
      setUserInterests(prev => ({
        ...prev!,
        topics: prev!.topics.filter(t => t !== topicToRemove)
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    if (!user) {
      router.push("/login")
      return
    }

    try {
      // Your save logic here
      setIsProfileComplete(true)
      setIsSaving(false)
      toast({
        title: "Profile saved successfully!",
        description: "Your changes have been saved.",
        action: <ToastAction altText="OK">OK</ToastAction>
      })
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error saving profile",
        description:
          "An error occurred while saving your profile. Please try again.",
        variant: "destructive"
      })
      setIsSaving(false)
    }
  }

  if (!userInterests) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-yellow-50/40 pt-24">
      <form
        onSubmit={handleSubmit}
        className={`${GeistSans.className} p-6 max-w-[1400px] mx-auto bg-white/80 backdrop-blur-md rounded-lg border border-white/20 shadow-xl`}
      >
        <ProfileHeader />

        <div className="space-y-6">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-medium">
                Profile Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <BasicInfo
                user={user}
                userInterests={userInterests}
                setUserInterests={setUserInterests}
              />

              <TopicsSection
                topics={userInterests.topics}
                availableTopics={availableTopics}
                onAddTopic={addTopic}
                onRemoveTopic={removeTopic}
              />

              {/* Add other sections as components */}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            disabled={isSaving}
            className="h-11 px-8 text-base"
          >
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </div>
  )
})
