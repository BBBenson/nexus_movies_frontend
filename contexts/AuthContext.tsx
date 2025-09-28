"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useCallback } from "react"
import type { User, AuthState, LoginCredentials, RegisterCredentials } from "@/types/auth"

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGOUT" }

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
      }
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      }
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      }
    default:
      return state
  }
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    loading: true,
  })

  // Check authentication status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        dispatch({ type: "SET_USER", payload: null })
        return
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const user = await response.json()
        dispatch({ type: "SET_USER", payload: user })
      } else {
        localStorage.removeItem("auth_token")
        dispatch({ type: "SET_USER", payload: null })
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("auth_token")
      dispatch({ type: "SET_USER", payload: null })
    }
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Login failed")
      }

      const { user, token } = await response.json()
      localStorage.setItem("auth_token", token)
      dispatch({ type: "LOGIN_SUCCESS", payload: user })
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
      throw error
    }
  }, [])

  const register = useCallback(async (credentials: RegisterCredentials) => {
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Registration failed")
      }

      const { user, token } = await response.json()
      localStorage.setItem("auth_token", token)
      dispatch({ type: "LOGIN_SUCCESS", payload: user })
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
      throw error
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token")
    dispatch({ type: "LOGOUT" })
  }, [])

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
