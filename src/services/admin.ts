import axiosInstance from '@/lib/api/axiosInstance'
import { isAxiosError } from '@/lib/api/http'
import type {
  AdminAlimtalkBatchDetail,
  AdminAlimtalkBatchList,
  AdminAlimtalkList,
  AdminAlimtalkStatus,
  AdminAlimtalkBatchType,
  AdminCreatedUser,
  AdminDashboard,
  AdminSession,
  AdminActionLogList,
  AdminUserDetail,
  AdminUserList,
  AdminUserTab,
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

  async listUsers(params?: {
    page?: number
    limit?: number
    tab?: AdminUserTab
    approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED'
    withdrawal?: boolean
    q?: string
  }) {
    const { data } = await axiosInstance.get<Envelope<AdminUserList>>('/admin/users', {
      params: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 50,
        tab: params?.tab,
        approval_status: params?.approvalStatus,
        withdrawal: params?.withdrawal ? '1' : undefined,
        q: params?.q || undefined,
      },
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

  async setUserApproval(id: number, status: 'APPROVED' | 'REJECTED' | 'SUSPENDED') {
    const { data } = await axiosInstance.patch<
      Envelope<{
        id: number
        email: string
        name: string
        approval_status: 'PENDING' | 'APPROVED' | 'REJECTED'
        approved_at: string | null
        suspended_at: string | null
      }>
    >(`/admin/users/${id}/approval`, { status })
    return unwrap(data)
  },

  async listActionLogs(page = 1, limit = 50) {
    const { data } = await axiosInstance.get<Envelope<AdminActionLogList>>('/admin/action-logs', {
      params: { page, limit },
    })
    return unwrap(data)
  },

  async listAlimtalk(
    status: AdminAlimtalkStatus = 'all',
    page = 1,
    limit = 50,
    type?: AdminAlimtalkBatchType,
  ) {
    const { data } = await axiosInstance.get<Envelope<AdminAlimtalkList>>('/admin/alimtalk/messages', {
      params: { status, page, limit, type },
      timeout: ADMIN_TIMEOUT,
    })
    return unwrap(data)
  },

  async listAlimtalkBatches(
    status: AdminAlimtalkStatus = 'all',
    page = 1,
    limit = 50,
    type?: AdminAlimtalkBatchType,
    teacherId?: number,
  ) {
    const { data } = await axiosInstance.get<Envelope<AdminAlimtalkBatchList>>(
      '/admin/alimtalk/batches',
      {
        params: { status, page, limit, type, teacher_id: teacherId },
        timeout: ADMIN_TIMEOUT,
      },
    )
    return unwrap(data)
  },

  async getAlimtalkBatch(id: number) {
    const { data } = await axiosInstance.get<Envelope<AdminAlimtalkBatchDetail>>(
      `/admin/alimtalk/batches/${id}`,
      { timeout: ADMIN_TIMEOUT },
    )
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

  async uploadUpdateNoticeImage(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await axiosInstance.post<Envelope<{ url: string }>>(
      '/admin/update-notices/images',
      formData,
      { timeout: ADMIN_TIMEOUT },
    )
    return unwrap(data)
  },

  async deactivateUpdateNotice() {
    const { data } = await axiosInstance.post<Envelope<{ deactivated: boolean }>>(
      '/admin/update-notices/deactivate',
    )
    return unwrap(data)
  },
}
