"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Calendar, Clock, Play, Heart, ArrowLeft, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { MovieDetails as MovieDetailsType } from "@/types/movie"
import { getImageUrl, formatDate, formatRuntime } from "@/utils/helpers"
import { useFavorites } from "@/contexts/FavoritesContext"
import { CategorySection } from "./CategorySection"
import { movieService } from "@/services/movieService"
import type { Movie } from "@/types/movie"

interface MovieDetailsProps {
  movie: MovieDetailsType
}

export function MovieDetails({ movie }: MovieDetailsProps) {
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([])
  const [loadingSimilar, setLoadingSimilar] = useState(false)
  const [loadingRecommended, setLoadingRecommended] = useState(false)

  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const favorite = isFavorite(movie.id)

  const posterUrl = getImageUrl(movie.poster_path, "poster", "large")
  const backdropUrl = getImageUrl(movie.backdrop_path, "backdrop", "large")

  const handleFavoriteClick = () => {
    if (favorite) {
      removeFavorite(movie.id)
    } else {
      addFavorite(movie)
    }
  }

  const handleSimilarFavoriteClick = (similarMovie: Movie) => {
    if (isFavorite(similarMovie.id)) {
      removeFavorite(similarMovie.id)
    } else {
      addFavorite(similarMovie)
    }
  }

  useEffect(() => {
    const fetchSimilarMovies = async () => {
      setLoadingSimilar(true)
      try {
        const response = await movieService.getSimilarMovies(movie.id)
        setSimilarMovies(response.results.slice(0, 12))
      } catch (error) {
        console.error("Failed to fetch similar movies:", error)
      } finally {
        setLoadingSimilar(false)
      }
    }

    const fetchRecommendedMovies = async () => {
      setLoadingRecommended(true)
      try {
        const response = await movieService.getRecommendedMovies(movie.id)
        setRecommendedMovies(response.results.slice(0, 12))
      } catch (error) {
        console.error("Failed to fetch recommended movies:", error)
      } finally {
        setLoadingRecommended(false)
      }
    }

    fetchSimilarMovies()
    fetchRecommendedMovies()
  }, [movie.id])

  const favoriteIds = [movie.id]

  return (
    <main className="min-h-screen">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <Image src={backdropUrl || "/placeholder.svg"} alt={movie.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <Button variant="secondary" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>
      </div>

      {/* Movie Information */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <div className="relative aspect-[2/3]">
                <Image src={posterUrl || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
              </div>
            </Card>
          </div>

          {/* Movie Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">{movie.title}</h1>
                  {movie.original_title !== movie.title && (
                    <p className="text-lg text-muted-foreground">{movie.original_title}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleFavoriteClick}
                    variant={favorite ? "default" : "outline"}
                    className={favorite ? "bg-red-500 hover:bg-red-600" : ""}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${favorite ? "fill-white" : ""}`} />
                    {favorite ? "Favorited" : "Add to Favorites"}
                  </Button>
                  <Button size="lg" className="bg-accent hover:bg-accent/90">
                    <Play className="h-4 w-4 mr-2" />
                    Watch Trailer
                  </Button>
                </div>
              </div>

              {/* Rating and Basic Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-muted-foreground">({movie.vote_count} votes)</span>
                </div>

                <Separator orientation="vertical" className="h-4" />

                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(movie.release_date)}</span>
                </div>

                {movie.runtime && (
                  <>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <Badge key={genre.id} variant="secondary">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Overview */}
              {movie.overview && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-foreground">Overview</h2>
                  <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
                </div>
              )}

              {/* Cast */}
              {movie.credits?.cast && movie.credits.cast.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">Cast</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {movie.credits.cast.slice(0, 8).map((actor) => (
                      <Card key={actor.id} className="overflow-hidden">
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                              {actor.profile_path ? (
                                <Image
                                  src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                  alt={actor.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Users className="h-8 w-8 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium text-sm text-foreground line-clamp-1">{actor.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{actor.character}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar and Recommended Movies */}
        <div className="mt-16 space-y-12">
          {similarMovies.length > 0 && (
            <CategorySection
              title="Similar Movies"
              movies={similarMovies}
              onFavoriteClick={handleSimilarFavoriteClick}
              favoriteMovieIds={favoriteIds}
              loading={loadingSimilar}
            />
          )}

          {recommendedMovies.length > 0 && (
            <CategorySection
              title="Recommended for You"
              movies={recommendedMovies}
              onFavoriteClick={handleSimilarFavoriteClick}
              favoriteMovieIds={favoriteIds}
              loading={loadingRecommended}
            />
          )}
        </div>
      </div>
    </main>
  )
}
