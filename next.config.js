/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  // Vercel 배포를 위한 설정
  output: 'standalone',
  // 클라이언트 사이드 렌더링 설정
  reactStrictMode: true,
  // 빌드 최적화
  swcMinify: true,
}

module.exports = nextConfig 