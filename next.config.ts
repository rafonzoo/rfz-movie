import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    // serverComponentsHmrCache: false, // defaults to true
  },
  /* Uncomment for debug cache miss/hit */
  // logging: {
  //   fetches: {
  //     fullUrl: true,
  //   },
  // },
}

export default nextConfig
