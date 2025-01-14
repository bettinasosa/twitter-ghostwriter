'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'

export function ProfileRequiredRoute(WrappedComponent: React.ComponentType) {
  return function ProfileRequiredComponent(props: any) {
    const { isLoggedIn } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoggedIn) {
        router.push('/login')
      }
    }, [isLoggedIn, router])

    if (!isLoggedIn) {
      return null // or a loading spinner
    }

    return <WrappedComponent {...props} />
  }
}

