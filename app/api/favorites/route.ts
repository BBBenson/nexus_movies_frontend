import { type NextRequest, NextResponse } from "next/server"
import { authUtils } from "@/utils/auth"
import { favoritesUtils } from "@/utils/favorites"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = authUtils.verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 })
    }

    const favoriteIds = favoritesUtils.getUserFavorites(decoded.userId)
    return NextResponse.json({ favorites: favoriteIds })
  } catch (error) {
    console.error("Get favorites error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = authUtils.verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 })
    }

    const { movieId, action } = await request.json()

    if (!movieId || !action) {
      return NextResponse.json({ message: "Movie ID and action are required" }, { status: 400 })
    }

    if (action === "add") {
      favoritesUtils.addFavorite(decoded.userId, movieId)
    } else if (action === "remove") {
      favoritesUtils.removeFavorite(decoded.userId, movieId)
    } else {
      return NextResponse.json({ message: "Invalid action. Use 'add' or 'remove'" }, { status: 400 })
    }

    const favoriteIds = favoritesUtils.getUserFavorites(decoded.userId)
    return NextResponse.json({ favorites: favoriteIds })
  } catch (error) {
    console.error("Update favorites error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = authUtils.verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 })
    }

    favoritesUtils.clearFavorites(decoded.userId)
    return NextResponse.json({ message: "Favorites cleared successfully" })
  } catch (error) {
    console.error("Clear favorites error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
