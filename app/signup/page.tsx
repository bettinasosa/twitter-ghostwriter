'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { AuthForm } from '@/components/auth/AuthForm'

export default function SignupPage() {
  const { signup } = useAuth()
  const router = useRouter()

  const handleSignup = async (email: string, password: string) => {
    await signup(email, password)
    router.push('/account')
  }

  return (
    <div className="container mx-auto px-4">
      <AuthForm mode="signup" onSubmit={handleSignup} />
    </div>
  )
}

