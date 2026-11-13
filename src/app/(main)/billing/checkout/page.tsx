'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { loadTossPayments } from '@tosspayments/tosspayments-sdk'
import Button from '@/components/common/Button'
import Text from '@/components/common/Text'
import { apiErrorMessage } from '@/lib/api/http'
import { isEnforcedBilling, moneyLabel } from '@/lib/billingView'
import { billingService } from '@/services/billing'
import { useUserStore } from '@/stores/userStore'
import useToast from '@/hooks/useToast'
import * as styles from '../billing.css'

const PLAN_KEY = 'clat.billing.plan'

function CheckoutForm() {
  const params = useSearchParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const user = useUserStore((s) => s.user)
  const { error } = useToast()
  const [agreed, setAgreed] = useState(false)
  const [busy, setBusy] = useState(false)
  const planCode = params.get('plan') ?? ''
  const meQuery = useQuery({
    queryKey: ['billing', 'me'],
    queryFn: () => billingService.me(),
    refetchOnWindowFocus: false,
  })
  const plansQuery = useQuery({
    queryKey: ['billing', 'plans'],
    queryFn: () => billingService.plans(),
    enabled: isEnforcedBilling(meQuery.data),
    refetchOnWindowFocus: false,
    retry: false,
  })

  if (meQuery.isLoading || plansQuery.isLoading) {
    return <p className={styles.pageDesc}>결제 내용을 불러오는 중…</p>
  }
  const me = meQuery.data
  const plan = plansQuery.data?.plans.find((row) => row.code === planCode)
  if (!isEnforcedBilling(me) || !plan || plan.monthly_price <= 0) {
    return <p className={styles.pageDesc}>결제할 요금제가 없어요.</p>
  }
  if (me.status === 'GRANT') {
    return <p className={styles.pageDesc}>무료 적용 중에는 요금제를 바꿀 수 없어요.</p>
  }
  if (me.status !== 'FREE') {
    return <p className={styles.pageDesc}>이미 유료 요금제를 쓰고 있어요.</p>
  }

  const pay = async () => {
    if (!agreed) {
      error('결제 내용에 동의해 주세요.')
      return
    }
    if (!me.customer_key) {
      error('결제 정보를 만들지 못했어요. 화면을 다시 열어 주세요.')
      return
    }
    setBusy(true)
    try {
      sessionStorage.setItem(PLAN_KEY, plan.code)
      if (!me.card) {
        const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY
        if (!clientKey) {
          error('결제 키가 없습니다.')
          return
        }
        const toss = await loadTossPayments(clientKey)
        const payment = toss.payment({ customerKey: me.customer_key })
        await payment.requestBillingAuth({
          method: 'CARD',
          successUrl: `${window.location.origin}/billing/card/success`,
          failUrl: `${window.location.origin}/billing/card/fail`,
          customerEmail: user?.email,
          customerName: user?.name,
        })
        return
      }
      await billingService.subscribe(plan.code)
      sessionStorage.removeItem(PLAN_KEY)
      await queryClient.invalidateQueries({ queryKey: ['billing'] })
      router.replace('/billing')
    } catch (err) {
      error(apiErrorMessage(err, '결제를 시작하지 못했어요.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <h1 className={styles.pageTitle}>{plan.name} 결제</h1>
      <p className={styles.pageDesc}>오늘 {moneyLabel(plan.monthly_price)}이 결제되고, 오늘이 매달 결제일이 됩니다.</p>
      <section className={styles.card}>
        <div>
          <h2 className={styles.sectionTitle}>오늘 결제</h2>
          <p className={styles.sectionDesc}>
            {plan.name} · 월 {moneyLabel(plan.monthly_price)} · 부가세 포함
          </p>
          <p className={styles.sectionDesc}>
            다음 결제부터는 같은 날 오전 10시에 {moneyLabel(plan.monthly_price)}이 결제됩니다.
          </p>
        </div>
        <div>
          <h2 className={styles.sectionTitle}>해지와 환불</h2>
          <p className={styles.sectionDesc}>
            해지하면 이번 결제 기간이 끝날 때까지 쓸 수 있고, 그다음 결제는 없습니다. 해지 버튼은 다음 단계에서 연결됩니다.
          </p>
          <p className={styles.sectionDesc}>
            결제일부터 7일 이내이고, 그 기간에 알림톡을 30통 이하로 보냈으면 전액을 돌려받을 수 있습니다. 그 외에는 남은 기간을 씁니다.
          </p>
        </div>
        <div>
          <h2 className={styles.sectionTitle}>사업자 정보</h2>
          <p className={styles.sectionDesc}>상호 클랫 · 전화 010-7324-7708 · 인스타그램 @clat.official</p>
          <p className={styles.sectionDesc}>주소, 사업자등록번호, 통신판매업 신고번호는 등록이 끝나면 이 화면에 표시됩니다.</p>
        </div>
        <label className={styles.sectionDesc}>
          <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} /> 위 내용을 확인했고 결제에 동의합니다.
        </label>
        <Button variant="primary" size="md" disabled={busy || !agreed} onClick={() => void pay()}>
          {me.card ? '결제하기' : '카드 등록하고 결제'}
        </Button>
      </section>
    </>
  )
}

export default function CheckoutPage() {
  return (
    <div className={styles.pageRoot}>
      <Suspense fallback={<p className={styles.pageDesc}>결제 내용을 불러오는 중…</p>}>
        <CheckoutForm />
      </Suspense>
    </div>
  )
}
