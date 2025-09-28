"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Movie } from "@/types/movie"
import { MovieCard } from "./MovieCard"

interface CategorySectionProps {
  title: string
  movies: Movie[]
  onFavoriteClick?: (movie: Movie) => void
  favoriteMovieIds?: number[]
  loading?: boolean
}

export function CategorySection({
  title,
  movies,
  onFavoriteClick,
  favoriteMovieIds = [],
  loading = false,
}: CategorySectionProps) {
  const [scrollPosition, setScrollPosition] = useState(0)

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById(`scroll-${title.replace(/\s+/g, "-").toLowerCase()}`)
    if (container) {
      const scrollAmount = 320 // Width of card + gap
      const newPosition =
        direction === "left" ? Math.max(0, scrollPosition - scrollAmount) : scrollPosition + scrollAmount

      container.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    }
  }

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex space-x-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-none w-48 h-72 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </section>
    )
  }

  if (!movies || movies.length === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            className="border-border hover:border-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="border-border hover:border-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        id={`scroll-${title.replace(/\s+/g, "-").toLowerCase()}`}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="flex-none w-48">
            <MovieCard
              movie={movie}
              onFavoriteClick={onFavoriteClick}
              isFavorite={favoriteMovieIds.includes(movie.id)}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
