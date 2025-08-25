/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: "loose",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  // Exclude backend files from compilation
  webpack: (config, { isServer }) => {
    // Ignore backend files during build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/node_modules/**',
        '**/backend/**',
        '**/.git/**',
        '**/.next/**',
      ],
    }
    
    return config
  },
}

export default nextConfig
