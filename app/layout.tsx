import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { MovieProvider } from "@/contexts/MovieContext"
import { FavoritesProvider } from "@/contexts/FavoritesContext"
import { AuthProvider } from "@/contexts/AuthContext"
import "./globals.css"

export const metadata: Metadata = {
  title: "Nexus Movie - Discover Your Next Favorite Film",
  description: "Discover trending movies, get personalized recommendations, and save your favorites with Nexus Movie.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <MovieProvider>
            <FavoritesProvider>
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </FavoritesProvider>
          </MovieProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
