'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Button from '@/components/common/Button'
import ConfirmModal from '@/components/common/ConfirmModal/ConfirmModal'
import Text from '@/components/common/Text'
import PlanCompare from '@/components/billing/PlanCompare'
import { apiErrorMessage } from '@/lib/api/http'
import { isEnforcedBilling, moneyLabel, resetDayLabel } from '@/lib/billingView'
import { billingService, type BillingInvoice } from '@/services/billing'
import useToast from '@/hooks/useToast'
import * as styles from './billing.css'

export default function BillingPage() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()
  const [confirmOn, setConfirmOn] = useState(false)
  const [busy, setBusy] = useState(false)
  const meQuery = useQuery({
    queryKey: ['billing', 'me'],
    queryFn: () => billingService.me(),
    refetchOnWindowFocus: false,
  })
  const invoicesQuery = useQuery({
    queryKey: ['billing', 'invoices'],
    queryFn: () => billingService.invoices(),
    enabled: isEnforcedBilling(meQuery.data),
    refetchOnWindowFocus: false,
  })
  const plansQuery = useQuery({
    queryKey: ['billing', 'plans'],
    queryFn: () => billingService.plans(),
    enabled: isEnforcedBilling(meQuery.data),
    refetchOnWindowFocus: false,
    retry: false,
  })

  if (meQuery.isLoading) {
    return (
      <div className={styles.pageRoot}>
        <h1 className={styles.pageTitle}>요금제</h1>
        <p className={styles.pageDesc}>요금제를 불러오는 중…</p>
      </div>
    )
  }
  if (meQuery.isError) {
    return (
      <div className={styles.pageRoot}>
        <h1 className={styles.pageTitle}>요금제</h1>
        <p className={styles.pageDesc}>{apiErrorMessage(meQuery.error, '요금제를 불러오지 못했어요.')}</p>
      </div>
    )
  }
  const me = meQuery.data
  if (!isEnforcedBilling(me)) {
    return (
      <div className={styles.pageRoot}>
        <h1 className={styles.pageTitle}>요금제</h1>
        <p className={styles.pageDesc}>아직 이 계정에는 요금제 한도가 적용되지 않았어요.</p>
      </div>
    )
  }

  const studentLimit = me.students.limit
  const studentWidth = studentLimit ? Math.min(100, (me.students.count / studentLimit) * 100) : 8
  const included = me.messages.included
  const messageWidth =
    included && included > 0 ? Math.min(100, ((me.messages.used + me.messages.reserved) / included) * 100) : 8

  const toggle = async (enabled: boolean) => {
    setBusy(true)
    try {
      await billingService.setOverage(enabled, enabled ? true : undefined)
      await queryClient.invalidateQueries({ queryKey: ['billing', 'me'] })
      success(enabled ? '초과 사용을 켰어요.' : '초과 사용을 껐어요.')
    } catch (err) {
      error(apiErrorMessage(err, '초과 사용을 바꾸지 못했어요.'))
    } finally {
      setBusy(false)
      setConfirmOn(false)
    }
  }

  return (
    <div className={styles.pageRoot}>
      <h1 className={styles.pageTitle}>요금제</h1>
      <p className={styles.pageDesc}>
        사용량과 다섯 요금제를 한눈에 볼 수 있어요. 첫 결제는 여기서 하고, 요금제 변경·해지·환불은 다음 단계에서 연결돼요.
      </p>

      <div className={styles.cardStack}>
        <section className={styles.card}>
          <div className={styles.sectionHead}>
            <div>
              <h2 className={styles.sectionTitle}>{me.plan.name}</h2>
              <p className={styles.sectionDesc}>
                {me.status === 'GRANT'
                  ? `무료 적용 · ${me.grant?.ends_at ? `${resetDayLabel(me.grant.ends_at)}까지` : ''}`
                  : me.plan.monthly_price > 0
                    ? `월 ${moneyLabel(me.plan.monthly_price)} · 부가세 포함`
                    : '무료'}
              </p>
            </div>
          </div>
          <div className={styles.meter}>
            <Text variant="bodyMd" color="gray700">
              학생 {me.students.count}
              {studentLimit == null ? '명' : ` / ${studentLimit}명`}
            </Text>
            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{ width: `${studentWidth}%` }} />
            </div>
          </div>
          <div className={styles.meter}>
            <Text variant="bodyMd" color="gray700">
              알림톡 {me.messages.used}통
              {included == null ? '' : ` / ${included.toLocaleString('ko-KR')}통`}
              {me.messages.reserved > 0 ? ` · 보내는 중 ${me.messages.reserved}통` : ''}
            </Text>
            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{ width: `${messageWidth}%` }} />
            </div>
          </div>
          <Text variant="bodyMd" color="gray500">
            {resetDayLabel(me.messages.resets_at)}에 다시 채워져요.
          </Text>
        </section>

        <section className={styles.card}>
          <div>
            <h2 className={styles.sectionTitle}>결제</h2>
            <p className={styles.sectionDesc}>
              {me.card
                ? `${me.card.company} ${me.card.last4}`
                : '등록된 카드가 없어요.'}
              {me.billing
                ? ` · 다음 결제 ${resetDayLabel(me.billing.next_billing_at)} ${moneyLabel(me.billing.next_amount)}`
                : ''}
            </p>
          </div>
          <InvoiceList rows={invoicesQuery.data ?? []} />
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHead}>
            <div>
              <h2 className={styles.sectionTitle}>초과 사용</h2>
              <p className={styles.sectionDesc}>
                {me.status === 'GRANT'
                  ? '무료 기간에는 요금이 없고 한 달 500통까지예요.'
                  : '통당 20원, 한 달 최대 1만 원. 다음 결제일에 구독료와 함께 결제돼요.'}
              </p>
            </div>
            {me.messages.overage_available ? (
              <Button
                variant={me.messages.overage_enabled ? 'danger' : 'primary'}
                size="sm"
                disabled={busy}
                onClick={() => (me.messages.overage_enabled ? void toggle(false) : setConfirmOn(true))}
              >
                {me.messages.overage_enabled ? '끄기' : '켜기'}
              </Button>
            ) : (
              <Text variant="bodyMd" color="gray500">
                지금은 켤 수 없어요.
              </Text>
            )}
          </div>
        </section>

        <section className={styles.card}>
          <div>
            <h2 className={styles.sectionTitle}>요금제 비교</h2>
            <p className={styles.sectionDesc}>
              금액은 부가세 포함입니다. 초과 사용은 통당 20원, 한 달 최대 500통(1만 원)이고 자동으로 다음 달에 이어집니다.
            </p>
          </div>
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
          {me.status === 'FREE' && plansQuery.data ? (
            <div className={styles.noticeActions}>
              {plansQuery.data.plans
                .filter((plan) => plan.monthly_price > 0)
                .map((plan) => (
                  <Link key={plan.code} href={`/billing/checkout?plan=${plan.code}`}>
                    <Button
                      variant={plan.code === plansQuery.data.recommended_plan_code ? 'primary' : 'secondary'}
                      size="sm"
                    >
                      {plan.name} 결제
                    </Button>
                  </Link>
                ))}
            </div>
          ) : null}
          {me.status === 'GRANT' ? (
            <Text variant="bodyMd" color="gray500">
              무료 적용 중에는 직접 요금제를 바꿀 수 없어요.
            </Text>
          ) : null}
        </section>
      </div>

      <ConfirmModal
        isOpen={confirmOn}
        onClose={() => setConfirmOn(false)}
        onConfirm={() => void toggle(true)}
        title="초과 사용을 켤까요?"
        descriptions={
          me.status === 'GRANT'
            ? ['무료 기간에는 요금이 없고 한 달 500통까지예요.', '유료로 넘어가면 초과 사용은 꺼져요.']
            : ['통당 20원이고 한 달 최대 1만 원(500통)이에요.', '다음 결제일에 구독료와 함께 결제되고, 언제든 끌 수 있어요.']
        }
        confirmLabel="켜기"
      />
    </div>
  )
}

function invoiceStatus(status: string): string {
  if (status === 'PAID') return '결제됨'
  if (status === 'FAILED') return '거절됨'
  if (status === 'PENDING') return '확인 중'
  return status
}

function InvoiceList({ rows }: { rows: BillingInvoice[] }) {
  if (rows.length === 0) {
    return (
      <Text variant="bodyMd" color="gray500">
        결제 내역이 없어요.
      </Text>
    )
  }
  return (
    <div className={styles.cardStack}>
      {rows.map((row) => (
        <div key={row.id} className={styles.sectionHead}>
          <Text variant="bodyMd">
            {row.plan_name} · {moneyLabel(row.total_amount)} · {invoiceStatus(row.status)}
            {row.paid_at ? ` · ${resetDayLabel(row.paid_at)}` : ''}
          </Text>
          {row.receipt_url ? (
            <a href={row.receipt_url} target="_blank" rel="noreferrer">
              <Button variant="ghost" size="sm">
                영수증
              </Button>
            </a>
          ) : null}
        </div>
      ))}
    </div>
  )
}
