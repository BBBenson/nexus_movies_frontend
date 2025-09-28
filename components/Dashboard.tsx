"use client"

import { Header } from "@/components/common/Header"
import { Footer } from "@/components/common/Footer"
import { HeroSection } from "@/components/movies/HeroSection"
import { CategorySection } from "@/components/movies/CategorySection"
import { ErrorBoundary } from "@/components/ui/ErrorBoundary"
import { useMovies } from "@/hooks/useMovies"
import { useFavorites } from "@/contexts/FavoritesContext"

export function Dashboard() {
  const { movies: trendingMovies, loading: trendingLoading } = useMovies({
    category: "trending",
  })
  const { movies: popularMovies, loading: popularLoading } = useMovies({
    category: "popular",
  })
  const { movies: topRatedMovies, loading: topRatedLoading } = useMovies({
    category: "top_rated",
  })
  const { movies: nowPlayingMovies, loading: nowPlayingLoading } = useMovies({
    category: "now_playing",
  })

  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites()

  const handleFavoriteClick = (movie: any) => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id)
    } else {
      addFavorite(movie)
    }
  }

  const favoriteIds = favorites.map((movie) => movie.id)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <ErrorBoundary>
          {/* Hero Section */}
          <HeroSection movies={trendingMovies} loading={trendingLoading} />

          {/* Movie Categories */}
          <div className="container mx-auto px-4 py-12 space-y-12">
            <CategorySection
              title="Trending This Week"
              movies={trendingMovies}
              onFavoriteClick={handleFavoriteClick}
              favoriteMovieIds={favoriteIds}
              loading={trendingLoading}
            />

            <CategorySection
              title="Popular Movies"
              movies={popularMovies}
              onFavoriteClick={handleFavoriteClick}
              favoriteMovieIds={favoriteIds}
              loading={popularLoading}
            />

            <CategorySection
              title="Top Rated"
              movies={topRatedMovies}
              onFavoriteClick={handleFavoriteClick}
              favoriteMovieIds={favoriteIds}
              loading={topRatedLoading}
            />

            <CategorySection
              title="Now Playing"
              movies={nowPlayingMovies}
              onFavoriteClick={handleFavoriteClick}
              favoriteMovieIds={favoriteIds}
              loading={nowPlayingLoading}
            />
          </div>
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  )
}
