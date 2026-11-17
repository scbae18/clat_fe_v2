import axiosInstance from '@/lib/api/axiosInstance'
import { setCookie, deleteCookie, getCookie } from 'cookies-next'
import type { User } from '@/types/user'

interface LoginRequest {
  email: string
  password: string
}

interface SignupRequest {
  email: string
  password: string
  name: string
  phone: string
}

interface AuthTokens {
  access_token: string
  refresh_token: string
}

interface LoginResponse {
  success: boolean
  data: AuthTokens & {
    user: User
  }
}

interface SignupResponse {
  success: boolean
  data: {
    user: User
  }
}

interface RefreshResponse {
  success: boolean
  data: AuthTokens
}

interface MeResponse {
  success: boolean
  data: User
}

interface UpdateMeRequest {
  name?: string
  email?: string
  phone?: string
  current_password?: string
}

interface UpdateMeResponse {
  success: boolean
  data: User
}

interface ChangePasswordRequest {
  current_password: string
  new_password: string
}

interface WithdrawRequest {
  password: string
}

interface ResetPasswordRequest {
  email: string
  code: string
  new_password: string
}

export type OauthProvider = 'kakao' | 'google'

interface OauthAuthenticated {
  status: 'authenticated' | 'linked'
  access_token: string
  refresh_token: string
  user: User
}

interface OauthChoose {
  status: 'choose'
  link_token: string
  name_hint: string | null
  email_hint: string | null
}

export type OauthCallbackResult = OauthAuthenticated | OauthChoose

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

/** HTTP + token helpers only — callers own Zustand user state. */
export const auth = {
  async login({ email, password }: LoginRequest) {
    const { data } = await axiosInstance.post<LoginResponse>('/auth/login', { email, password })
    setTokens(data.data.access_token, data.data.refresh_token)
    return data.data.user
  },

  async signup({ email, password, name, phone, phoneProof }: SignupRequest & { phoneProof: string }) {
    const { data } = await axiosInstance.post<SignupResponse>('/auth/signup', {
      email,
      password,
      name,
      phone,
      phone_proof: phoneProof,
    })
    return data.data.user
  },

  async logout() {
    const refreshToken = getCookie('refreshToken')
    try {
      await axiosInstance.post('/auth/logout', { refresh_token: refreshToken })
    } finally {
      clearTokens()
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
    return data.data
  },

  async changePassword(payload: ChangePasswordRequest) {
    await axiosInstance.patch('/auth/password', payload)
  },

  async resetPassword(payload: ResetPasswordRequest) {
    await axiosInstance.post('/auth/password-reset', payload)
  },

  async sendSignupCode(phone: string) {
    await axiosInstance.post('/auth/phone/codes', { purpose: 'signup', phone })
  },

  async confirmSignupCode(phone: string, code: string) {
    const { data } = await axiosInstance.post<{ success: boolean; data: { phone_proof: string } }>(
      '/auth/phone/proof',
      { phone, code },
    )
    return data.data.phone_proof
  },

  async sendAccountCode(purpose: 'reset' | 'link', email: string, linkToken?: string, phone?: string) {
    await axiosInstance.post('/auth/phone/codes', {
      purpose,
      email,
      phone,
      link_token: linkToken,
    })
  },

  async sendVerifyCode(phone: string) {
    await axiosInstance.post('/auth/phone/verify/codes', { phone })
  },

  async verifyPhone(phone: string, code: string) {
    const { data } = await axiosInstance.post<MeResponse>('/auth/phone/verify', { phone, code })
    return data.data
  },

  async dismissSocialPrompt() {
    const { data } = await axiosInstance.post<MeResponse>('/auth/social-prompt/dismiss', {})
    return data.data
  },

  async oauthUrl(provider: OauthProvider) {
    const { data } = await axiosInstance.post<{ success: boolean; data: { url: string } }>(
      `/auth/oauth/${provider}/url`,
    )
    return data.data.url
  },

  async oauthLinkUrl(provider: OauthProvider) {
    const { data } = await axiosInstance.post<{ success: boolean; data: { url: string } }>(
      `/auth/oauth/${provider}/link-url`,
    )
    return data.data.url
  },

  async oauthCallback(provider: OauthProvider, code: string, state: string): Promise<OauthCallbackResult> {
    const { data } = await axiosInstance.post<{ success: boolean; data: OauthCallbackResult }>(
      `/auth/oauth/${provider}/callback`,
      { code, state },
    )
    if (data.data.status !== 'choose') {
      setTokens(data.data.access_token, data.data.refresh_token)
    }
    return data.data
  },

  async oauthComplete(payload: {
    linkToken: string
    action: 'signup' | 'connect'
    name?: string
    email?: string
    password?: string
    code?: string
    phone?: string
    phoneProof?: string
  }) {
    const { data } = await axiosInstance.post<{ success: boolean; data: OauthAuthenticated }>(
      '/auth/oauth/complete',
      {
        link_token: payload.linkToken,
        action: payload.action,
        name: payload.name,
        email: payload.email,
        password: payload.password,
        code: payload.code,
        phone: payload.phone,
        phone_proof: payload.phoneProof,
      },
    )
    setTokens(data.data.access_token, data.data.refresh_token)
    return data.data.user
  },

  async withdraw(payload: WithdrawRequest) {
    await axiosInstance.delete('/auth/withdraw', { data: payload })
    clearTokens()
  },
}

export const authService = auth

export { setTokens, clearTokens }
