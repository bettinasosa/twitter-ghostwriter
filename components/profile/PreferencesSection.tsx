import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFormContext } from "react-hook-form"

export function PreferencesSection() {
  const { setValue, watch } = useFormContext()
  const humorLevel = watch("humorLevel")

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Humor Level</Label>
        <div className="flex items-center space-x-4">
          <Slider
            value={[humorLevel]}
            onValueChange={([value]) => setValue("humorLevel", value)}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="w-12 text-right">{humorLevel}%</span>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Posting Frequency</Label>
        <Select
          onValueChange={(value) => setValue("postingFrequency", value)}
          defaultValue={watch("postingFrequency")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select posting frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="multiple-times">Multiple times</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="biweekly">Bi-weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label>Hashtag Usage</Label>
        <Select
          onValueChange={(value) => setValue("hashtagPreference", value)}
          defaultValue={watch("hashtagPreference")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select hashtag preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="minimal">Minimal</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="liberal">Liberal</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 