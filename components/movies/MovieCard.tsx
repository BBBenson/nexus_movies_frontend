"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Heart, Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Movie } from "@/types/movie"
import { getImageUrl, truncateText } from "@/utils/helpers"
import { GENRES } from "@/utils/constants"

interface MovieCardProps {
  movie: Movie
  onFavoriteClick?: (movie: Movie) => void
  isFavorite?: boolean
  showOverview?: boolean
}

export function MovieCard({ movie, onFavoriteClick, isFavorite = false, showOverview = false }: MovieCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const posterUrl = getImageUrl(movie.poster_path, "poster", "medium")
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "TBA"

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFavoriteClick?.(movie)
  }

  return (
    <Card className="movie-card group relative overflow-hidden bg-card border-border hover:border-accent/50">
      <Link href={`/movie/${movie.id}`}>
        <div className="relative aspect-[2/3] overflow-hidden">
          {/* Movie Poster */}
          <Image
            src={imageError ? "/placeholder.svg?height=450&width=300&text=No+Image" : posterUrl}
            alt={movie.title}
            fill
            className={`object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          {/* Loading placeholder */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
            onClick={handleFavoriteClick}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`} />
          </Button>

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="icon" className="bg-accent/90 hover:bg-accent text-white rounded-full w-12 h-12">
              <Play className="h-6 w-6 ml-1" />
            </Button>
          </div>

          {/* Rating Badge */}
          <Badge variant="secondary" className="absolute top-2 left-2 bg-black/70 text-white border-none">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            {movie.vote_average.toFixed(1)}
          </Badge>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-card-foreground line-clamp-2 group-hover:text-accent transition-colors">
              {movie.title}
            </h3>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{releaseYear}</span>
              <span>{movie.vote_count} votes</span>
            </div>

            {/* Genres */}
            {movie.genre_ids && movie.genre_ids.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {movie.genre_ids.slice(0, 2).map((genreId) => (
                  <Badge key={genreId} variant="outline" className="text-xs border-border text-muted-foreground">
                    {GENRES[genreId as keyof typeof GENRES] || "Unknown"}
                  </Badge>
                ))}
              </div>
            )}

            {/* Overview */}
            {showOverview && movie.overview && (
              <p className="text-sm text-muted-foreground line-clamp-3">{truncateText(movie.overview, 120)}</p>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
