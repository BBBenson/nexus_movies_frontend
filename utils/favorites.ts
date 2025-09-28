// Simple in-memory favorites storage for demo purposes
// In a real app, this would be a database
interface UserFavorites {
  userId: string
  favorites: number[] // Movie IDs
}

const userFavorites: UserFavorites[] = []

export const favoritesUtils = {
  // Get user's favorite movie IDs
  getUserFavorites: (userId: string): number[] => {
    const userFavs = userFavorites.find((uf) => uf.userId === userId)
    return userFavs ? userFavs.favorites : []
  },

  // Add movie to user's favorites
  addFavorite: (userId: string, movieId: number): void => {
    let userFavs = userFavorites.find((uf) => uf.userId === userId)

    if (!userFavs) {
      userFavs = { userId, favorites: [] }
      userFavorites.push(userFavs)
    }

    if (!userFavs.favorites.includes(movieId)) {
      userFavs.favorites.push(movieId)
    }
  },

  // Remove movie from user's favorites
  removeFavorite: (userId: string, movieId: number): void => {
    const userFavs = userFavorites.find((uf) => uf.userId === userId)

    if (userFavs) {
      userFavs.favorites = userFavs.favorites.filter((id) => id !== movieId)
    }
  },

  // Clear all user's favorites
  clearFavorites: (userId: string): void => {
    const userFavs = userFavorites.find((uf) => uf.userId === userId)

    if (userFavs) {
      userFavs.favorites = []
    }
  },
}
