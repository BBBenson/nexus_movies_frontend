import axios from "axios"

export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 30000, // Increased timeout from 10s to 30s for better reliability
})

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making internal API request to: ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error("Internal API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  },
)
