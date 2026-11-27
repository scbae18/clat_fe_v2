'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import Button from '@/components/common/Button'
import { apiErrorMessage } from '@/lib/api/http'
import {
  BILLING_CARD_SOURCE,
  BILLING_INTENT_KEY,
  BILLING_PLAN_KEY,
  BILLING_POPUP_KEY,
  readCardIntent,
  takeBillingReturn,
  type CardIntent,
} from '@/lib/billingCard'
import { billingService } from '@/services/billing'
import useToast from '@/hooks/useToast'
import * as styles from '../../billing.css'

const PLAN_KEY = BILLING_PLAN_KEY
const INTENT_KEY = BILLING_INTENT_KEY

type CardFinish =
  | { ok: true; intent: CardIntent; cardLabel: string | null }
  | { ok: false; message: string }

const finishes = new Map<string, Promise<CardFinish>>()

function openingMessage(intent: CardIntent): string {
  if (intent === 'past_due') return '카드를 바꾸고 밀린 결제를 하는 중…'
  if (intent === 'subscribe') return '카드를 등록하고 결제하는 중…'
  if (intent === 'add') return '카드를 등록하는 중…'
  return '카드를 바꾸는 중…'
}

function finishCard(authKey: string, customerKey: string): Promise<CardFinish> {
  const existing = finishes.get(authKey)
  if (existing) return existing
  const planCode = sessionStorage.getItem(PLAN_KEY)
  const intent = readCardIntent(sessionStorage.getItem(INTENT_KEY), planCode)
  const job = (async (): Promise<CardFinish> => {
    try {
      const registered = await billingService.registerCard(authKey, customerKey, intent === 'add' ? 'add' : 'replace')
      if (intent === 'subscribe') {
        if (!planCode) return { ok: false, message: '결제할 요금제를 찾지 못했어요. 요금제 화면에서 다시 결제해 주세요.' }
        await billingService.subscribe(planCode)
      }
      sessionStorage.removeItem(PLAN_KEY)
      sessionStorage.removeItem(INTENT_KEY)
      return {
        ok: true,
        intent,
        cardLabel:
          intent === 'change' || intent === 'add' ? `${registered.card.company} ${registered.card.last4}` : null,
      }
    } catch (err) {
      return { ok: false, message: apiErrorMessage(err, '결제를 마치지 못했어요. 카드는 등록됐을 수 있어요.') }
    }
  })()
  finishes.set(authKey, job)
  return job
}

function CardSuccess() {
  const params = useSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { success } = useToast()
  const [message, setMessage] = useState('카드를 확인하는 중…')
  const [failed, setFailed] = useState(false)
  const authKey = params.get('authKey')
  const customerKey = params.get('customerKey')

  useEffect(() => {
    if (!authKey || !customerKey) {
      setFailed(true)
      setMessage('카드 등록 정보가 없어요.')
      return
    }
    if (window.opener) {
      const intent = readCardIntent(sessionStorage.getItem(INTENT_KEY), sessionStorage.getItem(PLAN_KEY))
      const plan = sessionStorage.getItem(PLAN_KEY) ?? ''
      window.opener.postMessage(
        { source: BILLING_CARD_SOURCE, ok: true, authKey, customerKey, intent, plan },
        window.location.origin,
      )
      sessionStorage.removeItem(BILLING_POPUP_KEY)
      sessionStorage.removeItem(INTENT_KEY)
      sessionStorage.removeItem(PLAN_KEY)
      window.close()
      return
    }
    if (!finishes.has(authKey)) {
      const planCode = sessionStorage.getItem(PLAN_KEY)
      const intent = readCardIntent(sessionStorage.getItem(INTENT_KEY), planCode)
      setMessage(openingMessage(intent))
    }
    let cancelled = false
    void finishCard(authKey, customerKey).then(async (result) => {
      if (cancelled) return
      if (!result.ok) {
        setFailed(true)
        setMessage(result.message)
        return
      }
      await queryClient.invalidateQueries({ queryKey: ['billing'] })
      if (cancelled) return
      if (result.intent === 'past_due') success('결제됐어요. 오늘이 새 결제일이에요.')
      if (result.intent === 'change' && result.cardLabel) {
        success(`${result.cardLabel}로 바꿨어요. 결제는 되지 않았어요.`)
      }
      if (result.intent === 'add' && result.cardLabel) {
        success(`${result.cardLabel} 카드를 등록했어요.`)
      }
      router.replace(takeBillingReturn())
    })
    return () => {
      cancelled = true
    }
  }, [authKey, customerKey, queryClient, router, success])

  return (
    <>
      <h1 className={styles.pageTitle}>결제</h1>
      <p className={styles.pageDesc}>{message}</p>
      {failed ? (
        <Button variant="secondary" size="sm" onClick={() => router.push(takeBillingReturn())}>
          돌아가기
        </Button>
      ) : null}
    </>
  )
}

export default function CardSuccessPage() {
  return (
    <div className={styles.pageRoot}>
      <Suspense fallback={<p className={styles.pageDesc}>카드를 확인하는 중…</p>}>
        <CardSuccess />
      </Suspense>
    </div>
  )
}
