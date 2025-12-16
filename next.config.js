/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'spacelaunchnow-prod-east.nyc3.digitaloceanspaces.com',
      'img.youtube.com',
      'i.ytimg.com'
    ],
  },
}

module.exports = nextConfig
