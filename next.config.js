/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en'],
  },
  images: {
    domains: ['images.unsplash.com'],
  },
}

module.exports = nextConfig 