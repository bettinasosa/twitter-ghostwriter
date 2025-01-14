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
  SelectValue
} from "@/components/ui/select"

const SUGGESTED_STYLES = [
  "Concise",
  "Detailed",
  "Story-driven",
  "Data-driven",
  "Tutorial-style",
  "Thought leadership",
  "News-style",
  "Opinion-based",
  "Q&A format"
]

export function WritingStyleSection() {
  const { watch, setValue } = useFormContext()
  const styles = watch("preferredWritingStyles")
  const [customStyle, setCustomStyle] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)

  const handleAddStyle = (style: string) => {
    if (style === "custom") {
      setShowCustomInput(true)
      return
    }
    if (style && !styles.includes(style)) {
      setValue("preferredWritingStyles", [...styles, style], {
        shouldValidate: true
      })
      setCustomStyle("")
      setShowCustomInput(false)
    }
  }

  const handleRemoveStyle = (styleToRemove: string) => {
    setValue(
      "preferredWritingStyles",
      styles.filter((s: string) => s !== styleToRemove),
      { shouldValidate: true }
    )
  }

  return (
    <div className="space-y-4">
      <Label>Writing Styles</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {styles.map((style: string) => (
          <Badge key={style} variant="secondary" className="gap-1">
            {style}
            <button
              type="button"
              onClick={() => handleRemoveStyle(style)}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {style}</span>
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        {!showCustomInput ? (
          <Select onValueChange={handleAddStyle}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a writing style" />
            </SelectTrigger>
            <SelectContent>
              {SUGGESTED_STYLES.map(style => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
              <SelectItem value="custom">+ Add Custom Style</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div className="flex gap-2 w-full">
            <Input
              placeholder="Enter custom writing style..."
              value={customStyle}
              onChange={e => setCustomStyle(e.target.value)}
              onKeyPress={e => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddStyle(customStyle)
                }
              }}
            />
            <Button type="button" onClick={() => handleAddStyle(customStyle)}>
              Add
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCustomInput(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
