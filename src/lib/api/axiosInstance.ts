import axios from 'axios'
import { clearSignedIn, markSignedIn } from '@/lib/api/session'

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터: 액세스 토큰 자동 부착
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      const headers = config.headers
      if (headers && typeof headers.delete === 'function') {
        headers.delete('Content-Type')
      } else {
        delete config.headers['Content-Type']
        delete config.headers['content-type']
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 응답 인터셉터: 401 시 silent refresh 후 재시도
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token!)
  })
  failedQueue = []
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const isAuthRequest =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/signup') ||
      originalRequest.url?.includes('/auth/password-reset') ||
      originalRequest.url?.includes('/auth/refresh')

    if (isAuthRequest) return Promise.reject(error)

    const errorCode = error.response?.data?.error?.code
    const url = String(originalRequest.url ?? '')
    const method = String(originalRequest.method ?? '').toLowerCase()
    const isCredentialFailure =
      errorCode === 'INVALID_PASSWORD' ||
      errorCode === 'INVALID_CREDENTIALS' ||
      errorCode === 'SOCIAL_LOGIN_FAILED' ||
      errorCode === 'PHONE_PROOF_INVALID' ||
      errorCode === 'PASSWORD_NOT_SET' ||
      url.includes('/auth/oauth/') ||
      url.includes('/auth/phone/') ||
      url.includes('/auth/password') ||
      url.includes('/auth/withdraw') ||
      (url.includes('/auth/me') && method === 'patch')

    if (isCredentialFailure) return Promise.reject(error)

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 refresh 중이면 대기열에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(() => axiosInstance(originalRequest))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axiosInstance.post('/auth/refresh', {})

        markSignedIn()
        const newAccessToken = data.data.access_token
        processQueue(null, newAccessToken)

        return axiosInstance(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        clearSignedIn()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance