import axiosInstance from '@/lib/api/axiosInstance'
import { isAxiosError } from '@/lib/api/http'
import type {
  AdminAlimtalkList,
  AdminAlimtalkStatus,
  AdminClassList,
  AdminCreatedUser,
  AdminDashboard,
  AdminHealth,
  AdminLessonList,
  AdminSession,
  AdminUserDetail,
  AdminUserList,
} from '@/types/admin'
import type { UpdateNotice, UpdateNoticeItem } from '@/lib/whatsNew'

type Envelope<T> = { success: boolean; data: T }

const ADMIN_TIMEOUT = 30_000

function unwrap<T>(payload: Envelope<T>): T {
  return payload.data
}

export function adminErrorMessage(err: unknown, fallback = '요청에 실패했습니다.'): string {
  if (isAxiosError(err)) {
    const data = err.response?.data as { error?: { message?: string } } | undefined
    return data?.error?.message ?? fallback
  }
  return fallback
}

export const admin = {
  async getSession() {
    const { data } = await axiosInstance.get<Envelope<AdminSession>>('/admin/session')
    return unwrap(data)
  },

  async getDashboard() {
    const { data } = await axiosInstance.get<Envelope<AdminDashboard>>('/admin/dashboard', {
      timeout: ADMIN_TIMEOUT,
    })
    return unwrap(data)
  },

  async listUsers(page = 1, limit = 50) {
    const { data } = await axiosInstance.get<Envelope<AdminUserList>>('/admin/users', {
      params: { page, limit },
    })
    return unwrap(data)
  },

  async getUser(id: number) {
    const { data } = await axiosInstance.get<Envelope<AdminUserDetail>>(`/admin/users/${id}`)
    return unwrap(data)
  },

  async createUser(payload: { email: string; password: string; name: string }) {
    const { data } = await axiosInstance.post<Envelope<AdminCreatedUser>>('/admin/users', payload)
    return unwrap(data)
  },

  async deleteUser(id: number, confirmEmail: string) {
    const { data } = await axiosInstance.delete<Envelope<{ deleted: boolean; id: number }>>(
      `/admin/users/${id}`,
      { data: { confirm_email: confirmEmail } },
    )
    return unwrap(data)
  },

  async listClasses(page = 1, limit = 50) {
    const { data } = await axiosInstance.get<Envelope<AdminClassList>>('/admin/classes', {
      params: { page, limit },
    })
    return unwrap(data)
  },

  async listLessons(page = 1, limit = 30) {
    const { data } = await axiosInstance.get<Envelope<AdminLessonList>>('/admin/lessons', {
      params: { page, limit },
    })
    return unwrap(data)
  },

  async listAlimtalk(status: AdminAlimtalkStatus = 'all', page = 1, limit = 50) {
    const { data } = await axiosInstance.get<Envelope<AdminAlimtalkList>>('/admin/alimtalk/messages', {
      params: { status, page, limit },
      timeout: ADMIN_TIMEOUT,
    })
    return unwrap(data)
  },

  async getHealth() {
    const { data } = await axiosInstance.get<Envelope<AdminHealth>>('/admin/health', {
      timeout: ADMIN_TIMEOUT,
    })
    return unwrap(data)
  },

  async listUpdateNotices() {
    const { data } = await axiosInstance.get<Envelope<UpdateNotice[]>>('/admin/update-notices')
    return unwrap(data)
  },

  async publishUpdateNotice(payload: {
    title: string
    subtitle: string
    items: UpdateNoticeItem[]
  }) {
    const { data } = await axiosInstance.post<Envelope<UpdateNotice>>('/admin/update-notices', payload)
    return unwrap(data)
  },

  async deactivateUpdateNotice() {
    const { data } = await axiosInstance.post<Envelope<{ deactivated: boolean }>>(
      '/admin/update-notices/deactivate',
    )
    return unwrap(data)
  },
}
