"use client"

import { Star } from "lucide-react"

interface RatingProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  className?: string
}

export function Rating({ rating, maxRating = 10, size = "md", showValue = true, className = "" }: RatingProps) {
  const normalizedRating = (rating / maxRating) * 5
  const fullStars = Math.floor(normalizedRating)
  const hasHalfStar = normalizedRating % 1 >= 0.5

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => {
          const isFilled = index < fullStars
          const isHalf = index === fullStars && hasHalfStar

          return (
            <Star
              key={index}
              className={`${sizeClasses[size]} ${
                isFilled || isHalf ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
              }`}
            />
          )
        })}
      </div>

      {showValue && <span className={`${textSizeClasses[size]} font-medium text-foreground`}>{rating.toFixed(1)}</span>}
    </div>
  )
}
