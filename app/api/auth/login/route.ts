import { type NextRequest, NextResponse } from "next/server"
import { authUtils } from "@/utils/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const user = authUtils.findUserByEmail(email)
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = authUtils.verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Generate token
    const token = authUtils.generateToken(user.id)

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
