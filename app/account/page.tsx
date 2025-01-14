"use client"

import { useState, useEffect } from "react"
import { Plus, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { suggestedTopics } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { useAppContext } from '@/lib/AppContext'
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { GeistSans } from 'geist/font/sans'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import { ProfileRequiredRoute } from '@/components/ProtectedRoute'

const predefinedTones = [
  "Professional",
  "Approachable",
  "Casual",
  "Friendly",
  "Technical",
  "Detailed",
  "Educational",
  "Informative",
  "Thought leadership",
  "Funny",
  "Sarcastic",
  "Enthusiastic"
]

const predefinedWritingStyles = [
  "Concise",
  "Descriptive",
  "Analytical",
  "Persuasive",
  "Narrative",
  "Expository",
  "Conversational",
  "Formal",
  "Technical",
  "Creative"
]

export default ProfileRequiredRoute(function AccountPage() {
  const { userInterests, setUserInterests, setIsProfileComplete } = useAppContext()
  const [newTopic, setNewTopic] = useState("")
  const [newTone, setNewTone] = useState("")
  const [newWritingStyle, setNewWritingStyle] = useState("")
  const [availableTopics, setAvailableTopics] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [newPreferredWritingStyle, setNewPreferredWritingStyle] = useState("")
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setAvailableTopics(suggestedTopics || []);
  }, []);

  useEffect(() => {
    // Load user profile from localStorage (replace with API call in production)
    const storedProfile = localStorage.getItem('userProfile')
    if (storedProfile) {
      setUserInterests(JSON.parse(storedProfile))
    }
  }, [])

  const addTopic = (topic: string) => {
    if (topic && !userInterests.topics.includes(topic)) {
      setUserInterests(prev => ({
        ...prev,
        topics: [...prev.topics, topic]
      }))
    }
    setNewTopic("")
  }

  const removeTopic = (topicToRemove: string) => {
    setUserInterests(prev => ({
      ...prev,
      topics: prev.topics.filter(t => t !== topicToRemove)
    }))
  }

  const addTone = (tone: string) => {
    if (tone && !userInterests.tones.includes(tone)) {
      setUserInterests(prev => ({
        ...prev,
        tones: [...prev.tones, tone]
      }))
    }
    setNewTone("")
  }

  const removeTone = (toneToRemove: string) => {
    setUserInterests(prev => ({
      ...prev,
      tones: prev.tones.filter(t => t !== toneToRemove)
    }))
  }

  const addWritingStyle = (style: string) => {
    if (style && !userInterests.preferredWritingStyles.includes(style)) {
      setUserInterests(prev => ({
        ...prev,
        preferredWritingStyles: [...userInterests.preferredWritingStyles, style]
      }))
    }
    setNewWritingStyle("")
  }

  const removeWritingStyle = (styleToRemove: string) => {
    setUserInterests(prev => ({
      ...prev,
      preferredWritingStyles: prev.preferredWritingStyles.filter(s => s !== styleToRemove)
    }))
  }

  const addGoal = (goal: string) => {
    if (goal && !userInterests.goals.includes(goal)) {
      setUserInterests(prev => ({
        ...prev,
        goals: [...prev.goals, goal]
      }))
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    if (!user) {
      router.push('/login')
      return
    }

    try {
      // Simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // TODO: Implement actual API call to save user interests
      const userProfile = {
        ...userInterests,
        email: user.email
      }
      console.log('Saving user profile:', userProfile)
      
      // Save to localStorage for now (replace with API call in production)
      localStorage.setItem('userProfile', JSON.stringify(userProfile))
      
      setIsProfileComplete(true)
      setIsSaving(false)
      toast({
        title: "Profile saved successfully!",
        description: "Your changes have been saved.",
        action: <ToastAction altText="OK">OK</ToastAction>,
      })
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: "Error saving profile",
        description: "An error occurred while saving your profile. Please try again.",
        variant: "destructive",
      })
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-yellow-50/40 pt-24">
      <form onSubmit={handleSubmit} className={`${GeistSans.className} p-6 max-w-[1400px] mx-auto bg-white/80 backdrop-blur-md rounded-lg border border-white/20 shadow-xl`}>
        <header className="mb-8">
          <h1 className="text-4xl font-medium tracking-tight text-gray-900 mb-1">Profile Settings</h1>
          <p className="text-gray-600">Customize your AI writing assistant's voice and style</p>
        </header>

        <div className="space-y-6">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-medium">Profile Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitterHandle">Twitter Handle</Label>
                <Input
                  id="twitterHandle"
                  type="text"
                  placeholder="@yourtwitterhandle"
                  value={userInterests.twitterHandle || ''}
                  onChange={(e) => setUserInterests(prev => ({ ...prev, twitterHandle: e.target.value }))}
                />
              </div>

              <div className="space-y-4">
                <Label>Topics of expertise</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {userInterests.topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="gap-1">
                      {topic}
                      <button
                        type="button"
                        onClick={() => removeTopic(topic)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {topic}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="outline" className="w-full justify-start">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Topic
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 z-50" side="right" align="start">
                      <Command>
                        <CommandInput placeholder="Search topics..." />
                        <CommandList>
                          <CommandEmpty>No topic found. Press enter to add.</CommandEmpty>
                          <CommandGroup>
                            {availableTopics.map((topic) => (
                              <CommandItem
                                key={topic}
                                onSelect={() => addTopic(topic)}
                              >
                                {topic}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Or add custom topic..."
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTopic(newTopic)
                        }
                      }}
                    />
                    <Button type="button" onClick={() => addTopic(newTopic)}>Add</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Describe your expertise and what you want to share
                </Label>
                <Textarea
                  id="description"
                  placeholder="What unique insights can you offer? What experiences do you want to share?"
                  value={userInterests.description}
                  onChange={(e) => setUserInterests(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>

              <div className="space-y-4">
                <Label>Preferred tones of voice</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {userInterests.tones.map((tone) => (
                    <Badge key={tone} variant="secondary" className="gap-1">
                      {tone}
                      <button
                        type="button"
                        onClick={() => removeTone(tone)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {tone}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="outline" className="w-full justify-start">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Tone
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 z-50" side="right" align="start">
                      <Command>
                        <CommandInput placeholder="Search tones..." />
                        <CommandList>
                          <CommandEmpty>No tone found. Press enter to add.</CommandEmpty>
                          <CommandGroup>
                            {predefinedTones.map((tone) => (
                              <CommandItem
                                key={tone}
                                onSelect={() => addTone(tone)}
                              >
                                {tone}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Or add custom tone..."
                      value={newTone}
                      onChange={(e) => setNewTone(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTone(newTone)
                        }
                      }}
                    />
                    <Button type="button" onClick={() => addTone(newTone)}>Add</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Preferred writing styles</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {userInterests.preferredWritingStyles.map((style) => (
                    <Badge key={style} variant="secondary" className="gap-1">
                      {style}
                      <button
                        type="button"
                        onClick={() => removeWritingStyle(style)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {style}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="outline" className="w-full justify-start">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Writing Style
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 z-50" side="right" align="start">
                      <Command>
                        <CommandInput placeholder="Search writing styles..." />
                        <CommandList>
                          <CommandEmpty>No style found. Press enter to add.</CommandEmpty>
                          <CommandGroup>
                            {predefinedWritingStyles.map((style) => (
                              <CommandItem
                                key={style}
                                onSelect={() => addWritingStyle(style)}
                              >
                                {style}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Or add custom writing style..."
                      value={newPreferredWritingStyle}
                      onChange={(e) => setNewPreferredWritingStyle(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addWritingStyle(newPreferredWritingStyle)
                        }
                      }}
                    />
                    <Button type="button" onClick={() => addWritingStyle(newPreferredWritingStyle)}>Add</Button>
                  </div>
                </div>
              </div>


              <div className="space-y-2">
                <Label htmlFor="audience">Target audience</Label>
                <Textarea
                  id="audience"
                  placeholder="Who are you trying to reach? What's their background and interest level?"
                  value={userInterests.audience}
                  onChange={(e) => setUserInterests(prev => ({ ...prev, audience: e.target.value }))}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">Account goals</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {userInterests.goals.map((goal) => (
                    <Badge key={goal} variant="secondary" className="gap-1">
                      {goal}
                      <button
                        type="button"
                        onClick={() => setUserInterests(prev => ({
                          ...prev,
                          goals: prev.goals.filter(g => g !== goal)
                        }))}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {goal}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Add a goal (e.g., 'Build authority in AI/ML')"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addGoal((e.target as HTMLInputElement).value)
                      ;(e.target as HTMLInputElement).value = ''
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Desired posting frequency</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {userInterests.postingFrequency || "Select posting frequency"}
                      <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search posting frequency..." />
                      <CommandEmpty>No frequency found. Press enter to add.</CommandEmpty>
                      <CommandGroup>
                        {["Multiple times daily", "Daily", "Few times a week", "Weekly", "Occasionally"].map((item) => (
                          <CommandItem
                            key={item}
                            onSelect={() => {
                              setUserInterests(prev => ({ ...prev, postingFrequency: item }))
                            }}
                          >
                            {item}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aiPersona">AI Persona</Label>
                <Textarea
                  id="aiPersona"
                  placeholder="Describe the personality you want your AI assistant to have (e.g., 'A witty tech enthusiast with a passion for explaining complex concepts simply')"
                  value={userInterests.aiPersona}
                  onChange={(e) => setUserInterests(prev => ({ ...prev, aiPersona: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aiBackstory">AI Backstory</Label>
                <Textarea
                  id="aiBackstory"
                  placeholder="Provide a brief backstory for your AI assistant (e.g., 'A former software engineer turned AI researcher, with 10 years of industry experience')"
                  value={userInterests.aiBackstory}
                  onChange={(e) => setUserInterests(prev => ({ ...prev, aiBackstory: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="writingStyle">Preferred Writing Style</Label>
                <Input
                  id="writingStyle"
                  placeholder="Describe your preferred writing style (e.g., 'Concise and data-driven' or 'Storytelling with analogies')"
                  value={userInterests.writingStyle}
                  onChange={(e) => setUserInterests(prev => ({ ...prev, writingStyle: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="humorLevel">Humor Level</Label>
                <Slider
                  id="humorLevel"
                  min={0}
                  max={100}
                  step={1}
                  value={[userInterests.humorLevel]}
                  onValueChange={(value) => setUserInterests(prev => ({ ...prev, humorLevel: value[0] }))}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Serious</span>
                  <span>Balanced</span>
                  <span>Humorous</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emojiUsage">Emoji Usage</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {userInterests.emojiUsage || "Select emoji usage"}
                      <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search emoji usage..." />
                      <CommandEmpty>No option found. Press enter to add.</CommandEmpty>
                      <CommandGroup>
                        {["none", "minimal", "moderate", "liberal"].map((item) => (
                          <CommandItem
                            key={item}
                            onSelect={() => {
                              setUserInterests(prev => ({ ...prev, emojiUsage: item }))
                            }}
                          >
                            {item}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hashtagPreference">Hashtag Preference</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {userInterests.hashtagPreference || "Select hashtag preference"}
                      <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search hashtag preference..." />
                      <CommandEmpty>No option found. Press enter to add.</CommandEmpty>
                      <CommandGroup>
                        {["none", "few", "moderate", "many"].map((item) => (
                          <CommandItem
                            key={item}
                            onSelect={() => {
                              setUserInterests(prev => ({ ...prev, hashtagPreference: item }))
                            }}
                          >
                            {item}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button 
            type="submit" 
            disabled={isSaving}
            className="h-11 px-8 text-base"
          >
            {isSaving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </div>
  )
})

