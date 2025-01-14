'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/lib/AppContext'
import { useAuth } from '@/lib/AuthContext'

export function ProfileRequiredRoute(WrappedComponent: React.ComponentType) {
  return function ProtectedComponent(props: any) {
    const { isProfileComplete } = useAppContext()
    const { isLoggedIn } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoggedIn) {
        router.push('/login')
      } else if (!isProfileComplete) {
        router.push('/account')
      }
    }, [isLoggedIn, isProfileComplete, router])

    if (!isLoggedIn || !isProfileComplete) {
      return null // or a loading spinner
    }

    return <WrappedComponent {...props} />
  }
}

