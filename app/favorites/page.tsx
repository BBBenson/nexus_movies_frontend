"use client"

import { Header } from "@/components/common/Header"
import { MovieGrid } from "@/components/movies/MovieGrid"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/contexts/FavoritesContext"
import { Heart, Trash2 } from "lucide-react"

export default function FavoritesPage() {
  const { favorites, loading, removeFavorite, clearFavorites, favoritesCount } = useFavorites()

  const handleFavoriteClick = (movie: any) => {
    removeFavorite(movie.id)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Heart className="h-8 w-8 text-red-500 fill-red-500" />
                My Favorites
              </h1>
              <p className="text-muted-foreground">
                {favoritesCount === 0
                  ? "You haven't added any movies to your favorites yet."
                  : `You have ${favoritesCount} favorite ${favoritesCount === 1 ? "movie" : "movies"}.`}
              </p>
            </div>

            {favoritesCount > 0 && (
              <Button
                variant="outline"
                onClick={clearFavorites}
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {/* Movies Grid */}
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mb-6">
                <Heart className="h-16 w-16 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">No favorites yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Start exploring movies and click the heart icon to add them to your favorites list.
              </p>
              <Button asChild>
                <a href="/">Browse Movies</a>
              </Button>
            </div>
          ) : (
            <MovieGrid
              movies={favorites}
              onFavoriteClick={handleFavoriteClick}
              favoriteMovieIds={favorites.map((movie) => movie.id)}
              showOverview={true}
            />
          )}
        </div>
      </main>
    </div>
  )
}
