"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/common/Header"
import { MovieGrid } from "@/components/movies/MovieGrid"
import { SearchBar } from "@/components/movies/SearchBar"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/contexts/FavoritesContext"
import { movieService } from "@/services/movieService"
import type { Movie } from "@/types/movie"
import { Search } from "lucide-react"

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)

  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites()

  const searchMovies = async (searchQuery: string, page = 1, append = false) => {
    if (!searchQuery.trim()) {
      setMovies([])
      setHasSearched(false)
      return
    }

    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const response = await movieService.searchMovies(searchQuery, page)

      if (append) {
        setMovies((prev) => [...prev, ...response.results])
      } else {
        setMovies(response.results)
      }

      setCurrentPage(response.page)
      setTotalPages(response.total_pages)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    setCurrentPage(1)
    searchMovies(searchQuery, 1, false)
  }

  const loadMore = () => {
    if (currentPage < totalPages && !loading) {
      searchMovies(query, currentPage + 1, true)
    }
  }

  const handleFavoriteClick = (movie: Movie) => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id)
    } else {
      addFavorite(movie)
    }
  }

  useEffect(() => {
    if (initialQuery) {
      searchMovies(initialQuery)
    }
  }, [initialQuery])

  const favoriteIds = favorites.map((movie) => movie.id)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Search Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Search className="h-6 w-6 text-accent" />
              <h1 className="text-3xl font-bold text-foreground">Search Movies</h1>
            </div>

            <div className="max-w-2xl">
              <SearchBar onSearch={handleSearch} placeholder="Search for movies..." className="w-full" />
            </div>

            {query && hasSearched && (
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                  {loading ? "Searching..." : `Search results for "${query}"`}
                  {!loading && movies.length > 0 && (
                    <span className="ml-2 text-accent font-medium">
                      ({movies.length} {movies.length === 1 ? "result" : "results"})
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && movies.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-destructive" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Search Error</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => searchMovies(query)} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {/* No Results */}
          {hasSearched && !loading && movies.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">No movies found</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                We couldn't find any movies matching "{query}". Try different keywords or check your spelling.
              </p>
              <Button onClick={() => setQuery("")} variant="outline">
                Clear Search
              </Button>
            </div>
          )}

          {/* Search Results */}
          {movies.length > 0 && (
            <div className="space-y-8">
              <MovieGrid
                movies={movies}
                onFavoriteClick={handleFavoriteClick}
                favoriteMovieIds={favoriteIds}
                showOverview={true}
              />

              {/* Load More Button */}
              {currentPage < totalPages && (
                <div className="flex justify-center">
                  <Button onClick={loadMore} disabled={loading} variant="outline" className="min-w-32 bg-transparent">
                    {loading ? <LoadingSpinner size="sm" /> : "Load More"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Initial State */}
          {!hasSearched && !query && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                <Search className="h-12 w-12 text-accent" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Discover Movies</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Search for your favorite movies, discover new releases, or explore different genres.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner size="lg" />
            </div>
          </main>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
