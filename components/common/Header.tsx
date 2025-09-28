"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Heart, Home, Menu, X, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/movies/SearchBar"
import { useAuth } from "@/contexts/AuthContext"
import { AuthDialog } from "@/components/auth/AuthDialog"
import { UserMenu } from "@/components/auth/UserMenu"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { isAuthenticated, loading } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
              <span className="text-lg font-bold text-white">N</span>
            </div>
            <span className="text-xl font-bold text-foreground">Nexus Movie</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/favorites"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Heart className="h-4 w-4" />
              <span>Favorites</span>
            </Link>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            <div className="hidden md:block">
              <SearchBar />
            </div>

            {!loading && (
              <>
                {isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <div className="hidden md:flex items-center space-x-2">
                    <AuthDialog>
                      <Button variant="ghost" size="sm">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign in
                      </Button>
                    </AuthDialog>
                  </div>
                )}
              </>
            )}

            {/* Mobile Search Toggle */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-4 w-4" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <SearchBar />
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                href="/favorites"
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-4 w-4" />
                <span>Favorites</span>
              </Link>
              {!loading && !isAuthenticated && (
                <AuthDialog>
                  <Button
                    variant="ghost"
                    className="justify-start p-0 h-auto font-normal"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Sign in</span>
                  </Button>
                </AuthDialog>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
