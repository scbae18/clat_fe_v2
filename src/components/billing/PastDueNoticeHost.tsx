'use client'

import { useEffect, useState } from 'react'
import { beginBillingCard, isCardCancel, withBillingProgress } from '@/lib/billingCard'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import Text from '@/components/common/Text'
import useToast from '@/hooks/useToast'
import { isEnforcedBilling, kstHourLabel, moneyLabel, resetDayLabel, type EnforcedBilling } from '@/lib/billingView'
import { apiErrorMessage } from '@/lib/api/http'
import { billingService } from '@/services/billing'
import { useUserStore } from '@/stores/userStore'

const DISMISS_KEY = 'clat.billing.pastDueDismissed'

export default function PastDueNoticeHost() {
  const user = useUserStore((state) => state.user)
  const { success, error } = useToast()
  const [me, setMe] = useState<EnforcedBilling | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!user || sessionStorage.getItem(DISMISS_KEY) === '1') return
    let cancelled = false
    void billingService.me().then((current) => {
      if (cancelled || !isEnforcedBilling(current) || current.status !== 'PAST_DUE') return
      setMe(current)
    }).catch(() => {
      // 요금제 정보를 못 읽어도 다른 화면은 그대로 둔다.
    })
    return () => {
      cancelled = true
    }
  }, [user])

  const close = () => {
    sessionStorage.setItem(DISMISS_KEY, '1')
    setMe(null)
  }

  const retry = async () => {
    setBusy(true)
    try {
      await withBillingProgress('결제하는 중…', () => billingService.retryPastDue())
      success('결제됐어요. 오늘이 새 결제일이에요.')
      close()
    } catch (err) {
      error(apiErrorMessage(err, '다시 결제하지 못했어요.'))
    } finally {
      setBusy(false)
    }
  }

  const changeCard = async () => {
    if (!me?.customer_key) {
      error('결제 정보를 만들지 못했어요. 화면을 다시 열어 주세요.')
      return
    }
    try {
      const opening = beginBillingCard({
        customerKey: me.customer_key,
        intent: 'past_due',
        email: user?.email,
        name: user?.name,
      })
      close()
      await opening
    } catch (err) {
      if (!isCardCancel(err)) error(err instanceof Error ? err.message : '카드를 바꾸지 못했어요.')
    }
  }

  const dueMe = me?.status === 'PAST_DUE' ? me : null
  const due = dueMe?.past_due
  const amount = due
    ? due.carried_amount > 0
      ? `결제할 금액은 ${moneyLabel(due.amount)}이에요. 구독료 ${moneyLabel(due.plan_amount)} + 지난 초과 사용 ${moneyLabel(due.carried_amount)}.`
      : `결제할 금액은 ${moneyLabel(due.amount)}이에요.`
    : '결제가 되지 않았어요.'

  return (
    <Modal isOpen={dueMe != null} onClose={close} size="sm">
      <Text variant="headingMd" as="h2">결제가 되지 않았어요</Text>
      <p>{amount}</p>
      {due?.failure_message ? <p>거절 사유: {due.failure_message}</p> : null}
      <p>
        {due?.next_attempt_at
          ? `다음 자동 결제는 ${kstHourLabel(due.next_attempt_at)}예요.`
          : me?.past_due_until
            ? `${resetDayLabel(me.past_due_until)}까지 결제되지 않으면 무료로 바뀌어요.`
            : '지금 다시 결제할 수 있어요.'}
      </p>
      <div>
        <Button type="button" size="sm" disabled={busy || !me?.card} onClick={() => void retry()}>
          다시 결제
        </Button>
        <Button type="button" size="sm" variant="secondary" disabled={busy} onClick={() => void changeCard()}>
          카드 바꾸기
        </Button>
        <Button type="button" size="sm" variant="ghost" disabled={busy} onClick={close}>
          닫기
        </Button>
      </div>
    </Modal>
  )
}
