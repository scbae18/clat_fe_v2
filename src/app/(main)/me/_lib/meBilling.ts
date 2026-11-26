import { format, parseISO } from 'date-fns'
import type { EnforcedBilling } from '@/lib/billingView'
import type { BillingInvoice } from '@/services/billing'
import { normalizeKoreanMobile } from '@/lib/phone'

export function displayPhone(phone: string | null | undefined): string {
  if (!phone) return ''
  return normalizeKoreanMobile(phone) ?? phone
}

export function wonLabel(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`
}

export function renewalLabel(me: EnforcedBilling): string | null {
  if (me.billing?.cancel_at_period_end) return '해지 예약'
  if (me.status === 'PAST_DUE') return '결제 대기'
  if (me.status === 'GRANT') return '무료 이용'
  if (me.billing?.no_charge_until && Date.parse(me.billing.no_charge_until) > Date.now()) return '청구 없음'
  if (me.status === 'ACTIVE') return '자동 갱신'
  return null
}

export function nextPayLine(me: EnforcedBilling): string {
  const billing = me.billing
  if (!billing) return ''
  const hold = Boolean(billing.no_charge_until && Date.parse(billing.no_charge_until) > Date.now())
  const iso = hold ? billing.no_charge_until : billing.next_billing_at
  if (!iso) return ''
  const date = parseISO(iso)
  if (Number.isNaN(date.getTime())) return ''
  const day = format(date, 'yyyy년 M월 d일')
  if (hold) return `${day}까지 청구 없음`
  return `다음 결제 ${day} · ${wonLabel(billing.next_amount)}`
}

export function messageUsage(me: EnforcedBilling): { left: string; ratio: string; percent: number } {
  const { used, included, remaining } = me.messages
  const left = remaining == null ? '제한 없음' : `${remaining.toLocaleString('ko-KR')}통 남음`
  const ratio = included == null ? '' : `${used.toLocaleString('ko-KR')}/${included.toLocaleString('ko-KR')}`
  const percent = included != null && included > 0 ? Math.min(100, (used / included) * 100) : 0
  return { left, ratio, percent }
}

export function invoiceTitle(row: BillingInvoice): string {
  if (row.kind === 'UPGRADE') return `${row.plan_name} 변경`
  if (row.kind === 'FINAL_OVERAGE') return `${row.plan_name} 초과 사용`
  if (row.kind === 'SUBSCRIPTION') return `${row.plan_name} 월 구독`
  return row.plan_name
}

export function invoiceStatusLabel(status: string): { label: string; failed: boolean } {
  if (status === 'FAILED') return { label: '결제 실패', failed: true }
  if (status === 'PAID') return { label: '결제 완료', failed: false }
  if (status === 'PENDING') return { label: '확인 중', failed: false }
  if (status === 'REFUNDED') return { label: '환불됨', failed: false }
  if (status === 'PARTIALLY_REFUNDED') return { label: '일부 환불', failed: false }
  if (status === 'VOID') return { label: '취소됨', failed: false }
  return { label: status, failed: false }
}

export function invoiceDateLabel(iso: string | null): string {
  if (!iso) return ''
  const date = parseISO(iso)
  if (Number.isNaN(date.getTime())) return ''
  return format(date, 'yyyy. M. d.')
}
