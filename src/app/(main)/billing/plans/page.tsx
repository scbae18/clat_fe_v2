'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import Button from '@/components/common/Button'
import Text from '@/components/common/Text'
import PlanCompare from '@/components/billing/PlanCompare'
import { apiErrorMessage } from '@/lib/api/http'
import { billingService } from '@/services/billing'
import * as styles from '../billing.css'

export default function BillingPlansPage() {
  const plansQuery = useQuery({
    queryKey: ['billing', 'plans'],
    queryFn: () => billingService.plans(),
    refetchOnWindowFocus: false,
    retry: false,
  })

  return (
    <div className={styles.pageRoot}>
      <h1 className={styles.pageTitle}>요금제 비교</h1>
      <p className={styles.pageDesc}>
        금액은 부가세 포함입니다. 초과 사용은 통당 20원, 한 달 최대 500통(1만 원)이고 자동으로 다음 달에 이어집니다.
      </p>
      <section className={styles.card}>
        {plansQuery.isLoading ? <Text variant="bodyMd" color="gray500">요금제를 불러오는 중…</Text> : null}
        {plansQuery.isError ? (
          <Text variant="bodyMd" color="gray500">
            {apiErrorMessage(plansQuery.error, '요금제를 불러오지 못했어요.')}
          </Text>
        ) : null}
        {plansQuery.data ? (
          <PlanCompare
            plans={plansQuery.data.plans}
            currentCode={plansQuery.data.current_plan_code}
            recommendedCode={plansQuery.data.recommended_plan_code}
          />
        ) : null}
      </section>
      <div className={styles.noticeActions}>
        <Link href="/billing">
          <Button variant="ghost" size="sm">
            요금제 화면으로
          </Button>
        </Link>
      </div>
    </div>
  )
}
