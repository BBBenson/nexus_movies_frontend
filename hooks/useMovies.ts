"use client"

import { useState, useEffect, useCallback } from "react"
import { movieService } from "@/services/movieService"
import type { Movie, MoviesResponse } from "@/types/movie"

export type MovieCategory = "trending" | "popular" | "top_rated" | "now_playing"

interface UseMoviesOptions {
  category?: MovieCategory
  autoFetch?: boolean
  initialPage?: number
}

interface UseMoviesReturn {
  movies: Movie[]
  loading: boolean
  error: string | null
  hasMore: boolean
  currentPage: number
  totalPages: number
  fetchMovies: (page?: number) => Promise<void>
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
}

export function useMovies({
  category = "trending",
  autoFetch = true,
  initialPage = 1,
}: UseMoviesOptions = {}): UseMoviesReturn {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(0)

  const fetchMovies = useCallback(
    async (page = 1, append = false) => {
      setLoading(true)
      setError(null)

      try {
        let response: MoviesResponse

        switch (category) {
          case "popular":
            response = await movieService.getPopularMovies(page)
            break
          case "top_rated":
            response = await movieService.getTopRatedMovies(page)
            break
          case "now_playing":
            response = await movieService.getNowPlayingMovies(page)
            break
          case "trending":
          default:
            response = await movieService.getTrendingMovies(page)
            break
        }

        if (append) {
          setMovies((prev) => [...prev, ...response.results])
        } else {
          setMovies(response.results)
        }

        setCurrentPage(response.page)
        setTotalPages(response.total_pages)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    },
    [category],
  )

  const loadMore = useCallback(async () => {
    if (currentPage < totalPages && !loading) {
      await fetchMovies(currentPage + 1, true)
    }
  }, [currentPage, totalPages, loading, fetchMovies])

  const refresh = useCallback(async () => {
    setCurrentPage(1)
    await fetchMovies(1, false)
  }, [fetchMovies])

  useEffect(() => {
    if (autoFetch) {
      fetchMovies(initialPage)
    }
  }, [category, autoFetch, initialPage, fetchMovies])

  return {
    movies,
    loading,
    error,
    hasMore: currentPage < totalPages,
    currentPage,
    totalPages,
    fetchMovies: (page?: number) => fetchMovies(page || 1, false),
    loadMore,
    refresh,
  }
}
