export const TMDB_BASE_URL = "https://api.themoviedb.org/3"
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

export const IMAGE_SIZES = {
  poster: {
    small: "w185",
    medium: "w342",
    large: "w500",
    xlarge: "w780",
  },
  backdrop: {
    small: "w300",
    medium: "w780",
    large: "w1280",
    original: "original",
  },
} as const

export const GENRES = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
} as const
