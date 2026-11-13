import { format, parseISO } from 'date-fns'
import type { BillingMe } from '@/services/billing'

export type EnforcedBilling = Extract<BillingMe, { enforced: true }>

export function isEnforcedBilling(me: BillingMe | undefined): me is EnforcedBilling {
  return me?.enforced === true
}

export function resetDayLabel(iso: string): string {
  const date = parseISO(iso)
  if (Number.isNaN(date.getTime())) return ''
  return format(date, 'M월 d일')
}

export function moneyLabel(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`
}

export type QuotaAction = 'none' | 'plans' | 'overage' | 'upgrade'

export function quotaNotice(me: EnforcedBilling, needed: number): {
  text: string
  warn: boolean
  blocked: boolean
  action: QuotaAction
} {
  const { messages, status, plan } = me
  const remaining = messages.remaining
  const included = messages.included
  const used = messages.used + messages.reserved
  const includedLeft = included == null ? null : Math.max(0, included - used)
  const room = remaining ?? Number.POSITIVE_INFINITY
  const day = resetDayLabel(messages.resets_at)
  const almost = included != null && included > 0 && used / included >= 0.8

  if (needed <= room) {
    const extra = includedLeft == null ? 0 : Math.max(0, needed - includedLeft)
    if (extra > 0 && messages.overage_enabled && status === 'GRANT') {
      return {
        text: `포함 통수를 넘는 ${extra}통은 무료 기간이라 요금이 없어요.`,
        warn: false,
        blocked: false,
        action: 'none',
      }
    }
    if (extra > 0 && messages.overage_enabled) {
      return {
        text: `포함 통수를 넘는 ${extra}통은 통당 20원, ${moneyLabel(extra * 20)}이 다음 결제일에 함께 결제돼요.`,
        warn: true,
        blocked: false,
        action: 'none',
      }
    }
    return {
      text: `이번 발송 ${needed}통 · 남은 알림톡 ${remaining ?? '제한 없음'}통${almost ? '. 이번 달 알림톡을 거의 다 썼어요' : ''}`,
      warn: almost,
      blocked: false,
      action: 'none',
    }
  }

  if (status === 'PAST_DUE') {
    return {
      text: '결제가 되지 않아 Free 한도(월 30통)로 보내고 있어요. 결제가 완료되면 바로 원래 요금제로 돌아와요.',
      warn: true,
      blocked: true,
      action: 'plans',
    }
  }
  if (status === 'GRANT' && !messages.overage_enabled) {
    return {
      text: `이번 달 포함된 통수를 다 썼어요. ${day}에 다시 채워져요. 무료 기간에는 초과 사용도 무료예요(한 달 500통까지).`,
      warn: true,
      blocked: true,
      action: 'overage',
    }
  }
  if (status === 'GRANT') {
    return {
      text: `이번 달 초과 사용 한도(500통)에 닿았어요. ${day}에 다시 채워져요.`,
      warn: true,
      blocked: true,
      action: 'none',
    }
  }
  if (!messages.overage_enabled) {
    return {
      text: `${plan.name} 요금제는 한 달에 ${included ?? 0}통까지 보낼 수 있어요. 남은 ${remaining ?? 0}통, 이번 발송 ${needed}통. ${day}에 다시 채워져요.`,
      warn: true,
      blocked: true,
      action: status === 'FREE' ? 'plans' : 'overage',
    }
  }
  return {
    text: `이번 달 초과 사용 한도(1만 원)에 닿았어요. ${day}에 다시 채워져요.`,
    warn: true,
    blocked: true,
    action: 'upgrade',
  }
}

export function bannerText(type: string): string {
  if (type === 'PAYMENT_FAILED') return '결제가 되지 않았어요. 알림톡은 월 30통까지예요.'
  if (type === 'CARD_REREGISTER') return '카드를 읽지 못했어요. 요금제 화면에서 카드를 다시 등록해 주세요.'
  if (type === 'PAST_DUE_EXPIRED') return '결제가 되지 않아 무료 요금제로 바뀌었어요.'
  if (type === 'BILLING_TOMORROW') return '내일 요금이 결제돼요.'
  if (type === 'SCHEDULE_QUOTA_BLOCKED') return '알림톡이 모자라 예약 발송을 보내지 못했어요.'
  if (type === 'QUOTA_80') return '이번 달 알림톡을 거의 다 썼어요.'
  if (type === 'QUOTA_REACHED') return '이번 달 알림톡을 다 썼어요.'
  if (type === 'STUDENT_LIMIT_NEAR') return '학생 자리가 곧 한도예요.'
  if (type === 'STUDENT_LIMIT_REACHED') return '학생을 더 등록할 수 없어요.'
  return ''
}
