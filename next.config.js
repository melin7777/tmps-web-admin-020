/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'tm-web.effisoftsolutions.com',
        port: '',
        pathname: '/**',
      },
    ],
    experimental: {
      scrollRestoration: true,
    },
  },
}

module.exports = nextConfig
