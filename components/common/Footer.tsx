"use client"

import Link from "next/link"
import { Heart, Github, Twitter, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
                <span className="text-lg font-bold text-white">N</span>
              </div>
              <span className="text-xl font-bold text-foreground">Nexus Movie</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Discover your next favorite film with personalized recommendations and trending movies.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-muted-foreground hover:text-foreground transition-colors">
                  Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted-foreground">Trending</span>
              </li>
              <li>
                <span className="text-muted-foreground">Popular</span>
              </li>
              <li>
                <span className="text-muted-foreground">Top Rated</span>
              </li>
              <li>
                <span className="text-muted-foreground">Now Playing</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Nexus Movie. Made with <Heart className="h-4 w-4 inline text-red-500 fill-red-500" /> for movie
            lovers.
          </p>
          <p className="text-sm text-muted-foreground">
            Powered by{" "}
            <a href="https://www.themoviedb.org/" className="text-accent hover:underline">
              TMDb
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
