// Client-side storage for persistent data across sessions
class ClientStorage {
  constructor() {
    this.STORAGE_KEY = "youapp_users"
    this.PROFILES_KEY = "youapp_profiles"
    this.init()
  }

  init() {
    if (typeof window !== "undefined") {
      // Initialize storage if it doesn't exist
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify({}))
      }
      if (!localStorage.getItem(this.PROFILES_KEY)) {
        localStorage.setItem(this.PROFILES_KEY, JSON.stringify({}))
      }
    }
  }

  // User management
  saveUser(userData) {
    if (typeof window === "undefined") return false

    try {
      const users = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "{}")
      users[userData.id] = userData
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users))
      console.log("💾 User saved to client storage:", userData.username)
      return true
    } catch (error) {
      console.error("❌ Failed to save user:", error)
      return false
    }
  }

  getUser(identifier) {
    if (typeof window === "undefined") return null

    try {
      const users = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "{}")

      // Search by email or username
      for (const userId in users) {
        const user = users[userId]
        if (user.email === identifier || user.username === identifier) {
          return user
        }
      }
      return null
    } catch (error) {
      console.error("❌ Failed to get user:", error)
      return null
    }
  }

  // Profile management
  saveProfile(userId, profileData) {
    if (typeof window === "undefined") return false

    try {
      const profiles = JSON.parse(localStorage.getItem(this.PROFILES_KEY) || "{}")
      profiles[userId] = {
        ...profileData,
        id: userId,
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem(this.PROFILES_KEY, JSON.stringify(profiles))
      console.log("💾 Profile saved to client storage for user:", userId)
      return true
    } catch (error) {
      console.error("❌ Failed to save profile:", error)
      return false
    }
  }

  getProfile(userId) {
    if (typeof window === "undefined") return null

    try {
      const profiles = JSON.parse(localStorage.getItem(this.PROFILES_KEY) || "{}")
      return profiles[userId] || null
    } catch (error) {
      console.error("❌ Failed to get profile:", error)
      return null
    }
  }

  // Clear all data
  clearAll() {
    if (typeof window === "undefined") return

    localStorage.removeItem(this.STORAGE_KEY)
    localStorage.removeItem(this.PROFILES_KEY)
    this.init()
    console.log("🗑️ All client data cleared")
  }

  // Get statistics
  getStats() {
    if (typeof window === "undefined") return { users: 0, profiles: 0 }

    try {
      const users = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || "{}")
      const profiles = JSON.parse(localStorage.getItem(this.PROFILES_KEY) || "{}")

      return {
        users: Object.keys(users).length,
        profiles: Object.keys(profiles).length,
      }
    } catch (error) {
      return { users: 0, profiles: 0 }
    }
  }
}

export const clientStorage = new ClientStorage()
