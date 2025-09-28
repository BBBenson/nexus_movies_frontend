"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/LoginForm"
import { RegisterForm } from "@/components/auth/RegisterForm"
import { useAuth } from "@/contexts/AuthContext"
import { Header } from "@/components/common/Header"

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login")
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const handleSuccess = () => {
    router.push("/")
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          {mode === "login" ? (
            <LoginForm onSuccess={handleSuccess} onSwitchToRegister={() => setMode("register")} />
          ) : (
            <RegisterForm onSuccess={handleSuccess} onSwitchToLogin={() => setMode("login")} />
          )}
        </div>
      </div>
    </div>
  )
}
