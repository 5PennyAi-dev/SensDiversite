/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/fp3ovm5jt/**',
      },
    ],
  },
}

module.exports = nextConfig
