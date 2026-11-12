import axiosInstance from '@/lib/api/axiosInstance'

type Envelope<T> = { success: boolean; data: T }

export type GrantNotice = {
  id: number
  plan_name: string
  months: number
  student_limit: number | null
  included_messages: number
  ends_at: string | null
}

export const billingService = {
  async grantNotice() {
    const { data } = await axiosInstance.get<Envelope<{ notice: GrantNotice | null }>>(
      '/billing/grant-notice',
    )
    return data.data.notice
  },

  async markGrantNoticeSeen() {
    const { data } = await axiosInstance.post<Envelope<{ seen: boolean }>>('/billing/grant-notice/seen')
    return data.data
  },
}
