import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "@/lib/models/User"
import { useFormContext } from "react-hook-form"

interface BasicInfoProps {
  user: User | null
}

export function BasicInfo({ user }: BasicInfoProps) {
  const { register } = useFormContext()

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={user?.email || ""} disabled />
      </div>

      <div className="space-y-2">
        <Label htmlFor="twitterHandle">Twitter Handle</Label>
        <Input
          id="twitterHandle"
          type="text"
          placeholder="@yourtwitterhandle"
          {...register("twitterHandle")}
        />
      </div>
    </div>
  )
}
