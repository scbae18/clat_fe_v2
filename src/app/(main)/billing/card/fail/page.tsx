'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '@/components/common/Button'
import * as styles from '../../billing.css'

function CardFail() {
  const params = useSearchParams()
  const router = useRouter()
  const message = params.get('message') || '카드 등록이 취소됐어요. 다른 카드로 다시 할 수 있어요.'
  return (
    <>
      <h1 className={styles.pageTitle}>카드를 등록하지 못했어요</h1>
      <p className={styles.pageDesc}>{message}</p>
      <Button variant="primary" size="sm" onClick={() => router.push('/billing')}>
        요금제 화면으로
      </Button>
    </>
  )
}

export default function CardFailPage() {
  return (
    <div className={styles.pageRoot}>
      <Suspense fallback={<p className={styles.pageDesc}>요금제 화면으로 돌아가는 중…</p>}>
        <CardFail />
      </Suspense>
    </div>
  )
}
