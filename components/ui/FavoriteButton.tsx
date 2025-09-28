"use client"

import type React from "react"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Movie } from "@/types/movie"
import { useFavorites } from "@/contexts/FavoritesContext"

interface FavoriteButtonProps {
  movie: Movie
  size?: "sm" | "md" | "lg"
  variant?: "default" | "ghost" | "outline"
  className?: string
}

export function FavoriteButton({ movie, size = "md", variant = "ghost", className = "" }: FavoriteButtonProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const [isAnimating, setIsAnimating] = useState(false)

  const favorite = isFavorite(movie.id)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)

    if (favorite) {
      removeFavorite(movie.id)
    } else {
      addFavorite(movie)
    }
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  return (
    <Button
      variant={variant}
      size="icon"
      className={`${sizeClasses[size]} ${className} ${isAnimating ? "animate-pulse" : ""}`}
      onClick={handleClick}
      title={favorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`${iconSizes[size]} transition-all duration-200 ${
          favorite ? "fill-red-500 text-red-500 scale-110" : "text-muted-foreground hover:text-red-500"
        } ${isAnimating ? "scale-125" : ""}`}
      />
    </Button>
  )
}
