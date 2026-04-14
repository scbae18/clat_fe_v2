import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 인증 없이 접근 가능한 퍼블릭 경로
const PUBLIC_PATHS = ['/login', '/signup', '/find-password']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path))

  // proxy에서는 localStorage 접근 불가 -> 쿠키 기반 토큰 확인
  const token = request.cookies.get('accessToken')?.value

  if (!isPublicPath && !token) {
    // 인증 필요한 페이지인데 토큰 없음 -> 로그인으로 리다이렉트
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname) // 로그인 후 원래 페이지로 돌아오기 위해
    return NextResponse.redirect(loginUrl)
  }

  if (isPublicPath && token) {
    // 이미 로그인된 상태에서 퍼블릭 페이지 접근 -> 홈으로 리다이렉트
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // 정적 파일(_next, favicon, .well-known, 확장자 있는 파일)은 제외
  matcher: ['/((?!_next/static|_next/image|favicon.ico|\\.well-known|.*\\.[^/]*$).*)'],
}
