"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"
import { AuthForm } from "@/components/auth/AuthForm"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
    await login(email, password)
    router.push("/account")
  }

  return (
    <div className="container mx-auto px-4">
      <AuthForm mode="login" onSubmit={handleLogin} />
    </div>
  )
}
