import { type NextRequest, NextResponse } from "next/server"
import { authUtils } from "@/utils/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = authUtils.findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Create new user
    const newUser = authUtils.createUser(name, email, password)

    // Generate token
    const token = authUtils.generateToken(newUser.id)

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json({
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
