/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/p/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ]
  }
}

module.exports = nextConfig
