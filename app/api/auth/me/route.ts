import { type NextRequest, NextResponse } from "next/server"
import { authUtils } from "@/utils/auth"

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

    const user = authUtils.getUserById(decoded.userId)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
