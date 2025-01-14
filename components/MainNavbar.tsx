import Link from 'next/link'
import { GeistSans } from 'geist/font/sans'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { useAuth } from '@/lib/AuthContext'

export function MainNavbar() {
  const pathname = usePathname()
  const { isLoggedIn, logout } = useAuth()

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(80%-2rem)] max-w-[1000px] z-50">
      <div className="backdrop-blur-md bg-white/80 px-6 py-3 rounded-full border border-white/20 transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)]">
        <div className={`${GeistSans.className} flex justify-between items-center w-full`}>
          <Link href="/" className="text-gray-900 text-lg font-medium hover:text-orange-500 transition-colors">
            Partisia
          </Link>
          <div className="flex items-center gap-6">
            {isLoggedIn ? (
              <>
                <Link 
                  href="/ghost-writer" 
                  className={cn(
                    "text-sm text-gray-600 hover:text-gray-900 transition-colors",
                    pathname === '/ghost-writer' && "text-orange-500 font-medium"
                  )}
                >
                  Writer
                </Link>
                <Link 
                  href="/content-calendar" 
                  className={cn(
                    "text-sm text-gray-600 hover:text-gray-900 transition-colors",
                    pathname === '/content-calendar' && "text-orange-500 font-medium"
                  )}
                >
                  Calendar
                </Link>
                <Link 
                  href="/interesting_tweets" 
                  className={cn(
                    "text-sm text-gray-600 hover:text-gray-900 transition-colors",
                    pathname === '/interesting_tweets' && "text-orange-500 font-medium"
                  )}
                >
                  Interesting Tweets
                </Link>
                <Link 
                  href="/account" 
                  className={cn(
                    "text-sm text-gray-600 hover:text-gray-900 transition-colors",
                    pathname === '/account' && "text-orange-500 font-medium"
                  )}
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className={cn(
                    "text-sm text-gray-600 hover:text-gray-900 transition-colors",
                    pathname === '/login' && "text-orange-500 font-medium"
                  )}
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className={cn(
                    "text-sm text-gray-600 hover:text-gray-900 transition-colors",
                    pathname === '/signup' && "text-orange-500 font-medium"
                  )}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

