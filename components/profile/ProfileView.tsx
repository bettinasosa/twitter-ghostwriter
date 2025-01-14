import { useAppContext } from "@/lib/AppContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/PageHeader"
import { Pencil } from "lucide-react"

interface ProfileViewProps {
  onEdit: () => void
}

export function ProfileView({ onEdit }: ProfileViewProps) {
  const { userInterests } = useAppContext()

  if (!userInterests) return null

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <PageHeader
          title="Profile"
          description="Your AI assistant configuration"
        />
        <Button onClick={onEdit} variant="outline" className="gap-2">
          <Pencil className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Topics & Style</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {userInterests.topics.map(topic => (
                  <span
                    key={topic}
                    className="px-2 py-1 bg-primary/10 rounded-md text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Writing Style</h3>
              <div className="flex flex-wrap gap-2">
                {userInterests.preferredWritingStyles.map(style => (
                  <span
                    key={style}
                    className="px-2 py-1 bg-primary/10 rounded-md text-sm"
                  >
                    {style}
                  </span>
                ))}
              </div>
            </div>

            {/* Add more sections to display other profile information */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Assistant Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">AI Persona</h3>
              <p className="text-gray-600">{userInterests.aiPersona}</p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Preferences</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Humor Level</dt>
                  <dd>{userInterests.humorLevel}%</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Emoji Usage</dt>
                  <dd className="capitalize">{userInterests.emojiUsage}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Hashtag Preference</dt>
                  <dd className="capitalize">
                    {userInterests.hashtagPreference}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Posting Frequency</dt>
                  <dd className="capitalize">
                    {userInterests.postingFrequency}
                  </dd>
                </div>
              </dl>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
