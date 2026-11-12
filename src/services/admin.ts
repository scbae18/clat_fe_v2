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
  AdminNoticeRecipients,
  AdminNoticeList,
  AdminNoticeDetail,
  AdminNoticeSendResult,
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

  async resetUserPassword(id: number, password: string) {
    const { data } = await axiosInstance.patch<
      Envelope<{ id: number; email: string; name: string }>
    >(`/admin/users/${id}/password`, { password })
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

  async listNoticeRecipients() {
    const { data } = await axiosInstance.get<Envelope<AdminNoticeRecipients>>(
      '/admin/notices/recipients',
    )
    return unwrap(data)
  },

  async listNotices(page = 1, limit = 20) {
    const { data } = await axiosInstance.get<Envelope<AdminNoticeList>>('/admin/notices', {
      params: { page, limit },
    })
    return unwrap(data)
  },

  async getNotice(id: number) {
    const { data } = await axiosInstance.get<Envelope<AdminNoticeDetail>>(`/admin/notices/${id}`, {
      timeout: ADMIN_TIMEOUT,
    })
    return unwrap(data)
  },

  async sendNotice(payload: { date: string; body: string; all?: boolean; teacher_ids?: number[] }) {
    const { data } = await axiosInstance.post<Envelope<AdminNoticeSendResult>>(
      '/admin/notices',
      payload,
      { timeout: ADMIN_TIMEOUT },
    )
    return unwrap(data)
  },

  async sendNoticeTest(payload: { date: string; body: string }) {
    const { data } = await axiosInstance.post<Envelope<AdminNoticeSendResult>>(
      '/admin/notices/test',
      payload,
      { timeout: ADMIN_TIMEOUT },
    )
    return unwrap(data)
  },

  async getBillingSettings() {
    const { data } = await axiosInstance.get<Envelope<AdminBillingSettings>>('/admin/billing/settings')
    return unwrap(data)
  },

  async setBillingEnforced(enforced: boolean) {
    const { data } = await axiosInstance.put<Envelope<AdminBillingSettings>>('/admin/billing/settings', {
      enforced,
    })
    return unwrap(data)
  },

  async billingPrecheck(q?: string) {
    const { data } = await axiosInstance.get<Envelope<AdminBillingPrecheck>>('/admin/billing/precheck', {
      params: { q: q || undefined },
      timeout: ADMIN_TIMEOUT,
    })
    return unwrap(data)
  },

  async listBillingGrants() {
    const { data } = await axiosInstance.get<Envelope<AdminBillingGrantList>>('/admin/billing/grants')
    return unwrap(data)
  },

  async createBillingGrants(payload: {
    user_ids: number[]
    plan_code: AdminGrantPlanCode
    months: number
    memo?: string
  }) {
    const { data } = await axiosInstance.post<Envelope<AdminBillingGrantCreateResult>>(
      '/admin/billing/grants',
      payload,
    )
    return unwrap(data)
  },

  async revokeBillingGrant(id: number) {
    const { data } = await axiosInstance.delete<Envelope<{ id: number; status: string }>>(
      `/admin/billing/grants/${id}`,
    )
    return unwrap(data)
  },

  async pullBillingPeriod(userId: number) {
    const { data } = await axiosInstance.post<Envelope<{ pulled: boolean }>>(
      `/admin/billing/users/${userId}/pull-period`,
    )
    return unwrap(data)
  },

  async runBillingRenewal(userId: number) {
    const { data } = await axiosInstance.post<Envelope<{ charged: number }>>(
      `/admin/billing/users/${userId}/run-renewal`,
    )
    return unwrap(data)
  },

  async setBillingEarly(userId: number, enforcedEarly: boolean) {
    const { data } = await axiosInstance.patch<
      Envelope<{ user_id: number; enforced_early: boolean }>
    >(`/admin/billing/users/${userId}`, { enforced_early: enforcedEarly })
    return unwrap(data)
  },

  async listBenefitCodes() {
    const { data } = await axiosInstance.get<Envelope<AdminBenefitCodeList>>('/admin/billing/benefit-codes')
    return unwrap(data)
  },

  async createBenefitCode(payload: { plan_code: AdminBenefitPlanCode; months: number }) {
    const { data } = await axiosInstance.post<Envelope<AdminBenefitCode>>(
      '/admin/billing/benefit-codes',
      payload,
    )
    return unwrap(data)
  },

  async applyBillingBenefit(userId: number, payload: { plan_code: AdminBenefitPlanCode; months: number }) {
    const { data } = await axiosInstance.post<Envelope<{ user_id: number; months: number; plan_code: string }>>(
      `/admin/billing/users/${userId}/benefit`,
      payload,
    )
    return unwrap(data)
  },

  async billingSales() {
    const { data } = await axiosInstance.get<Envelope<AdminBillingSales>>('/admin/billing/sales')
    return unwrap(data)
  },

  async billingRefunds() {
    const { data } = await axiosInstance.get<Envelope<AdminRefundList>>('/admin/billing/refunds')
    return unwrap(data)
  },

  async refundInvoice(
    invoiceId: number,
    payload: { amount: number; reason: string; after: 'KEEP' | 'FREE' | 'REVERT_PLAN' },
  ) {
    const { data } = await axiosInstance.post<Envelope<{ invoice_id: number; amount: number; after: string }>>(
      `/admin/billing/invoices/${invoiceId}/refund`,
      payload,
    )
    return unwrap(data)
  },
}

export type AdminGrantPlanCode = 'FREE' | 'BASIC' | 'STANDARD' | 'PLUS' | 'PRO'
export type AdminBenefitPlanCode = 'ANY' | 'BASIC' | 'STANDARD' | 'PLUS' | 'PRO'

export type AdminBillingSettings = {
  enforced: boolean
  enforced_at: string | null
}

export type AdminBillingGrant = {
  id: number
  status: string
  plan_code: string
  months: number
  starts_at: string | null
  ends_at: string | null
}

export type AdminBillingPrecheckRow = {
  user_id: number
  name: string
  email: string
  student_count: number
  last_month_messages: number
  this_month_messages: number
  this_month_reserved: number
  recommended_plan_code: string | null
  grant: AdminBillingGrant | null
  enforced_early: boolean
  subscription_status: string | null
  plan_code: string
  plan_name: string
  next_billing_at: string | null
  no_charge_until: string | null
  will_lock_count: number
}

export type AdminBillingPrecheck = {
  enforced: boolean
  enforced_at: string | null
  teachers: number
  will_lock_total: number
  rows: AdminBillingPrecheckRow[]
}

export type AdminBillingGrantList = {
  items: Array<
    AdminBillingGrant & {
      user_id: number
      name: string
      email: string
      memo: string | null
    }
  >
}

export type AdminBillingGrantCreateResult = {
  created: number[]
  replaced: number[]
  freed: number[]
  skipped: Array<{ user_id: number; reason: string }>
}

export type AdminBenefitCode = {
  id: number
  code: string
  plan_code: string
  plan_name: string
  months: number
  used_by_name?: string | null
  created_at?: string
}

export type AdminBenefitCodeList = { items: AdminBenefitCode[] }

export type AdminBillingSales = {
  month_total: number
  month_count: number
  all_total: number
  all_count: number
  items: Array<{
    at: string
    kind: 'PAYMENT' | 'CANCEL' | 'CANCEL_SCHEDULED'
    name: string
    email: string
    amount: number | null
    label: string
    invoice_id: number | null
  }>
}

export type AdminRefundList = {
  items: Array<{
    id: number
    invoice_id: number
    status: string
    source: string
    amount: number
    reason: string | null
    name: string
    email: string
    plan_name: string
    messages: unknown
    max_students: unknown
    created_at: string
  }>
}
