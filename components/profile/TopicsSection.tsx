import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Plus, X } from "lucide-react"
import { useState } from "react"

interface TopicsSectionProps {
  topics: string[]
  availableTopics: string[]
  onAddTopic: (topic: string) => void
  onRemoveTopic: (topic: string) => void
}

export function TopicsSection({
  topics = [],
  availableTopics = [],
  onAddTopic,
  onRemoveTopic
}: TopicsSectionProps) {
  const [newTopic, setNewTopic] = useState("")

  const handleAddTopic = (topic: string) => {
    onAddTopic(topic)
    setNewTopic("")
  }

  return (
    <div className="space-y-4">
      <Label>Topics of expertise</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {topics.map(topic => (
          <Badge key={topic} variant="secondary" className="gap-1">
            {topic}
            <button
              type="button"
              onClick={() => onRemoveTopic(topic)}
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
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
            >
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
                  {availableTopics.map(topic => (
                    <CommandItem
                      key={topic}
                      onSelect={() => handleAddTopic(topic)}
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
            onChange={e => setNewTopic(e.target.value)}
            onKeyPress={e => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddTopic(newTopic)
              }
            }}
          />
          <Button type="button" onClick={() => handleAddTopic(newTopic)}>
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
