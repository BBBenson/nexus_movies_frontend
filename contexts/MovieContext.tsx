"use client"

import type React from "react"
import { createContext, useContext, useReducer, useCallback } from "react"
import type { Movie } from "@/types/movie"
import { movieService } from "@/services/movieService"

interface MovieState {
  trendingMovies: Movie[]
  popularMovies: Movie[]
  topRatedMovies: Movie[]
  nowPlayingMovies: Movie[]
  searchResults: Movie[]
  loading: {
    trending: boolean
    popular: boolean
    topRated: boolean
    nowPlaying: boolean
    search: boolean
  }
  error: string | null
  searchQuery: string
}

type MovieAction =
  | { type: "SET_LOADING"; category: keyof MovieState["loading"]; loading: boolean }
  | { type: "SET_MOVIES"; category: "trending" | "popular" | "topRated" | "nowPlaying"; movies: Movie[] }
  | { type: "SET_SEARCH_RESULTS"; movies: Movie[]; query: string }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "CLEAR_SEARCH" }

const initialState: MovieState = {
  trendingMovies: [],
  popularMovies: [],
  topRatedMovies: [],
  nowPlayingMovies: [],
  searchResults: [],
  loading: {
    trending: false,
    popular: false,
    topRated: false,
    nowPlaying: false,
    search: false,
  },
  error: null,
  searchQuery: "",
}

const movieReducer = (state: MovieState, action: MovieAction): MovieState => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.category]: action.loading,
        },
      }
    case "SET_MOVIES":
      const movieKey = `${action.category}Movies` as keyof Pick<
        MovieState,
        "trendingMovies" | "popularMovies" | "topRatedMovies" | "nowPlayingMovies"
      >
      return {
        ...state,
        [movieKey]: action.movies,
      }
    case "SET_SEARCH_RESULTS":
      return {
        ...state,
        searchResults: action.movies,
        searchQuery: action.query,
      }
    case "SET_ERROR":
      return {
        ...state,
        error: action.error,
      }
    case "CLEAR_SEARCH":
      return {
        ...state,
        searchResults: [],
        searchQuery: "",
      }
    default:
      return state
  }
}

interface MovieContextType extends MovieState {
  fetchTrendingMovies: () => Promise<void>
  fetchPopularMovies: () => Promise<void>
  fetchTopRatedMovies: () => Promise<void>
  fetchNowPlayingMovies: () => Promise<void>
  searchMovies: (query: string) => Promise<void>
  clearSearch: () => void
}

const MovieContext = createContext<MovieContextType | undefined>(undefined)

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(movieReducer, initialState)

  const fetchTrendingMovies = useCallback(async () => {
    dispatch({ type: "SET_LOADING", category: "trending", loading: true })
    dispatch({ type: "SET_ERROR", error: null })

    try {
      const response = await movieService.getTrendingMovies()
      dispatch({ type: "SET_MOVIES", category: "trending", movies: response.results })
    } catch (error) {
      dispatch({ type: "SET_ERROR", error: "Failed to fetch trending movies" })
    } finally {
      dispatch({ type: "SET_LOADING", category: "trending", loading: false })
    }
  }, [])

  const fetchPopularMovies = useCallback(async () => {
    dispatch({ type: "SET_LOADING", category: "popular", loading: true })
    dispatch({ type: "SET_ERROR", error: null })

    try {
      const response = await movieService.getPopularMovies()
      dispatch({ type: "SET_MOVIES", category: "popular", movies: response.results })
    } catch (error) {
      dispatch({ type: "SET_ERROR", error: "Failed to fetch popular movies" })
    } finally {
      dispatch({ type: "SET_LOADING", category: "popular", loading: false })
    }
  }, [])

  const fetchTopRatedMovies = useCallback(async () => {
    dispatch({ type: "SET_LOADING", category: "topRated", loading: true })
    dispatch({ type: "SET_ERROR", error: null })

    try {
      const response = await movieService.getTopRatedMovies()
      dispatch({ type: "SET_MOVIES", category: "topRated", movies: response.results })
    } catch (error) {
      dispatch({ type: "SET_ERROR", error: "Failed to fetch top rated movies" })
    } finally {
      dispatch({ type: "SET_LOADING", category: "topRated", loading: false })
    }
  }, [])

  const fetchNowPlayingMovies = useCallback(async () => {
    dispatch({ type: "SET_LOADING", category: "nowPlaying", loading: true })
    dispatch({ type: "SET_ERROR", error: null })

    try {
      const response = await movieService.getNowPlayingMovies()
      dispatch({ type: "SET_MOVIES", category: "nowPlaying", movies: response.results })
    } catch (error) {
      dispatch({ type: "SET_ERROR", error: "Failed to fetch now playing movies" })
    } finally {
      dispatch({ type: "SET_LOADING", category: "nowPlaying", loading: false })
    }
  }, [])

  const searchMovies = useCallback(async (query: string) => {
    if (!query.trim()) {
      dispatch({ type: "CLEAR_SEARCH" })
      return
    }

    dispatch({ type: "SET_LOADING", category: "search", loading: true })
    dispatch({ type: "SET_ERROR", error: null })

    try {
      const response = await movieService.searchMovies(query)
      dispatch({ type: "SET_SEARCH_RESULTS", movies: response.results, query })
    } catch (error) {
      dispatch({ type: "SET_ERROR", error: "Failed to search movies" })
    } finally {
      dispatch({ type: "SET_LOADING", category: "search", loading: false })
    }
  }, [])

  const clearSearch = useCallback(() => {
    dispatch({ type: "CLEAR_SEARCH" })
  }, [])

  const contextValue: MovieContextType = {
    ...state,
    fetchTrendingMovies,
    fetchPopularMovies,
    fetchTopRatedMovies,
    fetchNowPlayingMovies,
    searchMovies,
    clearSearch,
  }

  return <MovieContext.Provider value={contextValue}>{children}</MovieContext.Provider>
}

export const useMovieContext = () => {
  const context = useContext(MovieContext)
  if (context === undefined) {
    throw new Error("useMovieContext must be used within a MovieProvider")
  }
  return context
}
