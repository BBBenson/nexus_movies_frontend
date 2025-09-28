import { type NextRequest, NextResponse } from "next/server"
import { tmdbClient } from "@/lib/tmdb"

export async function GET(request: NextRequest) {
  console.log("[v0] Movies API route called:", request.url)

  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") || "trending"
  const page = Number.parseInt(searchParams.get("page") || "1")
  const query = searchParams.get("query")
  const genre = searchParams.get("genre")

  console.log("[v0] API Parameters:", { category, page, query, genre })

  try {
    let endpoint = ""
    const params: Record<string, any> = { page }

    if (query) {
      // Search movies
      endpoint = "/search/movie"
      params.query = query
      params.include_adult = false
    } else if (genre) {
      // Movies by genre
      endpoint = "/discover/movie"
      params.with_genres = genre
      params.sort_by = "popularity.desc"
    } else {
      // Category-based endpoints
      switch (category) {
        case "popular":
          endpoint = "/movie/popular"
          break
        case "top_rated":
          endpoint = "/movie/top_rated"
          break
        case "now_playing":
          endpoint = "/movie/now_playing"
          break
        case "trending":
        default:
          endpoint = "/trending/movie/week"
          break
      }
    }

    console.log("[v0] Calling TMDb endpoint:", endpoint, "with params:", params)

    const response = await tmdbClient.get(endpoint, { params })

    console.log("[v0] TMDb response received:", {
      status: response.status,
      resultsCount: response.data?.results?.length || 0,
      totalResults: response.data?.total_results || 0,
      fullData: JSON.stringify(response.data, null, 2),
    })

    if (!response.data || !response.data.results) {
      console.error("[v0] Invalid TMDb response structure:", response.data)
      return NextResponse.json({
        results: [],
        total_results: 0,
        total_pages: 0,
        page: 1,
      })
    }

    return NextResponse.json(response.data)
  } catch (error) {
    console.error("[v0] API Route Error:", {
      message: error instanceof Error ? error.message : "Unknown error",
      status: error.response?.status,
      data: error.response?.data,
    })
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 })
  }
}
