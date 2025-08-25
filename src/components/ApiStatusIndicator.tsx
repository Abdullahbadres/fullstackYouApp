"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Server, AlertTriangle, RefreshCw } from "lucide-react"

export function ApiStatusIndicator() {
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline" | "mock" | "error">("checking")
  const [useMockApi, setUseMockApi] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  useEffect(() => {
    checkApiStatus()
    // Check API status every 30 seconds
    const interval = setInterval(checkApiStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkApiStatus = async () => {
    const mockEnabled = process.env.NEXT_PUBLIC_USE_MOCK_API === "true"
    setUseMockApi(mockEnabled)
    setLastChecked(new Date())

    console.log("🔍 API Status Check - Mock API enabled:", mockEnabled)

    if (mockEnabled) {
      console.log("🎭 Mock API is enabled - skipping backend health check")
      setApiStatus("mock")
      return
    }

    try {
      // Only check backend if mock API is disabled
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"
      console.log("🔍 Checking backend status at:", backendUrl)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(`${backendUrl}/api/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log("📊 Backend health check status:", response.status)

      if (response.ok) {
        const healthData = await response.json()
        console.log("✅ Backend health check successful:", healthData)
        setApiStatus("online")
      } else {
        console.log("⚠️ Backend returned non-OK status:", response.status)
        setApiStatus("offline")
      }
    } catch (error: any) {
      console.log("🔴 Backend connection failed:", error.message)
      if (error.name === "AbortError") {
        setApiStatus("offline")
      } else {
        setApiStatus("error")
      }
    }
  }

  const getStatusConfig = () => {
    switch (apiStatus) {
      case "online":
        return {
          icon: <Wifi size={12} />,
          text: "Backend Online",
          variant: "secondary" as const,
          color: "text-green-400 bg-green-500/10 border-green-500/20",
        }
      case "offline":
        return {
          icon: <WifiOff size={12} />,
          text: "Backend Offline",
          variant: "secondary" as const,
          color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
        }
      case "error":
        return {
          icon: <AlertTriangle size={12} />,
          text: "Backend Error",
          variant: "secondary" as const,
          color: "text-red-400 bg-red-500/10 border-red-500/20",
        }
      case "mock":
        return {
          icon: <Server size={12} />,
          text: "Mock API Active",
          variant: "secondary" as const,
          color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        }
      default:
        return {
          icon: <RefreshCw size={12} className="animate-spin" />,
          text: "Checking...",
          variant: "secondary" as const,
          color: "text-gray-400 bg-gray-500/10 border-gray-500/20",
        }
    }
  }

  const config = getStatusConfig()

  const handleClick = () => {
    setApiStatus("checking")
    checkApiStatus()
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge
        variant={config.variant}
        className={`${config.color} backdrop-blur-sm cursor-pointer hover:opacity-80 transition-opacity`}
        onClick={handleClick}
        title={`Click to refresh • Last checked: ${lastChecked?.toLocaleTimeString() || "Never"}`}
      >
        <div className="flex items-center gap-2">
          {config.icon}
          <span className="text-xs">{config.text}</span>
        </div>
      </Badge>

      {/* Additional info for mock mode */}
      {apiStatus === "mock" && (
        <div className="absolute top-full right-0 mt-2 p-3 bg-black/90 backdrop-blur-sm rounded-lg border border-blue-500/20 text-xs text-blue-300 w-64">
          <p className="font-medium mb-1">🎭 Mock API Mode</p>
          <p className="text-blue-400/80">
            Using client-side mock API for full functionality. All data is stored locally in your browser.
          </p>
          <p className="text-blue-400/60 mt-2 text-xs">To use real backend: Set NEXT_PUBLIC_USE_MOCK_API=false</p>
        </div>
      )}

      {/* Additional info for backend offline */}
      {(apiStatus === "offline" || apiStatus === "error") && !useMockApi && (
        <div className="absolute top-full right-0 mt-2 p-3 bg-black/90 backdrop-blur-sm rounded-lg border border-red-500/20 text-xs text-red-300 w-64">
          <p className="font-medium mb-1">🔴 Backend Unavailable</p>
          <p className="text-red-400/80">
            Cannot connect to backend server. To continue using the app, enable mock API mode.
          </p>
          <p className="text-red-400/60 mt-2 text-xs">Set NEXT_PUBLIC_USE_MOCK_API=true in .env.local</p>
        </div>
      )}
    </div>
  )
}
