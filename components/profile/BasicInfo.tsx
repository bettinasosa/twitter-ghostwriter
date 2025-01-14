import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "@/lib/models/User"

interface BasicInfoProps {
  user: User | null
  userInterests: any
  setUserInterests: (value: any) => void
}

export function BasicInfo({
  user,
  userInterests,
  setUserInterests
}: BasicInfoProps) {
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
          value={userInterests?.twitterHandle || ""}
          onChange={e =>
            setUserInterests((prev: any) => ({
              ...prev,
              twitterHandle: e.target.value
            }))
          }
        />
      </div>
    </div>
  )
}
