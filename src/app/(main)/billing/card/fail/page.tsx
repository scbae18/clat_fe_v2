'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '@/components/common/Button'
import * as styles from '../../billing.css'

function CardFail() {
  const params = useSearchParams()
  const router = useRouter()
  const code = params.get('code')
  const raw = params.get('message')
  const message =
    code === 'INVALID_CARD_NUMBER'
      ? '신용카드 번호가 아니에요. 국내 신용카드 앞 6자리를 맞추고, 나머지는 아무 숫자로 넣어 주세요.'
      : code === 'NOT_SUPPORTED_CARD_TYPE'
        ? '이 테스트 상점에 그 카드사 계약이 없어요. 다른 카드를 넣어도 같은 문구가 납니다. 토스 개발자센터에서 자동결제 상점의 카드사를 확인해야 해요.'
        : raw || '카드 등록이 취소됐어요. 다른 카드로 다시 할 수 있어요.'
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
