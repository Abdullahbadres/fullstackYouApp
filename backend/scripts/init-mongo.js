// MongoDB initialization script
const db = db.getSiblingDB("youapp")

// Create collections
db.createCollection("users")
db.createCollection("profiles")
db.createCollection("chats")
db.createCollection("messages")

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })
db.profiles.createIndex({ userId: 1 }, { unique: true })
db.profiles.createIndex({ interests: 1 })
db.profiles.createIndex({ zodiac: 1 })

print("✅ YouApp database initialized successfully!")
