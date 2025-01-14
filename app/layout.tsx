'use client'

import { AuthProvider } from '@/lib/AuthContext'
import { AppProvider } from '@/lib/AppContext'
import { MainNavbar } from '@/components/MainNavbar'
import { GeistSans } from 'geist/font/sans'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} antialiased`}>
        <AuthProvider>
          <AppProvider>
            <MainNavbar />
            <main className="min-h-screen">
              {children}
            </main>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

