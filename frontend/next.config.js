/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  // Environment variables are automatically exposed when prefixed with NEXT_PUBLIC_
  // No need to manually configure them here
}

module.exports = nextConfig
