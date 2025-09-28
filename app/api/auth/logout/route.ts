import { NextResponse } from "next/server"

export async function POST() {
  // For token-based auth, logout is handled client-side by removing the token
  // This endpoint exists for consistency and future server-side session management
  return NextResponse.json({ message: "Logged out successfully" })
}
