'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import useToast from '@/hooks/useToast'
import {
  billingProgressMessage,
  completeBillingCard,
  isCardCancel,
  readCardIntent,
  takeBillingReturn,
  BILLING_INTENT_KEY,
  BILLING_PLAN_KEY,
} from '@/lib/billingCard'
import { billingProgress } from '@/lib/billingProgress'

const handled = new Set<string>()

function claim(key: string) {
  if (handled.has(key)) return false
  handled.add(key)
  return true
}

function withoutBillingQuery(search: string) {
  const params = new URLSearchParams(search)
  for (const key of ['billingCard', 'authKey', 'customerKey', 'code', 'message', 'orderId']) {
    params.delete(key)
  }
  const next = params.toString()
  return next ? `${window.location.pathname}?${next}` : window.location.pathname
}

export default function BillingCardReturnHost() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const flag = params.get('billingCard')
    if (flag !== '1' && flag !== 'fail') return

    if (flag === 'fail') {
      const code = params.get('code') ?? ''
      const message = params.get('message') || '카드 등록이 취소됐어요.'
      if (!claim(`fail:${code}:${message}`)) return
      if (!isCardCancel({ code })) error(message)
      router.replace(withoutBillingQuery(window.location.search))
      return
    }

    const authKey = params.get('authKey')
    const customerKey = params.get('customerKey')
    if (!authKey || !customerKey) {
      if (!claim('missing')) return
      error('카드 등록 정보가 없어요.')
      router.replace(withoutBillingQuery(window.location.search))
      return
    }
    if (!claim(authKey)) return

    const intent = readCardIntent(sessionStorage.getItem(BILLING_INTENT_KEY), sessionStorage.getItem(BILLING_PLAN_KEY))
    billingProgress.show(billingProgressMessage(intent))
    void completeBillingCard(authKey, customerKey)
      .then(async (result) => {
        billingProgress.clear()
        if (!result.ok) {
          error(result.message)
          router.replace(withoutBillingQuery(window.location.search))
          return
        }
        await queryClient.invalidateQueries({ queryKey: ['billing'] })
        success(result.message)
        const back = takeBillingReturn(window.location.pathname === '/me' ? '/me' : '/billing')
        router.replace(back === window.location.pathname ? withoutBillingQuery(window.location.search) : back)
      })
      .catch(() => {
        billingProgress.clear()
        router.replace(withoutBillingQuery(window.location.search))
      })
  }, [error, queryClient, router, success])

  return null
}
