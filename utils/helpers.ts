import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from "./constants"

export const getImageUrl = (
  path: string | null,
  type: "poster" | "backdrop" = "poster",
  size: keyof typeof IMAGE_SIZES.poster | keyof typeof IMAGE_SIZES.backdrop = "medium",
): string => {
  if (!path) {
    return type === "poster" ? "/movie-poster-placeholder.png" : "/generic-movie-backdrop.png"
  }

  const sizeValue = IMAGE_SIZES[type][size as keyof (typeof IMAGE_SIZES)[typeof type]]
  return `${TMDB_IMAGE_BASE_URL}/${sizeValue}${path}`
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export const formatRuntime = (minutes: number | null): string => {
  if (!minutes) return "Runtime unknown"

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) return `${remainingMinutes}m`
  if (remainingMinutes === 0) return `${hours}h`

  return `${hours}h ${remainingMinutes}m`
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + "..."
}
