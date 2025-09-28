// Simple in-memory user storage for demo purposes
// In a real app, this would be a database
interface StoredUser {
  id: string
  email: string
  name: string
  password: string
  createdAt: string
}

const users: StoredUser[] = []

export const authUtils = {
  // Find user by email
  findUserByEmail: (email: string): StoredUser | undefined => {
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase())
  },

  // Create new user
  createUser: (name: string, email: string, password: string): StoredUser => {
    const user: StoredUser = {
      id: Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      name,
      password, // In a real app, this would be hashed
      createdAt: new Date().toISOString(),
    }
    users.push(user)
    return user
  },

  // Verify password (simplified for demo)
  verifyPassword: (password: string, storedPassword: string): boolean => {
    return password === storedPassword
  },

  // Generate simple JWT-like token (for demo purposes)
  generateToken: (userId: string): string => {
    return btoa(JSON.stringify({ userId, exp: Date.now() + 24 * 60 * 60 * 1000 }))
  },

  // Verify token
  verifyToken: (token: string): { userId: string } | null => {
    try {
      const decoded = JSON.parse(atob(token))
      if (decoded.exp < Date.now()) {
        return null // Token expired
      }
      return { userId: decoded.userId }
    } catch {
      return null
    }
  },

  // Get user by ID
  getUserById: (id: string): StoredUser | undefined => {
    return users.find((user) => user.id === id)
  },
}
