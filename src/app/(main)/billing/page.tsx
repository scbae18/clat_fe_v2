'use client'

import { FormEvent, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { loadTossPayments } from '@tosspayments/tosspayments-sdk'
import Button from '@/components/common/Button'
import ConfirmModal from '@/components/common/ConfirmModal/ConfirmModal'
import Input from '@/components/common/Input'
import Text from '@/components/common/Text'
import PlanCompare from '@/components/billing/PlanCompare'
import { apiErrorMessage } from '@/lib/api/http'
import { isEnforcedBilling, moneyLabel, resetDayLabel } from '@/lib/billingView'
import { billingService, type BillingInvoice, type PlanPreview } from '@/services/billing'
import { useUserStore } from '@/stores/userStore'
import useToast from '@/hooks/useToast'
import * as styles from './billing.css'

export default function BillingPage() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()
  const [confirmOn, setConfirmOn] = useState(false)
  const [busy, setBusy] = useState(false)
  const [planAction, setPlanAction] = useState<
    | { kind: 'change'; preview: PlanPreview }
    | { kind: 'cancel' }
    | { kind: 'undo-cancel' }
    | { kind: 'undo-down' }
    | null
  >(null)
  const [refundRow, setRefundRow] = useState<BillingInvoice | null>(null)
  const [payPanel, setPayPanel] = useState<
    | { mode: 'subscribe'; code: string }
    | { mode: 'upgrade'; preview: Extract<PlanPreview, { direction: 'UP' }> }
    | null
  >(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [benefitCode, setBenefitCode] = useState('')
  const [activeCode, setActiveCode] = useState('')
  const user = useUserStore((state) => state.user)
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

  const openPlanChange = async (planCode: string) => {
    setBusy(true)
    try {
      const preview = await billingService.previewPlanChange(planCode)
      if (preview.direction === 'UP') {
        setPlanAction(null)
        setPayPanel({ mode: 'upgrade', preview })
        setDetailsOpen(false)
        setAgreed(false)
        return
      }
      setPayPanel(null)
      setPlanAction({ kind: 'change', preview })
    } catch (err) {
      error(apiErrorMessage(err, '요금제 변경을 확인하지 못했어요.'))
    } finally {
      setBusy(false)
    }
  }

  const confirmPlanAction = async () => {
    if (!planAction) return
    setBusy(true)
    try {
      if (planAction.kind === 'change') {
        await billingService.changePlan(planAction.preview.plan_code)
        success(
          planAction.preview.direction === 'UP'
            ? `${planAction.preview.plan_name} 요금제로 바꿨어요.`
            : `${planAction.preview.plan_name} 요금제로 바꾸는 날을 예약했어요.`,
        )
      } else if (planAction.kind === 'cancel') {
        await billingService.scheduleCancel()
        success(me.status === 'PAST_DUE' ? '무료로 바꿨어요.' : '이번 결제 기간이 끝나면 무료로 돌아가요.')
      } else if (planAction.kind === 'undo-cancel') {
        await billingService.undoCancel()
        success('해지 예약을 취소했어요.')
      } else {
        await billingService.cancelPlanChange()
        success('요금제 내리기 예약을 취소했어요.')
      }
      await queryClient.invalidateQueries({ queryKey: ['billing'] })
      setPlanAction(null)
    } catch (err) {
      error(apiErrorMessage(err, '요금제를 바꾸지 못했어요.'))
    } finally {
      setBusy(false)
    }
  }

  const openSubscribe = (planCode: string) => {
    if (payPanel?.mode === 'subscribe' && payPanel.code === planCode) {
      setPayPanel(null)
      return
    }
    setPlanAction(null)
    setPayPanel({ mode: 'subscribe', code: planCode })
    setDetailsOpen(false)
    setAgreed(false)
  }

  const pay = async () => {
    if (!payPanel || !isEnforcedBilling(me)) return
    if (!agreed) {
      error('결제 내용에 동의해 주세요.')
      return
    }
    setBusy(true)
    try {
      if (payPanel.mode === 'upgrade') {
        await billingService.changePlan(payPanel.preview.plan_code)
        success(`${payPanel.preview.plan_name} 요금제로 바꿨어요.`)
        setPayPanel(null)
        await queryClient.invalidateQueries({ queryKey: ['billing'] })
        return
      }
      const plan = plansQuery.data?.plans.find((row) => row.code === payPanel.code)
      if (!plan || !me.customer_key) {
        error('결제 정보를 만들지 못했어요. 화면을 다시 열어 주세요.')
        return
      }
      const typedCode = benefitCode.trim()
      if (typedCode) {
        await billingService.redeemBenefit(typedCode, plan.code)
      }
      sessionStorage.setItem('clat.billing.plan', plan.code)
      if (!me.card) {
        const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY
        if (!clientKey) {
          error('결제 키가 없습니다.')
          return
        }
        const toss = await loadTossPayments(clientKey)
        await toss.payment({ customerKey: me.customer_key }).requestBillingAuth({
          method: 'CARD',
          successUrl: `${window.location.origin}/billing/card/success`,
          failUrl: `${window.location.origin}/billing/card/fail`,
          customerEmail: user?.email,
          customerName: user?.name,
        })
        return
      }
      const result = await billingService.subscribe(plan.code)
      sessionStorage.removeItem('clat.billing.plan')
      success(
        result.enforced && result.billing?.no_charge_until
          ? '카드를 등록했어요. 혜택 기간이 끝난 뒤 결제돼요.'
          : `${plan.name} 요금제로 결제했어요.`,
      )
      setPayPanel(null)
      await queryClient.invalidateQueries({ queryKey: ['billing'] })
    } catch (err) {
      error(apiErrorMessage(err, '결제를 시작하지 못했어요.'))
    } finally {
      setBusy(false)
    }
  }

  const retryPayment = async () => {
    setBusy(true)
    try {
      await billingService.retryPastDue()
      success('결제됐어요. 오늘이 새 결제일이에요.')
      await queryClient.invalidateQueries({ queryKey: ['billing'] })
    } catch (err) {
      error(apiErrorMessage(err, '다시 결제하지 못했어요.'))
    } finally {
      setBusy(false)
    }
  }

  const changeCard = async () => {
    if (!me.customer_key) {
      error('결제 정보를 만들지 못했어요. 화면을 다시 열어 주세요.')
      return
    }
    const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY
    if (!clientKey) {
      error('결제 키가 없습니다.')
      return
    }
    sessionStorage.removeItem('clat.billing.plan')
    const toss = await loadTossPayments(clientKey)
    await toss.payment({ customerKey: me.customer_key }).requestBillingAuth({
      method: 'CARD',
      successUrl: `${window.location.origin}/billing/card/success`,
      failUrl: `${window.location.origin}/billing/card/fail`,
      customerEmail: user?.email,
      customerName: user?.name,
    })
  }

  const selectedPlan =
    payPanel?.mode === 'subscribe'
      ? plansQuery.data?.plans.find((plan) => plan.code === payPanel.code) ?? null
      : null
  const pendingMatches = Boolean(
    selectedPlan &&
      me.pending_benefit &&
      (me.pending_benefit.plan_code == null || me.pending_benefit.plan_code === selectedPlan.code),
  )
  const benefitHoldsBilling = Boolean(
    me.billing?.no_charge_until &&
      me.billing.next_billing_at < me.billing.no_charge_until,
  )
  const planCopy = planActionCopy(
    planAction,
    me.billing?.next_billing_at ?? null,
    me.status,
    benefitHoldsBilling,
  )

  const applyActiveCode = async (event: FormEvent) => {
    event.preventDefault()
    const typed = activeCode.trim()
    if (!typed) {
      error('혜택 코드를 입력해 주세요.')
      return
    }
    setBusy(true)
    try {
      await billingService.redeemBenefit(typed)
      success('다음 결제일부터 코드의 개월 수만큼 청구되지 않아요.')
      setActiveCode('')
      await queryClient.invalidateQueries({ queryKey: ['billing'] })
    } catch (err) {
      error(apiErrorMessage(err, '코드를 적용하지 못했어요.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={styles.pageRoot}>
      <h1 className={styles.pageTitle}>요금제</h1>
      <p className={styles.pageDesc}>
        사용량과 다섯 요금제를 한눈에 볼 수 있어요. 더 높은 요금제는 남은 기간만큼 바로 결제되고, 내리기와 해지는 다음 결제일부터예요.
      </p>

      <div className={styles.cardStack}>
        <section className={styles.card}>
          <div className={styles.sectionHead}>
            <div>
              <h2 className={styles.sectionTitle}>{me.plan.name}</h2>
              <p className={styles.sectionDesc}>
                {me.status === 'PAST_DUE'
                  ? '결제가 되지 않아 알림톡과 새 학생 등록만 무료 한도예요.'
                  : me.status === 'GRANT'
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
                ? benefitHoldsBilling
                  ? ` · ${resetDayLabel(me.billing.no_charge_until ?? me.billing.next_billing_at)}까지 청구 없음`
                  : ` · 다음 결제 ${resetDayLabel(me.billing.next_billing_at)} ${moneyLabel(me.billing.next_amount)}`
                : ''}
              {me.billing?.cancel_at_period_end ? ' · 해지 예약' : ''}
              {me.saved_benefit_months > 0
                ? ` · 다시 결제하면 무료 ${me.saved_benefit_months}개월이 먼저 이어져요`
                : ''}
              {me.billing?.pending_plan_code
                ? ` · 다음 결제일부터 ${plansQuery.data?.plans.find((plan) => plan.code === me.billing?.pending_plan_code)?.name ?? '낮은 요금제'}`
                : ''}
            </p>
            {me.status === 'ACTIVE' && me.customer_key ? (
              <div className={styles.noticeActions}>
                <Button type="button" size="sm" variant="secondary" disabled={busy} onClick={() => void changeCard()}>
                  카드 바꾸기
                </Button>
              </div>
            ) : null}
          </div>
          <InvoiceList rows={invoicesQuery.data ?? []} onRefund={setRefundRow} />
          {me.status === 'PAST_DUE' ? (
            <div className={styles.payPanel}>
              <p className={styles.sectionDesc}>
                결제가 되지 않았어요. 결제될 때까지 알림톡은 월 30통, 새 학생은 10명까지예요.
                {me.past_due_until
                  ? ` ${resetDayLabel(me.past_due_until)}까지 결제되지 않으면 무료로 바뀌고, 그때 한도를 넘는 학생이 잠겨요.`
                  : ''}
              </p>
              <div className={styles.noticeActions}>
                <Button type="button" size="sm" disabled={busy || !me.card} onClick={() => void retryPayment()}>
                  다시 결제
                </Button>
                <Button type="button" size="sm" variant="secondary" disabled={busy} onClick={() => void changeCard()}>
                  카드 바꾸기
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  disabled={busy}
                  onClick={() => setPlanAction({ kind: 'cancel' })}
                >
                  해지하기
                </Button>
              </div>
            </div>
          ) : null}
          {me.status === 'ACTIVE' ? (
            <form className={styles.payPanel} onSubmit={(event) => void applyActiveCode(event)}>
              <p className={styles.sectionDesc}>
                무료 코드를 입력하면 다음 결제일부터 그 개월 수만큼 청구되지 않아요. 예를 들어 매달 10일이 결제일이고 2개월 코드면, 다음 달과 다다음 달 10일에는 청구되지 않아요.
              </p>
              <Input
                value={activeCode}
                onChange={(event) => setActiveCode(event.target.value)}
                placeholder="혜택 코드"
              />
              <Button type="submit" variant="secondary" size="sm" disabled={busy}>
                코드 적용
              </Button>
            </form>
          ) : null}
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
                  <Button
                    key={plan.code}
                    type="button"
                    variant={
                      (payPanel?.mode === 'subscribe' && payPanel.code === plan.code) ||
                      (payPanel?.mode !== 'subscribe' && plan.code === plansQuery.data.recommended_plan_code)
                        ? 'primary'
                        : 'secondary'
                    }
                    size="sm"
                    disabled={busy}
                    onClick={() => openSubscribe(plan.code)}
                  >
                    {plan.name} 결제
                  </Button>
                ))}
            </div>
          ) : null}
          {me.status === 'GRANT' ? (
            <Text variant="bodyMd" color="gray500">
              무료 적용 중에는 직접 요금제를 바꿀 수 없어요.
            </Text>
          ) : null}
          {me.status === 'ACTIVE' && plansQuery.data ? (
            <div className={styles.noticeActions}>
              {plansQuery.data.plans
                .filter((plan) => plan.monthly_price > 0 && plan.code !== me.plan.code)
                .map((plan) => (
                  <Button
                    key={plan.code}
                    variant={plan.monthly_price > me.plan.monthly_price ? 'primary' : 'secondary'}
                    size="sm"
                    disabled={busy}
                    onClick={() => {
                      if (
                        plan.monthly_price > me.plan.monthly_price &&
                        payPanel?.mode === 'upgrade' &&
                        payPanel.preview.plan_code === plan.code
                      ) {
                        setPayPanel(null)
                        return
                      }
                      void openPlanChange(plan.code)
                    }}
                  >
                    {plan.name} {plan.monthly_price > me.plan.monthly_price ? '올리기' : '내리기'}
                  </Button>
                ))}
              {me.billing?.pending_plan_code ? (
                <Button size="sm" variant="secondary" disabled={busy} onClick={() => setPlanAction({ kind: 'undo-down' })}>
                  내리기 취소
                </Button>
              ) : null}
              {me.billing?.cancel_at_period_end ? (
                <Button size="sm" variant="secondary" disabled={busy} onClick={() => setPlanAction({ kind: 'undo-cancel' })}>
                  해지 취소
                </Button>
              ) : (
                <Button size="sm" variant="danger" disabled={busy} onClick={() => setPlanAction({ kind: 'cancel' })}>
                  해지하기
                </Button>
              )}
            </div>
          ) : null}
          {payPanel ? (
            <div className={styles.payPanel}>
              <button type="button" className={styles.detailToggle} onClick={() => setDetailsOpen((open) => !open)}>
                {detailsOpen ? '안내 접기' : '안내 보기'}
              </button>
              {detailsOpen ? (
                <div>
                  {payPanel.mode === 'subscribe' && selectedPlan ? (
                    <>
                      <p className={styles.sectionDesc}>
                        다음 결제부터는 같은 날 오전 10시에 {moneyLabel(selectedPlan.monthly_price)}이 결제돼요.
                      </p>
                      <p className={styles.sectionDesc}>
                        해지하면 이번 결제 기간이 끝날 때까지 쓸 수 있고, 그다음 결제는 없어요.
                      </p>
                      <p className={styles.sectionDesc}>
                        결제일부터 7일 이내이고, 그 기간에 알림톡을 30통 이하로 보냈으면 결제 내역에서 전액을 돌려받을 수 있어요.
                      </p>
                      <p className={styles.sectionDesc}>
                        상호 클랫 · 전화 010-7324-7708 · 인스타그램 @clat.official. 주소, 사업자등록번호, 통신판매업 신고번호는 등록이 끝나면 여기에 표시돼요.
                      </p>
                    </>
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
                </div>
              ) : null}
              <div>
                <p className={styles.payAmountLabel}>오늘 결제 금액</p>
                <p className={styles.payAmount}>
                  {moneyLabel(
                    payPanel.mode === 'subscribe'
                      ? pendingMatches
                        ? 0
                        : (selectedPlan?.monthly_price ?? 0)
                      : payPanel.preview.charge_amount,
                  )}
                </p>
              </div>
              {payPanel.mode === 'subscribe' ? (
                <div>
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
              <p className={styles.sectionDesc}>
                테스트라 돈이 나가지 않아요. 국내 카드 번호 앞 6자리만 실제와 같으면 되고, 나머지는 아무 숫자예요. 휴대폰 인증번호는 000000이에요. 해외카드는 안 돼요.
              </p>
              <label className={styles.agreeRow}>
                <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
                결제 내용을 확인했고 동의합니다.
              </label>
              <Button type="button" variant="primary" size="md" disabled={busy || !agreed} onClick={() => void pay()}>
                결제하기
              </Button>
            </div>
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
      <ConfirmModal
        isOpen={planAction != null}
        onClose={() => setPlanAction(null)}
        onConfirm={() => void confirmPlanAction()}
        title={planCopy.title}
        descriptions={planCopy.descriptions}
        confirmLabel={planCopy.confirmLabel}
        confirmVariant={planAction?.kind === 'cancel' ? 'danger' : 'primary'}
      />
      <ConfirmModal
        isOpen={refundRow != null}
        onClose={() => setRefundRow(null)}
        onConfirm={() => {
          if (!refundRow) return
          const row = refundRow
          setBusy(true)
          void billingService
            .refundInvoice(row.id)
            .then(async () => {
              success('환불했어요. 무료 요금제로 바뀌었어요.')
              setRefundRow(null)
              await queryClient.invalidateQueries({ queryKey: ['billing'] })
            })
            .catch((err: unknown) => {
              error(apiErrorMessage(err, '환불하지 못했어요.'))
            })
            .finally(() => setBusy(false))
        }}
        title="이 결제를 환불할까요?"
        descriptions={
          refundRow
            ? [
                `${moneyLabel(refundRow.refund_amount ?? 0)}을 환불하고 바로 무료로 바뀌어요.`,
                ...(refundRow.includes_upgrade ? ['요금제를 올리며 낸 차액도 함께 취소돼요.'] : []),
                refundRow.locked_students.length === 0
                  ? '잠기는 학생은 없어요.'
                  : `잠기는 학생은 ${refundRow.locked_students
                      .slice(0, 4)
                      .map((student) => student.name)
                      .join(', ')}${refundRow.locked_students.length > 4 ? ` 외 ${refundRow.locked_students.length - 4}명` : ''}이에요.`,
                '카드사 반영에는 며칠 걸릴 수 있어요.',
              ]
            : []
        }
        confirmLabel="환불 받기"
        confirmVariant="danger"
      />
    </div>
  )
}

function planActionCopy(
  action:
    | { kind: 'change'; preview: PlanPreview }
    | { kind: 'cancel' }
    | { kind: 'undo-cancel' }
    | { kind: 'undo-down' }
    | null,
  periodEnd: string | null,
  status: string | null,
  benefitPeriod: boolean,
): { title: string; descriptions: string[]; confirmLabel: string } {
  if (!action || action.kind === 'undo-down') {
    return {
      title: '요금제 내리기를 취소할까요?',
      descriptions: ['다음 결제일에도 지금 요금제를 그대로 써요.'],
      confirmLabel: '내리기 취소',
    }
  }
  if (action.kind === 'undo-cancel') {
    return {
      title: '해지를 취소할까요?',
      descriptions: ['다음 결제일에도 지금 요금제로 결제돼요.'],
      confirmLabel: '해지 취소',
    }
  }
  if (action.kind === 'cancel' && status === 'PAST_DUE') {
    return {
      title: '요금제를 해지할까요?',
      descriptions: [
        '바로 무료로 바뀌고, 한도를 넘는 학생은 잠겨요.',
        '못 받은 초과 사용이 있으면 다음에 결제할 때 같이 내요.',
      ],
      confirmLabel: '해지하기',
    }
  }
  if (action.kind === 'cancel') {
    return {
      title: '요금제를 해지할까요?',
      descriptions: benefitPeriod
        ? [
            '이미 결제한 기간이면 그 기간이 끝날 때까지 써요. 이번 기간에 결제가 없으면 지금 무료로 바뀌어요.',
            '아직 쓰지 않은 혜택 개월은 없어지지 않고, 다시 결제할 때 먼저 이어져요.',
          ]
        : [
            periodEnd
              ? `${resetDayLabel(periodEnd)}까지는 지금 요금제를 그대로 써요.`
              : '이번 결제 기간이 끝날 때까지 지금 요금제를 그대로 써요.',
            '그때 초과 사용이 있으면 그 금액만 결제되고, 그 뒤 무료가 돼요.',
            '그 전에 해지 취소로 되돌릴 수 있어요.',
          ],
      confirmLabel: '해지하기',
    }
  }
  const preview = action.preview
  if (preview.direction === 'UP') {
    return {
      title: `${preview.plan_name} 요금제로 올릴까요?`,
      descriptions: [
        preview.charge_amount > 0
          ? `오늘 ${moneyLabel(preview.charge_amount)}이 결제돼요. 남은 ${preview.remaining_days}일 / ${preview.period_days}일 차액이에요.`
          : '오늘은 결제하지 않고 바로 바뀌어요.',
        `다음 결제일부터는 월 ${moneyLabel(preview.new_monthly_price)}이에요. 결제일은 그대로예요.`,
        preview.unlock_count > 0 ? `잠긴 학생 ${preview.unlock_count}명이 풀려요.` : '학생 한도와 알림톡 한도가 바로 늘어요.',
      ],
      confirmLabel: preview.charge_amount > 0 ? '결제하고 올리기' : '올리기',
    }
  }
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
    confirmLabel: '내리기 예약',
  }
}

function invoiceStatus(status: string): string {
  if (status === 'PAID') return '결제됨'
  if (status === 'FAILED') return '거절됨'
  if (status === 'PENDING') return '확인 중'
  if (status === 'REFUNDED') return '환불됨'
  if (status === 'PARTIALLY_REFUNDED') return '일부 환불'
  return status
}

function InvoiceList({
  rows,
  onRefund,
}: {
  rows: BillingInvoice[]
  onRefund: (row: BillingInvoice) => void
}) {
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
          <div>
            <Text variant="bodyMd">
              {row.plan_name} · {moneyLabel(row.total_amount)} · {invoiceStatus(row.status)}
              {row.paid_at ? ` · ${resetDayLabel(row.paid_at)}` : ''}
            </Text>
            {row.refund_block_reason ? (
              <Text variant="bodyMd" color="gray500">
                {row.refund_block_reason}
              </Text>
            ) : null}
          </div>
          <div className={styles.noticeActions}>
            {row.refundable ? (
              <Button type="button" variant="danger" size="sm" onClick={() => onRefund(row)}>
                환불 받기
              </Button>
            ) : null}
            {row.receipt_url ? (
              <a href={row.receipt_url} target="_blank" rel="noreferrer">
                <Button variant="ghost" size="sm">
                  영수증
                </Button>
              </a>
            ) : null}
          </div>
        </div>
      ))}
      <Text variant="bodyMd" color="gray500">
        클랫 오류나 중복 결제라면 010-7324-7708로 문의해 주세요.
      </Text>
    </div>
  )
}
