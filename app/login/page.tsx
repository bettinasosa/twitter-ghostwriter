"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"
import { AuthForm } from "@/components/auth/AuthForm"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await login(email, password)
      router.push("/account")
    } catch (error) {
      console.error("Login error:", error)
      throw error // Let AuthForm handle the error display
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4">
      <AuthForm mode="login" onSubmit={handleLogin} isLoading={isLoading} />
    </div>
  )
}
