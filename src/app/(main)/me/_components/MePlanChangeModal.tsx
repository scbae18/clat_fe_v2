'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Button from '@/components/common/Button'
import ConfirmModal from '@/components/common/ConfirmModal/ConfirmModal'
import Input from '@/components/common/Input'
import Modal from '@/components/common/Modal'
import Text from '@/components/common/Text'
import PlanCompare from '@/components/billing/PlanCompare'
import BusinessInfo from '@/components/legal/BusinessInfo'
import { apiErrorMessage } from '@/lib/api/http'
import { beginBillingCard, isCardCancel, withBillingProgress } from '@/lib/billingCard'
import { moneyLabel, resetDayLabel, type EnforcedBilling } from '@/lib/billingView'
import { billingService, type PlanPreview } from '@/services/billing'
import useToast from '@/hooks/useToast'
import * as billingStyles from '../../billing/billing.css'
import * as styles from '../me.css'

type PayPanel =
  | { mode: 'subscribe'; code: string }
  | { mode: 'upgrade'; preview: Extract<PlanPreview, { direction: 'UP' }> }

type MePlanChangeModalProps = {
  open: boolean
  onClose: () => void
  enforced: EnforcedBilling
  email?: string | null
  name?: string | null
}

export function MePlanChangeModal({ open, onClose, enforced, email, name }: MePlanChangeModalProps) {
  const queryClient = useQueryClient()
  const { success, error } = useToast()
  const [busy, setBusy] = useState(false)
  const [payPanel, setPayPanel] = useState<PayPanel | null>(null)
  const [downPreview, setDownPreview] = useState<Extract<PlanPreview, { direction: 'DOWN' }> | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [benefitCode, setBenefitCode] = useState('')

  const plansQuery = useQuery({
    queryKey: ['billing', 'plans'],
    queryFn: () => billingService.plans(),
    enabled: open,
    refetchOnWindowFocus: false,
    retry: false,
  })

  const close = () => {
    setPayPanel(null)
    setDownPreview(null)
    setDetailsOpen(false)
    setAgreed(false)
    setBenefitCode('')
    onClose()
  }

  const openPlanChange = async (planCode: string) => {
    setBusy(true)
    try {
      const preview = await billingService.previewPlanChange(planCode)
      if (preview.direction === 'UP') {
        setDownPreview(null)
        setPayPanel({ mode: 'upgrade', preview })
        setDetailsOpen(false)
        setAgreed(false)
        return
      }
      setPayPanel(null)
      setDownPreview(preview)
    } catch (err) {
      error(apiErrorMessage(err, '요금제 변경을 확인하지 못했어요.'))
    } finally {
      setBusy(false)
    }
  }

  const confirmDown = async () => {
    if (!downPreview) return
    setBusy(true)
    try {
      await billingService.changePlan(downPreview.plan_code)
      success(`${downPreview.plan_name} 요금제로 바꾸는 날을 예약했어요.`)
      await queryClient.invalidateQueries({ queryKey: ['billing'] })
      close()
    } catch (err) {
      error(apiErrorMessage(err, '요금제를 바꾸지 못했어요.'))
    } finally {
      setBusy(false)
    }
  }

  const pay = async () => {
    if (!payPanel) return
    if (!agreed) {
      error('결제 내용에 동의해 주세요.')
      return
    }
    setBusy(true)
    try {
      if (payPanel.mode === 'upgrade') {
        await withBillingProgress('요금제를 바꾸는 중…', () => billingService.changePlan(payPanel.preview.plan_code))
        success(`${payPanel.preview.plan_name} 요금제로 바꿨어요.`)
        await queryClient.invalidateQueries({ queryKey: ['billing'] })
        close()
        return
      }
      const plan = plansQuery.data?.plans.find((row) => row.code === payPanel.code)
      if (!plan || !enforced.customer_key) {
        error('결제 정보를 만들지 못했어요. 화면을 다시 열어 주세요.')
        return
      }
      const typedCode = benefitCode.trim()
      if (typedCode) await billingService.redeemBenefit(typedCode, plan.code)
      if (!enforced.card) {
        const opening = beginBillingCard({
          customerKey: enforced.customer_key,
          intent: 'subscribe',
          planCode: plan.code,
          planName: plan.name,
          email,
          name,
        })
        close()
        await opening
        return
      }
      const result = await withBillingProgress('결제하는 중…', () => billingService.subscribe(plan.code))
      success(
        result.enforced && result.billing?.no_charge_until
          ? '카드를 등록했어요. 혜택 기간이 끝난 뒤 결제돼요.'
          : `${plan.name} 요금제로 결제했어요.`,
      )
      await queryClient.invalidateQueries({ queryKey: ['billing'] })
      close()
    } catch (err) {
      if (isCardCancel(err)) return
      error(err instanceof Error ? err.message : apiErrorMessage(err, '결제를 시작하지 못했어요.'))
    } finally {
      setBusy(false)
    }
  }

  const selectedPlan =
    payPanel?.mode === 'subscribe'
      ? plansQuery.data?.plans.find((plan) => plan.code === payPanel.code) ?? null
      : null
  const pendingMatches = Boolean(
    selectedPlan &&
      enforced.pending_benefit &&
      (enforced.pending_benefit.plan_code == null || enforced.pending_benefit.plan_code === selectedPlan.code),
  )
  const savedPlan = enforced.saved_benefit_plan
  const freeMonthsFirst = Boolean(
    benefitCode.trim() ||
      pendingMatches ||
      (selectedPlan && enforced.saved_benefit_months > 0 && (!savedPlan || savedPlan.code === selectedPlan.code)),
  )
  const lockedBenefitPlan = Boolean(
    selectedPlan &&
      !benefitCode.trim() &&
      !enforced.pending_benefit &&
      enforced.saved_benefit_months > 0 &&
      savedPlan &&
      savedPlan.code !== selectedPlan.code,
  )
  const todayCharge =
    payPanel?.mode === 'upgrade'
      ? payPanel.preview.charge_amount
      : lockedBenefitPlan || freeMonthsFirst
        ? 0
        : (selectedPlan?.monthly_price ?? 0) + enforced.carried_overage_amount
  const monthlyAfter = lockedBenefitPlan
    ? (savedPlan?.monthly_price ?? 0)
    : payPanel?.mode === 'upgrade'
      ? payPanel.preview.new_monthly_price
      : (selectedPlan?.monthly_price ?? 0)
  const consentText =
    payPanel?.mode === 'upgrade'
      ? `오늘 ${moneyLabel(todayCharge)}이 결제되고, 다음 결제일부터 월 ${moneyLabel(monthlyAfter)}이 결제되는 것에 동의합니다.`
      : todayCharge === 0
        ? `지금은 결제되지 않고, 무료 기간이 끝난 뒤 매달 이 날 오전 10시에 ${moneyLabel(monthlyAfter)}이 자동 결제되는 것에 동의합니다.`
        : `오늘 ${moneyLabel(todayCharge)}이 결제되고, 이후 매달 이 날 오전 10시에 ${moneyLabel(monthlyAfter)}이 자동 결제되는 것에 동의합니다.`

  const plans = plansQuery.data?.plans ?? []
  const downCopy = downPreview ? downgradeCopy(downPreview) : null

  return (
    <>
      <Modal isOpen={open} onClose={close} size="lg">
        <div className={styles.planModal}>
          <Text variant="headingMd" as="h2">
            요금제 변경
          </Text>
          <p className={styles.sectionDesc}>
            더 높은 요금제는 남은 기간만큼 바로 결제되고, 낮은 요금제는 다음 결제일부터 바뀌어요.
          </p>
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
              fit
            />
          ) : null}
          {enforced.status === 'GRANT' ? (
            <Text variant="bodyMd" color="gray500">
              무료 적용 중에는 직접 요금제를 바꿀 수 없어요.
            </Text>
          ) : null}
          {enforced.status === 'PAST_DUE' ? (
            <Text variant="bodyMd" color="gray500">
              결제 대기 중에는 요금제를 바꿀 수 없어요.
            </Text>
          ) : null}
          {enforced.status === 'FREE' && plans.length > 0 ? (
            <div className={billingStyles.noticeActions}>
              {plans
                .filter((plan) => plan.monthly_price > 0)
                .map((plan) => (
                  <Button
                    key={plan.code}
                    type="button"
                    variant={
                      (payPanel?.mode === 'subscribe' && payPanel.code === plan.code) ||
                      (payPanel?.mode !== 'subscribe' && plan.code === plansQuery.data?.recommended_plan_code)
                        ? 'primary'
                        : 'secondary'
                    }
                    size="sm"
                    disabled={busy}
                    onClick={() => {
                      if (payPanel?.mode === 'subscribe' && payPanel.code === plan.code) {
                        setPayPanel(null)
                        return
                      }
                      setDownPreview(null)
                      setPayPanel({ mode: 'subscribe', code: plan.code })
                      setDetailsOpen(false)
                      setAgreed(false)
                    }}
                  >
                    {plan.name} 결제
                  </Button>
                ))}
            </div>
          ) : null}
          {enforced.status === 'ACTIVE' && plans.length > 0 ? (
            <div className={billingStyles.noticeActions}>
              {plans
                .filter((plan) => plan.monthly_price > 0 && plan.code !== enforced.plan.code)
                .map((plan) => (
                  <Button
                    key={plan.code}
                    type="button"
                    variant={plan.monthly_price > enforced.plan.monthly_price ? 'primary' : 'secondary'}
                    size="sm"
                    disabled={busy}
                    onClick={() => {
                      if (
                        plan.monthly_price > enforced.plan.monthly_price &&
                        payPanel?.mode === 'upgrade' &&
                        payPanel.preview.plan_code === plan.code
                      ) {
                        setPayPanel(null)
                        return
                      }
                      void openPlanChange(plan.code)
                    }}
                  >
                    {plan.name} {plan.monthly_price > enforced.plan.monthly_price ? '올리기' : '내리기'}
                  </Button>
                ))}
            </div>
          ) : null}
          {payPanel ? (
            <div className={billingStyles.payPanel}>
              <div>
                <p className={billingStyles.payAmountLabel}>오늘 결제 금액</p>
                <p className={billingStyles.payAmount}>{moneyLabel(todayCharge)}</p>
              </div>
              {payPanel.mode === 'subscribe' && selectedPlan && !freeMonthsFirst && !lockedBenefitPlan && enforced.carried_overage_amount > 0 ? (
                <p className={styles.sectionDesc}>
                  구독료 {moneyLabel(selectedPlan.monthly_price)} + 지난 초과 사용 {moneyLabel(enforced.carried_overage_amount)}
                </p>
              ) : null}
              {payPanel.mode === 'subscribe' && lockedBenefitPlan && savedPlan ? (
                <p className={styles.sectionDesc}>
                  저장된 무료 {enforced.saved_benefit_months}개월은 {savedPlan.name}으로 시작돼요. 지금은 결제되지 않아요.
                </p>
              ) : null}
              {payPanel.mode === 'subscribe' && freeMonthsFirst ? (
                <p className={styles.sectionDesc}>무료 개월이 먼저 적용돼요. 지금은 결제되지 않아요.</p>
              ) : null}
              {payPanel.mode === 'subscribe' && selectedPlan && !freeMonthsFirst && !lockedBenefitPlan ? (
                <p className={styles.sectionDesc}>
                  다음 결제부터는 같은 날 오전 10시에 {moneyLabel(selectedPlan.monthly_price)}이 결제돼요.
                </p>
              ) : null}
              {payPanel.mode === 'subscribe' && enforced.card ? (
                <p className={styles.sectionDesc}>
                  {enforced.card.company} {enforced.card.last4}로 결제돼요.
                </p>
              ) : null}
              {payPanel.mode === 'upgrade' ? (
                <>
                  <p className={styles.sectionDesc}>
                    남은 {payPanel.preview.remaining_days}일 / {payPanel.preview.period_days}일 차액이에요. 결제일은 그대로이고, 다음 결제일부터는 월 {moneyLabel(payPanel.preview.new_monthly_price)}이에요.
                  </p>
                  <p className={styles.sectionDesc}>
                    {payPanel.preview.unlock_count > 0
                      ? `잠긴 학생 ${payPanel.preview.unlock_count}명이 풀려요.`
                      : '학생 한도와 알림톡 한도가 바로 늘어요.'}
                  </p>
                </>
              ) : null}
              {payPanel.mode === 'subscribe' ? (
                <button type="button" className={billingStyles.detailToggle} onClick={() => setDetailsOpen((value) => !value)}>
                  {detailsOpen ? '안내 접기' : '해지·환불 안내'}
                </button>
              ) : null}
              {detailsOpen && payPanel.mode === 'subscribe' ? (
                <div>
                  <p className={styles.sectionDesc}>해지하면 이번 결제 기간이 끝날 때까지 쓸 수 있고, 그다음 결제는 없어요.</p>
                  <p className={styles.sectionDesc}>
                    결제일부터 7일 이내이고, 그 기간에 알림톡을 30통 이하로 보냈으면 결제 내역에서 전액을 돌려받을 수 있어요.
                  </p>
                  <BusinessInfo tone="light" />
                </div>
              ) : null}
              {payPanel.mode === 'subscribe' ? (
                <div className={styles.planBenefit}>
                  <Text variant="labelSm" color="gray700" as="span">
                    혜택 코드
                  </Text>
                  <Input
                    value={benefitCode}
                    onChange={(event) => setBenefitCode(event.target.value)}
                    placeholder="없으면 비워 두세요"
                  />
                  <p className={styles.sectionDesc}>
                    코드를 적으면 그 개월 수는 결제되지 않고 카드만 등록돼요. 혜택이 끝나면 같은 날부터 결제돼요.
                  </p>
                </div>
              ) : null}
              <label className={billingStyles.agreeRow}>
                <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
                <span>
                  {consentText} <Link href="/terms" className={billingStyles.agreeLink}>이용약관</Link>
                  {' · '}
                  <Link href="/refund" className={billingStyles.agreeLink}>환불 규정</Link>
                </span>
              </label>
              <Button type="button" variant="primary" size="md" disabled={busy || !agreed} onClick={() => void pay()}>
                결제하기
              </Button>
            </div>
          ) : null}
        </div>
      </Modal>
      <ConfirmModal
        isOpen={downCopy != null}
        onClose={() => setDownPreview(null)}
        onConfirm={() => void confirmDown()}
        title={downCopy?.title ?? ''}
        descriptions={downCopy?.descriptions}
        confirmLabel="내리기 예약"
      />
    </>
  )
}

function downgradeCopy(preview: Extract<PlanPreview, { direction: 'DOWN' }>) {
  const names = preview.locked_students.map((student) => student.name)
  const shown = names.slice(0, 4).join(', ')
  return {
    title: `${preview.plan_name} 요금제로 내릴까요?`,
    descriptions: [
      `${resetDayLabel(preview.effective_at)}부터 월 ${moneyLabel(preview.new_monthly_price)}이에요. 그때까지는 지금 요금제예요.`,
      '해지 예약이 있으면 그대로 유지돼요.',
      names.length === 0
        ? '그때 잠기는 학생은 없어요.'
        : `그때 잠기는 학생은 ${shown}${names.length > 4 ? ` 외 ${names.length - 4}명` : ''}이에요.`,
    ],
  }
}
