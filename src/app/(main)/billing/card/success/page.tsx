'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import Button from '@/components/common/Button'
import { apiErrorMessage } from '@/lib/api/http'
import { billingService } from '@/services/billing'
import * as styles from '../../billing.css'

const PLAN_KEY = 'clat.billing.plan'

function CardSuccess() {
  const params = useSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [message, setMessage] = useState('카드를 등록하고 결제하는 중…')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const authKey = params.get('authKey')
    const customerKey = params.get('customerKey')
    const planCode = sessionStorage.getItem(PLAN_KEY)
    if (!authKey || !customerKey) {
      setFailed(true)
      setMessage('카드 등록 정보가 없어요.')
      return
    }
    let cancelled = false
    void (async () => {
      try {
        await billingService.registerCard(authKey, customerKey)
        if (planCode) await billingService.subscribe(planCode)
        sessionStorage.removeItem(PLAN_KEY)
        await queryClient.invalidateQueries({ queryKey: ['billing'] })
        if (!cancelled) router.replace('/billing')
      } catch (err) {
        if (cancelled) return
        setFailed(true)
        setMessage(apiErrorMessage(err, '결제를 마치지 못했어요. 카드는 등록됐을 수 있어요.'))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [params, queryClient, router])

  return (
    <>
      <h1 className={styles.pageTitle}>결제</h1>
      <p className={styles.pageDesc}>{message}</p>
      {failed ? (
        <Button variant="secondary" size="sm" onClick={() => router.push('/billing')}>
          요금제 화면으로
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
