import { loadTossPayments } from '@tosspayments/tosspayments-sdk'
import { billingService } from '@/services/billing'
import { apiErrorMessage } from '@/lib/api/http'
import { billingProgress } from '@/lib/billingProgress'

export const BILLING_PLAN_KEY = 'clat.billing.plan'
export const BILLING_PLAN_NAME_KEY = 'clat.billing.planName'
export const BILLING_INTENT_KEY = 'clat.billing.cardIntent'
export const BILLING_POPUP_KEY = 'clat.billing.popup'
export const BILLING_CARD_SOURCE = 'clat-billing-card'

export type CardIntent = 'subscribe' | 'past_due' | 'change' | 'add'
export type BillingReturnPath = '/me' | '/billing'

type CardFinish = { ok: true; message: string } | { ok: false; message: string }

const finishes = new Map<string, Promise<CardFinish>>()

export function rememberBillingReturn(path: BillingReturnPath) {
  sessionStorage.setItem('clat.billing.returnTo', path)
}

export function billingReturnPath(fallback: BillingReturnPath = '/billing'): BillingReturnPath {
  const value = sessionStorage.getItem('clat.billing.returnTo')
  if (value === '/me' || value === '/billing') return value
  return fallback
}

export function takeBillingReturn(fallback: BillingReturnPath = '/billing'): BillingReturnPath {
  const path = billingReturnPath(fallback)
  sessionStorage.removeItem('clat.billing.returnTo')
  return path
}

export function readCardIntent(stored: string | null, planCode: string | null): CardIntent {
  if (stored === 'past_due' || stored === 'change' || stored === 'add' || stored === 'subscribe') return stored
  return planCode ? 'subscribe' : 'change'
}

export function isCardCancel(err: unknown): boolean {
  if (!err || typeof err !== 'object' || !('code' in err)) return false
  const code = String((err as { code: unknown }).code)
  return code === 'USER_CANCEL' || code === 'PAY_PROCESS_CANCELED'
}

export function billingProgressMessage(intent: CardIntent): string {
  if (intent === 'past_due') return '카드를 바꾸고 밀린 결제를 하는 중…'
  if (intent === 'subscribe') return '카드를 등록하고 결제하는 중…'
  if (intent === 'add') return '카드를 등록하는 중…'
  return '카드를 바꾸는 중…'
}

export async function withBillingProgress<T>(text: string, run: () => Promise<T>): Promise<T> {
  billingProgress.show(text)
  try {
    return await run()
  } finally {
    billingProgress.clear()
  }
}

export async function beginBillingCard(input: {
  customerKey: string
  intent: CardIntent
  planCode?: string
  planName?: string
  email?: string | null
  name?: string | null
}): Promise<void> {
  const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY
  if (!clientKey) throw new Error('결제 키가 없습니다.')
  sessionStorage.setItem(BILLING_INTENT_KEY, input.intent)
  if (input.planCode) sessionStorage.setItem(BILLING_PLAN_KEY, input.planCode)
  else sessionStorage.removeItem(BILLING_PLAN_KEY)
  if (input.planName) sessionStorage.setItem(BILLING_PLAN_NAME_KEY, input.planName)
  else sessionStorage.removeItem(BILLING_PLAN_NAME_KEY)
  rememberBillingReturn(window.location.pathname === '/me' ? '/me' : '/billing')
  const toss = await loadTossPayments(clientKey)
  const here = new URL(window.location.pathname, window.location.origin)
  const fail = new URL(window.location.pathname, window.location.origin)
  here.search = window.location.search
  fail.search = window.location.search
  here.searchParams.set('billingCard', '1')
  fail.searchParams.set('billingCard', 'fail')
  const iframeOk = window.matchMedia('(min-width: 768px)').matches
  await toss.payment({ customerKey: input.customerKey }).requestBillingAuth({
    method: 'CARD',
    successUrl: here.toString(),
    failUrl: fail.toString(),
    customerEmail: input.email || undefined,
    customerName: input.name || undefined,
    windowTarget: iframeOk ? 'iframe' : 'self',
  })
}

export function completeBillingCard(authKey: string, customerKey: string): Promise<CardFinish> {
  const existing = finishes.get(authKey)
  if (existing) return existing
  const planCode = sessionStorage.getItem(BILLING_PLAN_KEY)
  const planName = sessionStorage.getItem(BILLING_PLAN_NAME_KEY)
  const intent = readCardIntent(sessionStorage.getItem(BILLING_INTENT_KEY), planCode)
  const job = (async (): Promise<CardFinish> => {
    try {
      const registered = await billingService.registerCard(
        authKey,
        customerKey,
        intent === 'add' ? 'add' : 'replace',
      )
      if (intent === 'subscribe') {
        if (!planCode) {
          return { ok: false, message: '결제할 요금제를 찾지 못했어요. 요금제 화면에서 다시 결제해 주세요.' }
        }
        const result = await billingService.subscribe(planCode)
        return {
          ok: true,
          message:
            result.enforced && result.billing?.no_charge_until
              ? '카드를 등록했어요. 혜택 기간이 끝난 뒤 결제돼요.'
              : `${planName ?? '요금제'} 요금제로 결제했어요.`,
        }
      }
      const label = `${registered.card.company} ${registered.card.last4}`
      if (intent === 'past_due') return { ok: true, message: '결제됐어요. 오늘이 새 결제일이에요.' }
      if (intent === 'add') return { ok: true, message: `${label} 카드를 등록했어요.` }
      return { ok: true, message: `${label}로 바꿨어요. 결제는 되지 않았어요.` }
    } catch (err) {
      return { ok: false, message: apiErrorMessage(err, '결제를 마치지 못했어요. 카드는 등록됐을 수 있어요.') }
    } finally {
      sessionStorage.removeItem(BILLING_PLAN_KEY)
      sessionStorage.removeItem(BILLING_PLAN_NAME_KEY)
      sessionStorage.removeItem(BILLING_INTENT_KEY)
    }
  })()
  finishes.set(authKey, job)
  return job
}
