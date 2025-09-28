import { type NextRequest, NextResponse } from "next/server"
import { tmdbClient } from "@/lib/tmdb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const movieId = Number.parseInt(params.id)

  if (isNaN(movieId)) {
    return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 })
  }

  try {
    const response = await tmdbClient.get(`/movie/${movieId}`, {
      params: {
        append_to_response: "credits,videos,similar,recommendations",
      },
    })
    return NextResponse.json(response.data)
  } catch (error) {
    console.error("API Route Error:", error)
    return NextResponse.json({ error: "Failed to fetch movie details" }, { status: 500 })
  }
}
