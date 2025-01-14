import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"

export function GoalsSection() {
  const { watch, setValue } = useFormContext()
  const goals = watch("goals")
  const [newGoal, setNewGoal] = useState("")

  const handleAddGoal = () => {
    if (newGoal && !goals.includes(newGoal)) {
      setValue("goals", [...goals, newGoal], { shouldValidate: true })
      setNewGoal("")
    }
  }

  const handleRemoveGoal = (goalToRemove: string) => {
    setValue(
      "goals",
      goals.filter((g: string) => g !== goalToRemove),
      { shouldValidate: true }
    )
  }

  return (
    <div className="space-y-4">
      <Label>Content Goals</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {goals.map((goal: string) => (
          <Badge key={goal} variant="secondary" className="gap-1">
            {goal}
            <button
              type="button"
              onClick={() => handleRemoveGoal(goal)}
              className="ml-1 hover:text-destructive"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {goal}</span>
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Add a content goal..."
          value={newGoal}
          onChange={e => setNewGoal(e.target.value)}
          onKeyPress={e => {
            if (e.key === "Enter") {
              e.preventDefault()
              handleAddGoal()
            }
          }}
        />
        <Button type="button" onClick={handleAddGoal}>
          Add
        </Button>
      </div>
    </div>
  )
}
