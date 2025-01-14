'use client'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useAuth } from '@/lib/AuthContext'

export function ButtonGroup() {
  const { isLoggedIn } = useAuth()

  return (
    <div className="flex flex-wrap gap-4 pt-12 animate-slide-up delay-400">
      {isLoggedIn ? (
        <Button 
          asChild
          className="h-12 px-8 text-base bg-white hover:bg-white/90 text-gray-900 shadow-lg transition-all duration-300"
        >
          <Link href="/account">
            Go to Profile
          </Link>
        </Button>
      ) : (
        <>
          <Button 
            asChild
            className="h-12 px-8 text-base bg-white hover:bg-white/90 text-gray-900 shadow-lg transition-all duration-300"
          >
            <Link href="/signup">
              Sign Up
            </Link>
          </Button>
          <Button 
            asChild
            className="h-12 px-8 text-base bg-orange-200 hover:bg-white/20 text-black shadow-lg transition-all duration-300"
          >
            <Link href="/login">
              Log In
            </Link>
          </Button>
        </>
      )}
    </div>
  )
}

