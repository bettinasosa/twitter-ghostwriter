import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useFormContext } from "react-hook-form"

export function AIPersonaSection() {
  const { register } = useFormContext()

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>AI Persona</Label>
        <Textarea
          placeholder="Describe the personality of your AI assistant..."
          className="min-h-[100px]"
          {...register("aiPersona")}
        />
      </div>

      <div className="space-y-4">
        <Label>AI Backstory</Label>
        <Textarea
          placeholder="Create a backstory for your AI assistant..."
          className="min-h-[150px]"
          {...register("aiBackstory")}
        />
      </div>
    </div>
  )
} 