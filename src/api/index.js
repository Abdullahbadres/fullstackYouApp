import { clientStorage } from "./client-storage"

class ApiService {
  constructor() {
    // For production deployment, use the current domain if no API base URL is provided
    this.baseURL =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "http://localhost:3001")
    this.useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API === "true"

    console.log("🌐 API Service initialized with base URL:", this.baseURL)
    console.log("🎭 Use Mock API:", this.useMockApi)
    console.log("🌍 Environment:", process.env.NODE_ENV || "development")

    if (this.useMockApi) {
      console.log("🎭 Mock API is enabled - all operations will use localStorage")
    }
  }

  getAuthHeaders() {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token")
      return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      }
    }
    return {
      "Content-Type": "application/json",
    }
  }

  async checkUserExists(emailOrUsername) {
    if (this.useMockApi) {
      console.log("🎭 Mock API: Checking user existence for:", emailOrUsername)
      const user = clientStorage.getUser(emailOrUsername)
      const exists = !!user
      console.log("🎭 Mock API: User exists:", exists)
      return exists
    }

    try {
      console.log("🔍 Checking user existence for:", emailOrUsername)
      const response = await fetch(`${this.baseURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailOrUsername: emailOrUsername,
          password: "dummy_check_password_123",
        }),
      })

      if (response.status === 404) {
        return false
      } else if (response.status === 401) {
        return true
      } else if (response.status === 200) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error("💥 Error checking user existence:", error)
      return false
    }
  }

  async register(data) {
    if (this.useMockApi) {
      console.log("🎭 Mock API: Registering user:", data.username)

      // Check if user already exists
      const existingUser = clientStorage.getUser(data.email) || clientStorage.getUser(data.username)
      if (existingUser) {
        console.log("🎭 Mock API: User already exists")
        throw new Error("USER_ALREADY_EXISTS")
      }

      // Create new user
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const accessToken = `mock_token_${userId}_${Date.now()}`
      const newUser = {
        id: userId,
        email: data.email,
        username: data.username,
        password: data.password, // Mock: store plain password for validation
        access_token: accessToken,
        createdAt: new Date().toISOString(),
      }

      // Save user to localStorage
      const saved = clientStorage.saveUser(newUser)
      if (!saved) {
        throw new Error("Failed to save user data")
      }

      // Store access token
      localStorage.setItem("access_token", accessToken)

      console.log("✅ Mock registration successful, user saved to localStorage")

      return {
        message: `Account created successfully for ${data.username}!`,
        access_token: accessToken,
        user: {
          id: userId,
          email: data.email,
          username: data.username,
        },
      }
    }

    try {
      console.log("📝 Register API call to backend:", { ...data, password: "***" })
      console.log("🌐 Using backend URL:", this.baseURL)

      const response = await fetch(`${this.baseURL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      })

      console.log("📊 Register response status:", response.status)

      let result
      try {
        const responseText = await response.text()
        console.log("📦 Raw register response:", responseText)

        if (responseText) {
          result = JSON.parse(responseText)
        } else {
          result = { message: "Empty response from server" }
        }
      } catch (parseError) {
        console.error("❌ Failed to parse register response:", parseError)
        throw new Error("Server returned invalid response format")
      }

      console.log("📦 Parsed register response:", result)

      if (!response.ok) {
        console.error("❌ Register API error:", result)
        if (response.status === 409) {
          throw new Error("USER_ALREADY_EXISTS")
        } else if (response.status === 400) {
          throw new Error("INVALID_DATA")
        } else {
          throw new Error(result.message || result.error || "Registration failed")
        }
      }

      if (result.access_token) {
        localStorage.setItem("access_token", result.access_token)
        console.log("💾 Access token stored")
      }

      return result
    } catch (error) {
      console.error("💥 Register error:", error)

      // If backend fails, don't fallback to external API for registration
      if (error.message.includes("fetch")) {
        throw new Error(
          "Unable to connect to backend. Please make sure the backend server is running on " + this.baseURL,
        )
      }

      throw error
    }
  }

  async login(data) {
    if (this.useMockApi) {
      console.log("🎭 Mock API: Logging in user:", data.email || data.username)

      const user = clientStorage.getUser(data.email || data.username)
      if (!user) {
        console.log("🎭 Mock API: User not found")
        throw new Error("USER_NOT_FOUND")
      }

      if (user.password !== data.password) {
        console.log("🎭 Mock API: Invalid password")
        throw new Error("INVALID_CREDENTIALS")
      }

      // Update user with new token and last login
      const accessToken = `mock_token_${user.id}_${Date.now()}`
      user.access_token = accessToken
      user.lastLogin = new Date().toISOString()
      clientStorage.saveUser(user)

      // Store access token
      localStorage.setItem("access_token", accessToken)

      console.log("✅ Mock login successful")

      return {
        message: `Welcome back, ${user.username}!`,
        access_token: accessToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      }
    }

    try {
      console.log("🔐 Login API call to backend:", { ...data, password: "***" })
      console.log("🌐 Using backend URL:", this.baseURL)

      const loginPayload = {
        emailOrUsername: data.email || data.username,
        password: data.password,
      }

      const response = await fetch(`${this.baseURL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(loginPayload),
      })

      console.log("📊 Login response status:", response.status)

      let result
      try {
        const responseText = await response.text()
        console.log("📦 Raw login response:", responseText)

        if (responseText) {
          result = JSON.parse(responseText)
        } else {
          result = { message: "Empty response from server" }
        }
      } catch (parseError) {
        console.error("❌ Failed to parse login response:", parseError)
        throw new Error("Server returned invalid response format")
      }

      console.log("📦 Parsed login response:", result)

      if (!response.ok) {
        console.error("❌ Login API error:", result)
        if (response.status === 404) {
          throw new Error("USER_NOT_FOUND")
        } else if (response.status === 401) {
          throw new Error("INVALID_CREDENTIALS")
        } else {
          throw new Error(result.message || result.error || "Login failed")
        }
      }

      if (result.access_token) {
        localStorage.setItem("access_token", result.access_token)
        console.log("💾 Access token stored")
      }

      return result
    } catch (error) {
      console.error("💥 Login error:", error)

      // If backend fails, don't fallback to external API
      if (error.message.includes("fetch")) {
        throw new Error(
          "Unable to connect to backend. Please make sure the backend server is running on " + this.baseURL,
        )
      }

      throw error
    }
  }

  async getProfile() {
    if (this.useMockApi) {
      console.log("🎭 Mock API: Getting profile")
      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("Access token required for mock profile")
      }

      // Extract user ID from mock token
      const tokenParts = token.split("_")
      const userId = tokenParts.length >= 3 ? `${tokenParts[2]}_${tokenParts[3]}_${tokenParts[4]}` : null
      if (!userId) {
        throw new Error("Invalid mock access token")
      }

      const profile = clientStorage.getProfile(userId)
      if (profile) {
        console.log("✅ Mock profile retrieved from localStorage:", profile)
        return { data: profile }
      } else {
        // Return a default empty profile if none exists
        const defaultProfile = {
          name: "",
          birthday: "",
          height: 0,
          weight: 0,
          interests: [],
          gender: "",
          profileImage: "",
          heightUnit: "cm",
          heightFeet: 0,
          heightInches: 0,
        }
        console.log("ℹ️ Mock profile not found, returning default empty profile")
        return { data: defaultProfile }
      }
    }

    try {
      console.log("👤 Get profile API call")

      const response = await fetch(`${this.baseURL}/api/profiles`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      })

      if (response.status === 404) {
        // Profile doesn't exist, return empty profile
        const defaultProfile = {
          name: "",
          birthday: "",
          height: 0,
          weight: 0,
          interests: [],
          gender: "",
          profileImage: "",
          heightUnit: "cm",
          heightFeet: 0,
          heightInches: 0,
        }
        return { data: defaultProfile }
      }

      const result = await response.json()
      console.log("📦 Get profile response:", result)

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch profile")
      }

      return { data: result }
    } catch (error) {
      console.error("💥 Get profile error:", error)
      throw error
    }
  }

  async createProfile(data) {
    if (this.useMockApi) {
      console.log("🎭 Mock API: Creating profile")
      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("Access token required for mock profile creation")
      }

      // Extract user ID from mock token
      const tokenParts = token.split("_")
      const userId = tokenParts.length >= 3 ? `${tokenParts[2]}_${tokenParts[3]}_${tokenParts[4]}` : null
      if (!userId) {
        throw new Error("Invalid mock access token")
      }

      const saved = clientStorage.saveProfile(userId, data)
      if (!saved) {
        throw new Error("Failed to save profile data")
      }

      console.log("✅ Mock profile created and saved to localStorage")
      return { message: "Profile created successfully", data: data }
    }

    try {
      console.log("📝 Create profile API call")

      const response = await fetch(`${this.baseURL}/api/profiles`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      })

      const result = await response.json()
      console.log("📦 Create profile response:", result)

      if (!response.ok) {
        throw new Error(result.message || "Failed to create profile")
      }

      return result
    } catch (error) {
      console.error("💥 Create profile error:", error)
      throw error
    }
  }

  async updateProfile(data) {
    if (this.useMockApi) {
      console.log("🎭 Mock API: Updating profile")
      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("Access token required for mock profile update")
      }

      // Extract user ID from mock token
      const tokenParts = token.split("_")
      const userId = tokenParts.length >= 3 ? `${tokenParts[2]}_${tokenParts[3]}_${tokenParts[4]}` : null
      if (!userId) {
        throw new Error("Invalid mock access token")
      }

      const saved = clientStorage.saveProfile(userId, data)
      if (!saved) {
        throw new Error("Failed to save profile data")
      }

      console.log("✅ Mock profile updated and saved to localStorage")
      return { message: "Profile updated successfully", data: data }
    }

    try {
      console.log("📝 Update profile API call")

      const response = await fetch(`${this.baseURL}/api/profiles`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      })

      const result = await response.json()
      console.log("📦 Update profile response:", result)

      if (!response.ok) {
        throw new Error(result.message || "Failed to update profile")
      }

      return result
    } catch (error) {
      console.error("💥 Update profile error:", error)
      throw error
    }
  }

  async testConnection() {
    if (this.useMockApi) {
      console.log("🎭 Mock API: Connection test always succeeds")
      return true
    }

    try {
      const response = await fetch(`${this.baseURL}/api/health`)
      return response.ok
    } catch (error) {
      return false
    }
  }
}

export const apiService = new ApiService()
