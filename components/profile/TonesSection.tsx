import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SUGGESTED_TONES = [
  "Professional",
  "Casual",
  "Friendly",
  "Humorous",
  "Technical",
  "Educational",
  "Inspirational",
  "Authoritative",
  "Conversational"
]

export function TonesSection() {
  const { watch, setValue } = useFormContext()
  const tones = watch('tones')
  const [customTone, setCustomTone] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)

  const handleAddTone = (tone: string) => {
    if (tone === "custom") {
      setShowCustomInput(true)
      return
    }
    if (tone && !tones.includes(tone)) {
      setValue('tones', [...tones, tone], { shouldValidate: true })
      setCustomTone("")
      setShowCustomInput(false)
    }
  }

  const handleRemoveTone = (toneToRemove: string) => {
    setValue(
      'tones',
      tones.filter((t: string) => t !== toneToRemove),
      { shouldValidate: true }
    )
  }

  return (
    <div className="space-y-4">
      <Label>Writing Tones</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tones.map((tone: string) => (
          <Badge key={tone} variant="secondary" className="gap-1">
            {tone}
            <button
              type="button"
              onClick={() => handleRemoveTone(tone)}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tone}</span>
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        {!showCustomInput ? (
          <Select onValueChange={handleAddTone}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a tone" />
            </SelectTrigger>
            <SelectContent>
              {SUGGESTED_TONES.map(tone => (
                <SelectItem key={tone} value={tone}>
                  {tone}
                </SelectItem>
              ))}
              <SelectItem value="custom">+ Add Custom Tone</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div className="flex gap-2 w-full">
            <Input
              placeholder="Enter custom tone..."
              value={customTone}
              onChange={e => setCustomTone(e.target.value)}
              onKeyPress={e => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddTone(customTone)
                }
              }}
            />
            <Button type="button" onClick={() => handleAddTone(customTone)}>
              Add
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowCustomInput(false)}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}