import axiosInstance from '@/lib/api/axiosInstance'
import { setCookie, deleteCookie, getCookie } from 'cookies-next'
import { useUserStore } from '@/stores/userStore'

interface LoginRequest {
  email: string
  password: string
}

interface AuthTokens {
  access_token: string
  refresh_token: string
}

interface LoginResponse {
  success: boolean
  data: AuthTokens & {
    user: {
      id: number
      email: string
      name: string
      created_at: string
    }
  }
}

interface RefreshResponse {
  success: boolean
  data: AuthTokens
}

interface MeResponse {
  success: boolean
  data: {
    id: number
    email: string
    name: string
    created_at: string
  }
}

const setTokens = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken, { maxAge: 60 * 60 * 24 * 7, path: '/' })
  setCookie('refreshToken', refreshToken, { maxAge: 60 * 60 * 24 * 7, path: '/' })
  localStorage.setItem('accessToken', accessToken)
}

const clearTokens = () => {
  deleteCookie('accessToken', { path: '/' })
  deleteCookie('refreshToken', { path: '/' })
  localStorage.removeItem('accessToken')
}

export const auth = {
  async login({ email, password }: LoginRequest) {
    const { data } = await axiosInstance.post<LoginResponse>('/auth/login', { email, password })
    setTokens(data.data.access_token, data.data.refresh_token)
    useUserStore.getState().setUser(data.data.user) // 추가
    return data.data.user
  },

  async logout() {
    const refreshToken = getCookie('refreshToken')
    try {
      await axiosInstance.post('/auth/logout', { refresh_token: refreshToken })
    } finally {
      clearTokens()
      useUserStore.getState().setUser(null)
      window.location.href = '/login'
    }
  },

  async refresh() {
    const refreshToken = getCookie('refreshToken')
    const { data } = await axiosInstance.post<RefreshResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    })
    setTokens(data.data.access_token, data.data.refresh_token)
    return data.data.access_token
  },

  async me() {
    const { data } = await axiosInstance.get<MeResponse>('/auth/me')
    return data.data
  },
}

export { setTokens, clearTokens }
