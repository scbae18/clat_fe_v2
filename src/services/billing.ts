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
      card: { company: string; last4: string } | null
      customer_key: string | null
      pending_benefit: { months: number; plan_code: string | null; plan_name: string | null } | null
      past_due_until: string | null
      billing: {
        anchor_day: number | null
        next_billing_at: string
        next_amount: number
        no_charge_until: string | null
        cancel_at_period_end: boolean
        pending_plan_code: string | null
      } | null
      banners: Array<{ type: string; lesson_ids?: number[]; past_due_until?: string; amount?: number }>
    }

export type BillingInvoice = {
  id: number
  kind: string
  plan_code: string
  plan_name: string
  plan_amount: number
  overage_count: number
  overage_amount: number
  carried_amount: number
  total_amount: number
  status: string
  paid_at: string | null
  receipt_url: string | null
}

export type PlanPreview =
  | {
      direction: 'UP'
      plan_code: string
      plan_name: string
      charge_amount: number
      remaining_days: number
      period_days: number
      new_monthly_price: number
      unlock_count: number
    }
  | {
      direction: 'DOWN'
      plan_code: string
      plan_name: string
      effective_at: string
      new_monthly_price: number
      locked_students: Array<{ id: number; name: string }>
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

  async registerCard(authKey: string, customerKey: string) {
    const { data } = await axiosInstance.post<Envelope<{ card: { company: string; last4: string } }>>(
      '/billing/card',
      { auth_key: authKey, customer_key: customerKey },
    )
    return data.data
  },

  async retryPastDue() {
    const { data } = await axiosInstance.post<Envelope<BillingMe>>('/billing/retry')
    return data.data
  },

  async subscribe(planCode: string) {
    const { data } = await axiosInstance.post<Envelope<BillingMe>>('/billing/subscribe', {
      plan_code: planCode,
      agreed: true,
    })
    return data.data
  },

  async redeemBenefit(code: string, planCode?: string) {
    const { data } = await axiosInstance.post<Envelope<BillingMe>>('/billing/benefits', {
      code,
      plan_code: planCode,
    })
    return data.data
  },

  async clearBenefit() {
    const { data } = await axiosInstance.delete<Envelope<{ cleared: boolean }>>('/billing/benefits')
    return data.data
  },

  async invoices() {
    const { data } = await axiosInstance.get<Envelope<{ invoices: BillingInvoice[] }>>('/billing/invoices')
    return data.data.invoices
  },

  async previewPlanChange(planCode: string) {
    const { data } = await axiosInstance.post<Envelope<PlanPreview>>('/billing/plan-change/preview', {
      plan_code: planCode,
    })
    return data.data
  },

  async changePlan(planCode: string) {
    const { data } = await axiosInstance.post<Envelope<BillingMe>>('/billing/plan-change', {
      plan_code: planCode,
      agreed: true,
    })
    return data.data
  },

  async cancelPlanChange() {
    const { data } = await axiosInstance.delete<Envelope<BillingMe>>('/billing/plan-change')
    return data.data
  },

  async scheduleCancel() {
    const { data } = await axiosInstance.post<Envelope<BillingMe>>('/billing/cancel')
    return data.data
  },

  async undoCancel() {
    const { data } = await axiosInstance.delete<Envelope<BillingMe>>('/billing/cancel')
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
