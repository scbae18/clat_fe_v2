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

export type BillingMe =
  | { enforced: false }
  | {
      enforced: true
      status: 'FREE' | 'GRANT' | 'ACTIVE' | 'PAST_DUE'
      plan: {
        code: string
        name: string
        student_limit: number | null
        included_messages: number
        monthly_price: number
      }
      students: { count: number; limit: number | null }
      messages: {
        used: number
        reserved: number
        included: number | null
        remaining: number | null
        overage_enabled: boolean
        overage_used: number
        overage_cap: number
        overage_available: boolean
        resets_at: string
      }
      grant: { plan_name: string; months: number; ends_at: string | null } | null
      banners: Array<{ type: string; lesson_ids?: number[] }>
    }

export type BillingPlans = {
  plans: Array<{
    code: string
    name: string
    student_limit: number | null
    included_messages: number
    monthly_price: number
    overage_unit_price: number
    overage_cap_messages: number
  }>
  current_plan_code: string
  recommended_plan_code: string
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

  async me() {
    const { data } = await axiosInstance.get<Envelope<BillingMe>>('/billing/me')
    return data.data
  },

  async plans() {
    const { data } = await axiosInstance.get<Envelope<BillingPlans>>('/billing/plans')
    return data.data
  },

  async setOverage(enabled: boolean, agreed?: boolean) {
    const { data } = await axiosInstance.put<Envelope<BillingMe>>('/billing/overage', {
      enabled,
      agreed,
    })
    return data.data
  },
}
