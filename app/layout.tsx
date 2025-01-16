"use client"

import { useAuth } from "@/lib/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { useAppContext } from "@/lib/AppContext"

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { user, isLoggedIn } = useAuth()
  const { userInterests, isLoading } = useAppContext()
  const router = useRouter()
  const pathname = usePathname()
  
  useEffect(() => {
    if (isLoading) return

    const publicPaths = ["/", "/login", "/signup"]
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

    if (!isLoggedIn && !isPublicPath) {
      router.push("/login")
      return
    }

    if (isLoggedIn && user?.email) {
      const hasProfile = !!userInterests
      
      if (!hasProfile && pathname !== "/account") {
        router.push("/account")
        return
      }

      if (hasProfile && pathname === "/") {
        router.push("/ghost-writer")
      }
    }
  }, [isLoggedIn, pathname, router, user, userInterests, isLoading])

  return <>{children}</>
}
