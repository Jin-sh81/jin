import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 지원하는 언어 목록
const locales = ['ko', 'en']

// 기본 언어
const defaultLocale = 'ko'

export function middleware(request: NextRequest) {
  // URL에서 경로 추출
  const pathname = request.nextUrl.pathname

  // 경로가 이미 로케일을 포함하고 있는지 확인
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // 기본 언어로 리다이렉트
  if (pathnameIsMissingLocale) {
    const locale = defaultLocale

    // 예: incoming request is /products
    // The new URL is /ko/products
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    )
  }
}

export const config = {
  matcher: [
    // 모든 경로에서 로케일 확인
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 