import { deleteCookie, setCookie } from 'cookies-next'

const WEEK_SECONDS = 60 * 60 * 24 * 7

/** 토큰이 아닌 로그인 표시만 프론트에 둔다. 토큰은 API의 HttpOnly 쿠키에 있다. */
export function markSignedIn() {
  setCookie('signedIn', '1', { maxAge: WEEK_SECONDS, path: '/', sameSite: 'lax' })
  deleteCookie('accessToken', { path: '/' })
  deleteCookie('refreshToken', { path: '/' })
  if (typeof window !== 'undefined') localStorage.removeItem('accessToken')
}

export function clearSignedIn() {
  deleteCookie('signedIn', { path: '/' })
  deleteCookie('accessToken', { path: '/' })
  deleteCookie('refreshToken', { path: '/' })
  if (typeof window !== 'undefined') localStorage.removeItem('accessToken')
}
