"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/useDebounce"

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ onSearch, placeholder = "Search movies...", className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const router = useRouter()

  useEffect(() => {
    if (debouncedQuery.trim()) {
      if (onSearch) {
        onSearch(debouncedQuery)
      } else {
        router.push(`/search?q=${encodeURIComponent(debouncedQuery)}`)
      }
    }
  }, [debouncedQuery, onSearch, router])

  const handleClear = () => {
    setQuery("")
    if (onSearch) {
      onSearch("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      if (onSearch) {
        onSearch(query)
      } else {
        router.push(`/search?q=${encodeURIComponent(query)}`)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div
        className={`relative flex items-center transition-all duration-200 ${isFocused ? "ring-2 ring-accent" : ""}`}
      >
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="pl-10 pr-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-accent"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  )
}
