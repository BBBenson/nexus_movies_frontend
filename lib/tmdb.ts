import axios from "axios"

const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = process.env.TMDB_API_KEY // Server-side only, no NEXT_PUBLIC prefix

console.log("[v0] TMDb API Key status:", API_KEY ? "Present" : "Missing")
console.log("[v0] TMDb API Key length:", API_KEY?.length || 0)

if (!API_KEY) {
  console.error("[v0] TMDB_API_KEY environment variable is missing!")
  throw new Error("TMDB_API_KEY environment variable is required")
}

export const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: API_KEY,
  },
  timeout: 30000, // Increased from 10s to 30s
  retry: 3,
  retryDelay: 1000,
})

tmdbClient.interceptors.response.use(
  (response) => {
    console.log("[v0] TMDb API Success:", response.config.url, response.status)
    return response
  },
  async (error) => {
    const config = error.config

    // Retry logic for network errors and timeouts
    if (config && config.retry > 0 && (error.code === "ECONNABORTED" || error.response?.status >= 500)) {
      config.retry -= 1
      console.log(`[v0] Retrying TMDb API request. Attempts left: ${config.retry}`)

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, config.retryDelay))

      return tmdbClient(config)
    }

    console.error("[v0] TMDb API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    })
    return Promise.reject(error)
  },
)
