import axiosInstance from '@/lib/api/axiosInstance'
import { setCookie, deleteCookie, getCookie } from 'cookies-next'
import { useUserStore } from '@/stores/userStore'

interface LoginRequest {
  email: string
  password: string
}

interface SignupRequest {
  email: string
  password: string
  name: string
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

interface UserDto {
  id: number
  email: string
  name: string
  created_at: string
}

interface MeResponse {
  success: boolean
  data: UserDto
}

interface UpdateMeRequest {
  name?: string
  email?: string
  current_password?: string
}

interface UpdateMeResponse {
  success: boolean
  data: UserDto
}

interface ChangePasswordRequest {
  current_password: string
  new_password: string
}

interface WithdrawRequest {
  password: string
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

  async signup({ email, password, name }: SignupRequest) {
    const { data } = await axiosInstance.post<LoginResponse>('/auth/signup', {
      email,
      password,
      name,
    })
    setTokens(data.data.access_token, data.data.refresh_token)
    useUserStore.getState().setUser(data.data.user)
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

  async updateMe(payload: UpdateMeRequest) {
    const { data } = await axiosInstance.patch<UpdateMeResponse>('/auth/me', payload)
    useUserStore.getState().setUser(data.data)
    return data.data
  },

  async changePassword(payload: ChangePasswordRequest) {
    await axiosInstance.patch('/auth/password', payload)
  },

  async withdraw(payload: WithdrawRequest) {
    await axiosInstance.delete('/auth/withdraw', { data: payload })
    clearTokens()
    useUserStore.getState().setUser(null)
  },
}

export { setTokens, clearTokens }
