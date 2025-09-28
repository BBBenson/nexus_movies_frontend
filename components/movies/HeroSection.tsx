"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Movie } from "@/types/movie"
import { getImageUrl, truncateText } from "@/utils/helpers"
import { GENRES } from "@/utils/constants"

interface HeroSectionProps {
  movies: Movie[]
  loading?: boolean
}

export function HeroSection({ movies, loading = false }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const featuredMovies = movies?.slice(0, 5) || []

  useEffect(() => {
    if (!isAutoPlaying || featuredMovies.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, featuredMovies.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  if (loading || !movies || featuredMovies.length === 0) {
    return (
      <section className="relative h-[60vh] md:h-[80vh] bg-muted animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </section>
    )
  }

  const currentMovie = featuredMovies[currentIndex]
  const backdropUrl = getImageUrl(currentMovie.backdrop_path, "backdrop", "original")

  return (
    <section className="relative h-[60vh] md:h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backdropUrl || "/placeholder.svg"}
          alt={currentMovie.title}
          fill
          className="object-cover transition-all duration-1000"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </div>

      {/* Navigation Arrows */}
      {featuredMovies.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">{currentMovie.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  ⭐ {currentMovie.vote_average.toFixed(1)}
                </Badge>
                <span className="text-white/80">{new Date(currentMovie.release_date).getFullYear()}</span>
                {currentMovie.genre_ids && currentMovie.genre_ids.length > 0 && (
                  <div className="flex gap-2">
                    {currentMovie.genre_ids.slice(0, 2).map((genreId) => (
                      <Badge key={genreId} variant="outline" className="border-white/30 text-white/80">
                        {GENRES[genreId as keyof typeof GENRES]}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {currentMovie.overview && (
                <p className="text-lg text-white/90 leading-relaxed">{truncateText(currentMovie.overview, 200)}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90">
                <Play className="h-5 w-5 mr-2" />
                Watch Trailer
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                asChild
              >
                <Link href={`/movie/${currentMovie.id}`}>
                  <Info className="h-5 w-5 mr-2" />
                  More Info
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      {featuredMovies.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white w-8" : "bg-white/50 hover:bg-white/70"
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
