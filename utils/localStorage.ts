import type { Movie } from "@/types/movie"

const FAVORITES_KEY = "nexus-movie-favorites"

export const localStorageService = {
  getFavorites: (): Movie[] => {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error reading favorites from localStorage:", error)
      return []
    }
  },

  saveFavorites: (favorites: Movie[]): void => {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error)
    }
  },

  addFavorite: (movie: Movie): void => {
    const favorites = localStorageService.getFavorites()
    const isAlreadyFavorite = favorites.some((fav) => fav.id === movie.id)

    if (!isAlreadyFavorite) {
      const updatedFavorites = [...favorites, movie]
      localStorageService.saveFavorites(updatedFavorites)
    }
  },

  removeFavorite: (movieId: number): void => {
    const favorites = localStorageService.getFavorites()
    const updatedFavorites = favorites.filter((movie) => movie.id !== movieId)
    localStorageService.saveFavorites(updatedFavorites)
  },
}
