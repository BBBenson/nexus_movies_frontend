export interface Movie {
  id: number
  title: string
  overview: string
  release_date: string
  poster_path: string | null
  backdrop_path: string | null
  popularity: number
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  original_title: string
  video: boolean
}

export interface MovieDetails extends Movie {
  runtime: number | null
  genres: Genre[]
  credits?: Credits
  videos?: Videos
  similar?: MoviesResponse
}

export interface Genre {
  id: number
  name: string
}

export interface Credits {
  cast: CastMember[]
  crew: CrewMember[]
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
}

export interface CrewMember {
  id: number
  name: string
  job: string
  profile_path: string | null
}

export interface Videos {
  results: Video[]
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
}

export interface MoviesResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}
