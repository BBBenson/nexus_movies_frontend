"use client"

import type { Movie } from "@/types/movie"
import { MovieCard } from "./MovieCard"

interface MovieGridProps {
  movies: Movie[]
  onFavoriteClick?: (movie: Movie) => void
  favoriteMovieIds?: number[]
  showOverview?: boolean
  className?: string
}

export function MovieGrid({
  movies,
  onFavoriteClick,
  favoriteMovieIds = [],
  showOverview = false,
  className = "",
}: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">🎬</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No movies found</h3>
        <p className="text-muted-foreground">Try adjusting your search or browse different categories.</p>
      </div>
    )
  }

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 ${className}`}
    >
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onFavoriteClick={onFavoriteClick}
          isFavorite={favoriteMovieIds.includes(movie.id)}
          showOverview={showOverview}
        />
      ))}
    </div>
  )
}
