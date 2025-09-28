import { Suspense } from "react"
import { notFound } from "next/navigation"
import { movieService } from "@/services/movieService"
import { MovieDetails } from "@/components/movies/MovieDetails"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { Header } from "@/components/common/Header"

interface MoviePageProps {
  params: {
    id: string
  }
}

async function getMovieDetails(id: number) {
  try {
    const movie = await movieService.getMovieDetails(id)
    return movie
  } catch (error) {
    console.error("Failed to fetch movie details:", error)
    return null
  }
}

export async function generateMetadata({ params }: MoviePageProps) {
  const movieId = Number.parseInt(params.id)

  if (isNaN(movieId)) {
    return {
      title: "Movie Not Found - Nexus Movie",
      description: "The requested movie could not be found.",
    }
  }

  const movie = await getMovieDetails(movieId)

  if (!movie) {
    return {
      title: "Movie Not Found - Nexus Movie",
      description: "The requested movie could not be found.",
    }
  }

  return {
    title: `${movie.title} (${new Date(movie.release_date).getFullYear()}) - Nexus Movie`,
    description: movie.overview || `Watch ${movie.title} and discover more movies on Nexus Movie.`,
    openGraph: {
      title: movie.title,
      description: movie.overview,
      images: movie.poster_path ? [`https://image.tmdb.org/t/p/w500${movie.poster_path}`] : [],
    },
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const movieId = Number.parseInt(params.id)

  if (isNaN(movieId)) {
    notFound()
  }

  const movie = await getMovieDetails(movieId)

  if (!movie) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Suspense
        fallback={
          <main className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner size="lg" />
            </div>
          </main>
        }
      >
        <MovieDetails movie={movie} />
      </Suspense>
    </div>
  )
}
