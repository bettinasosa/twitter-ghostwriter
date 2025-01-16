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
import { useEffect, useState, useRef } from "react"
import { suggestedTopics } from "@/lib/mock-data"
import { PageHeader } from "@/components/PageHeader"
import { BasicInfo } from "@/components/profile/BasicInfo"
import { TopicsSection } from "@/components/profile/TopicsSection"
import { TonesSection } from "@/components/profile/TonesSection"
import { WritingStyleSection } from "@/components/profile/WritingStyleSection"
import { GoalsSection } from "@/components/profile/GoalsSection"
import { AIPersonaSection } from "@/components/profile/AIPersonaSection"
import { UserInterests, UserInterestsSchema } from "@/lib/models/User"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoadingSpinner } from "@/components/ui/loading"
import { Upload, File as FileIcon, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { assistantService } from "@/lib/services/AssistantService"
import { FileUploader } from "@/components/profile/FileUploader"

const DEFAULT_USER_INTERESTS: UserInterests = {
  topics: [],
  tones: [],
  audience: "",
  goals: [],
  postingFrequency: "",
  aiPersona: "",
  aiBackstory: "",
  humorLevel: 50,
  emojiUsage: "minimal",
  hashtagPreference: "moderate",
  preferredWritingStyles: [],
  twitterHandle: ""
}

export default ProfileRequiredRoute(function AccountPage() {
  const {
    userInterests,
    setUserInterests,
    setIsProfileComplete,
    saveUserToDb
  } = useAppContext()
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  const methods = useForm<UserInterests>({
    resolver: zodResolver(UserInterestsSchema),
    defaultValues: DEFAULT_USER_INTERESTS
  })

  const { handleSubmit, reset } = methods

  // Initialize form with existing data
  useEffect(() => {
    if (userInterests) {
      reset(userInterests)
    }
  }, [userInterests, reset])

  const [isSaving, setIsSaving] = useState(false)

  const onSubmit = async (data: UserInterests) => {
    if (!user) {
      router.push("/login")
      return
    }

    setIsSaving(true)
    try {
      await saveUserToDb({
        email: user.email,
        userInterests: data
      })

      setUserInterests(data)
      setIsProfileComplete(true)

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
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-yellow-50/40 pt-24">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`${GeistSans.className} p-6 max-w-[1400px] mx-auto bg-white/80 backdrop-blur-md rounded-lg border border-white/20 shadow-xl`}
        >
          <PageHeader
            title="Profile Settings"
            description="Customize your AI writing assistant's voice and style"
          />
          <div className="space-y-6">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-medium">
                  Profile Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <BasicInfo user={user} />
                <TopicsSection availableTopics={suggestedTopics} />
                <TonesSection />
                <WritingStyleSection />
                <GoalsSection />
                <AIPersonaSection />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Context Files</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload files to provide additional context for your AI
                    assistant. Supported formats: TXT, PDF, DOC, DOCX, MD
                  </p>
                  <FileUploader userInterests={methods.getValues()} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              className="h-11 px-8 text-base"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
})
