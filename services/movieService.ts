import { apiClient } from "./api"
import type { MovieDetails, MoviesResponse } from "@/types/movie"

const handleApiError = (error: any, operation: string): MoviesResponse => {
  console.error(`[v0] Failed to ${operation}:`, error)

  // Return empty response instead of throwing for better UX
  return {
    page: 1,
    results: [],
    total_pages: 0,
    total_results: 0,
  }
}

export const movieService = {
  getTrendingMovies: async (page = 1): Promise<MoviesResponse> => {
    try {
      console.log("[v0] Fetching trending movies, page:", page)
      const response = await apiClient.get("/movies", {
        params: { category: "trending", page },
      })
      console.log("[v0] Trending movies response:", response.data?.results?.length || 0, "movies")
      return response.data
    } catch (error) {
      return handleApiError(error, "fetch trending movies")
    }
  },

  getPopularMovies: async (page = 1): Promise<MoviesResponse> => {
    try {
      console.log("[v0] Fetching popular movies, page:", page)
      const response = await apiClient.get("/movies", {
        params: { category: "popular", page },
      })
      console.log("[v0] Popular movies response:", response.data?.results?.length || 0, "movies")
      return response.data
    } catch (error) {
      return handleApiError(error, "fetch popular movies")
    }
  },

  getTopRatedMovies: async (page = 1): Promise<MoviesResponse> => {
    try {
      console.log("[v0] Fetching top rated movies, page:", page)
      const response = await apiClient.get("/movies", {
        params: { category: "top_rated", page },
      })
      console.log("[v0] Top rated movies response:", response.data?.results?.length || 0, "movies")
      return response.data
    } catch (error) {
      return handleApiError(error, "fetch top rated movies")
    }
  },

  getNowPlayingMovies: async (page = 1): Promise<MoviesResponse> => {
    try {
      console.log("[v0] Fetching now playing movies, page:", page)
      const response = await apiClient.get("/movies", {
        params: { category: "now_playing", page },
      })
      console.log("[v0] Now playing movies response:", response.data?.results?.length || 0, "movies")
      return response.data
    } catch (error) {
      return handleApiError(error, "fetch now playing movies")
    }
  },

  getMovieDetails: async (id: number): Promise<MovieDetails | null> => {
    try {
      console.log("[v0] Fetching movie details for ID:", id)
      const response = await apiClient.get(`/movies/${id}`)
      console.log("[v0] Movie details response:", response.data)
      return response.data
    } catch (error) {
      console.error(`[v0] Failed to fetch movie details for ID: ${id}`, error)
      return null
    }
  },

  searchMovies: async (query: string, page = 1): Promise<MoviesResponse> => {
    try {
      console.log("[v0] Searching movies for query:", query, ", page:", page)
      if (!query.trim()) {
        return {
          page: 1,
          results: [],
          total_pages: 0,
          total_results: 0,
        }
      }

      const response = await apiClient.get("/movies", {
        params: { query: query.trim(), page },
      })
      console.log("[v0] Search movies response:", response.data?.results?.length || 0, "movies")
      return response.data
    } catch (error) {
      return handleApiError(error, "search movies")
    }
  },

  getSimilarMovies: async (id: number, page = 1): Promise<MoviesResponse> => {
    try {
      console.log("[v0] Fetching similar movies for ID:", id, ", page:", page)
      const response = await apiClient.get(`/movies/${id}/similar`, {
        params: { page },
      })
      console.log("[v0] Similar movies response:", response.data?.results?.length || 0, "movies")
      return response.data
    } catch (error) {
      return handleApiError(error, `fetch similar movies for ID: ${id}`)
    }
  },

  getRecommendedMovies: async (id: number, page = 1): Promise<MoviesResponse> => {
    try {
      console.log("[v0] Fetching recommended movies for ID:", id, ", page:", page)
      const response = await apiClient.get(`/movies/${id}/recommendations`, {
        params: { page },
      })
      console.log("[v0] Recommended movies response:", response.data?.results?.length || 0, "movies")
      return response.data
    } catch (error) {
      return handleApiError(error, `fetch recommended movies for ID: ${id}`)
    }
  },

  getMoviesByGenre: async (genreId: number, page = 1): Promise<MoviesResponse> => {
    try {
      console.log("[v0] Fetching movies by genre", genreId, ", page:", page)
      const response = await apiClient.get("/movies", {
        params: { genre: genreId, page },
      })
      console.log("[v0] Movies by genre response:", response.data?.results?.length || 0, "movies")
      return response.data
    } catch (error) {
      return handleApiError(error, `fetch movies by genre ${genreId}`)
    }
  },
}
