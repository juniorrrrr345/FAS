/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  // Augmenter les limites pour les requêtes API
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '10mb',
  },
  // Configuration expérimentale pour des requêtes plus grandes
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
    serverActions: {
      bodySizeLimit: '10mb'
    }
  }
}

module.exports = nextConfig