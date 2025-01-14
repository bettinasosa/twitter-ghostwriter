import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useFormContext } from "react-hook-form"

export function AudienceSection() {
  const { register } = useFormContext()

  return (
    <div className="space-y-4">
      <Label>Target Audience</Label>
      <Textarea
        placeholder="Describe your target audience..."
        className="min-h-[100px]"
        {...register("audience")}
      />
    </div>
  )
}
