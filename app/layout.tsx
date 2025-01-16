"use client"

import { AuthProvider } from "@/lib/AuthContext"
import { AppProvider } from "@/lib/AppContext"
import { MainNavbar } from "@/components/MainNavbar"
import { GeistSans } from "geist/font/sans"
import "./globals.css"
import { SessionProvider } from "next-auth/react"
import { TweetsProvider } from "@/lib/TweetsContext"

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} antialiased`}>
        <SessionProvider>
          <AuthProvider>
            <AppProvider>
              <TweetsProvider>
                <MainNavbar />
                <main className="min-h-screen">{children}</main>
              </TweetsProvider>
            </AppProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
