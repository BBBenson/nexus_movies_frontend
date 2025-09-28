"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useCallback } from "react"
import type { Movie } from "@/types/movie"
import { localStorageService } from "@/utils/localStorage"
import { useAuth } from "@/contexts/AuthContext"

interface FavoritesState {
  favorites: Movie[]
  loading: boolean
}

type FavoritesAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_FAVORITES"; payload: Movie[] }
  | { type: "ADD_FAVORITE"; payload: Movie }
  | { type: "REMOVE_FAVORITE"; payload: number }
  | { type: "CLEAR_FAVORITES" }

const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    case "SET_FAVORITES":
      return {
        ...state,
        favorites: action.payload,
        loading: false,
      }
    case "ADD_FAVORITE":
      const isAlreadyFavorite = state.favorites.some((movie) => movie.id === action.payload.id)
      if (isAlreadyFavorite) return state

      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      }
    case "REMOVE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter((movie) => movie.id !== action.payload),
      }
    case "CLEAR_FAVORITES":
      return {
        ...state,
        favorites: [],
      }
    default:
      return state
  }
}

interface FavoritesContextType {
  favorites: Movie[]
  loading: boolean
  addFavorite: (movie: Movie) => Promise<void>
  removeFavorite: (movieId: number) => Promise<void>
  isFavorite: (movieId: number) => boolean
  clearFavorites: () => Promise<void>
  favoritesCount: number
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, {
    favorites: [],
    loading: true,
  })
  const { isAuthenticated, user, loading: authLoading } = useAuth()

  const loadFavorites = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      if (isAuthenticated && user) {
        // Load from server for authenticated users
        const token = localStorage.getItem("auth_token")
        if (token) {
          const response = await fetch("/api/favorites", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const { favorites: favoriteIds } = await response.json()

            // Fetch movie details for each favorite ID
            const favoriteMovies: Movie[] = []
            for (const movieId of favoriteIds) {
              try {
                const movieResponse = await fetch(`/api/movies/${movieId}`)
                if (movieResponse.ok) {
                  const movie = await movieResponse.json()
                  favoriteMovies.push(movie)
                }
              } catch (error) {
                console.error(`Error fetching movie ${movieId}:`, error)
              }
            }

            dispatch({ type: "SET_FAVORITES", payload: favoriteMovies })
          } else {
            dispatch({ type: "SET_FAVORITES", payload: [] })
          }
        }
      } else {
        // Load from localStorage for non-authenticated users
        const savedFavorites = localStorageService.getFavorites()
        dispatch({ type: "SET_FAVORITES", payload: savedFavorites })
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
      dispatch({ type: "SET_FAVORITES", payload: [] })
    }
  }, [isAuthenticated, user])

  // Load favorites when auth state changes
  useEffect(() => {
    if (!authLoading) {
      loadFavorites()
    }
  }, [authLoading, loadFavorites])

  useEffect(() => {
    if (!state.loading && !authLoading && !isAuthenticated) {
      // Save to localStorage for non-authenticated users
      try {
        localStorageService.saveFavorites(state.favorites)
      } catch (error) {
        console.error("Error saving favorites to localStorage:", error)
      }
    }
  }, [state.favorites, state.loading, authLoading, isAuthenticated])

  const addFavorite = useCallback(
    async (movie: Movie) => {
      if (isAuthenticated && user) {
        try {
          const token = localStorage.getItem("auth_token")
          if (token) {
            const response = await fetch("/api/favorites", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ movieId: movie.id, action: "add" }),
            })

            if (response.ok) {
              dispatch({ type: "ADD_FAVORITE", payload: movie })
            }
          }
        } catch (error) {
          console.error("Error adding favorite:", error)
        }
      } else {
        // For non-authenticated users, just update local state
        dispatch({ type: "ADD_FAVORITE", payload: movie })
      }
    },
    [isAuthenticated, user],
  )

  const removeFavorite = useCallback(
    async (movieId: number) => {
      if (isAuthenticated && user) {
        try {
          const token = localStorage.getItem("auth_token")
          if (token) {
            const response = await fetch("/api/favorites", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ movieId, action: "remove" }),
            })

            if (response.ok) {
              dispatch({ type: "REMOVE_FAVORITE", payload: movieId })
            }
          }
        } catch (error) {
          console.error("Error removing favorite:", error)
        }
      } else {
        // For non-authenticated users, just update local state
        dispatch({ type: "REMOVE_FAVORITE", payload: movieId })
      }
    },
    [isAuthenticated, user],
  )

  const isFavorite = (movieId: number) => {
    return state.favorites.some((movie) => movie.id === movieId)
  }

  const clearFavorites = useCallback(async () => {
    if (isAuthenticated && user) {
      try {
        const token = localStorage.getItem("auth_token")
        if (token) {
          const response = await fetch("/api/favorites", {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            dispatch({ type: "CLEAR_FAVORITES" })
          }
        }
      } catch (error) {
        console.error("Error clearing favorites:", error)
      }
    } else {
      // For non-authenticated users, just update local state
      dispatch({ type: "CLEAR_FAVORITES" })
    }
  }, [isAuthenticated, user])

  const contextValue: FavoritesContextType = {
    favorites: state.favorites,
    loading: state.loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: state.favorites.length,
  }

  return <FavoritesContext.Provider value={contextValue}>{children}</FavoritesContext.Provider>
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
