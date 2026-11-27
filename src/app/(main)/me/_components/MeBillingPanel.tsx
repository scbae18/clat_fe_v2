'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { User } from '@/types/user'
import type { EnforcedBilling } from '@/lib/billingView'
import type { BillingInvoice } from '@/services/billing'
import ChevronRightIcon from '@/assets/icons/icon-chevron-right.svg'
import Button from '@/components/common/Button'
import ConfirmModal from '@/components/common/ConfirmModal/ConfirmModal'
import { beginBillingCard, isCardCancel } from '@/lib/billingCard'
import { moneyLabel, resetDayLabel } from '@/lib/billingView'
import { apiErrorMessage } from '@/lib/api/http'
import { billingService } from '@/services/billing'
import useToast from '@/hooks/useToast'
import * as styles from '../me.css'
import {
  invoiceDateLabel,
  invoiceStatusLabel,
  invoiceTitle,
  messageUsage,
  nextPayLine,
  renewalLabel,
  wonLabel,
} from '../_lib/meBilling'
import { MePlanChangeModal } from './MePlanChangeModal'

type MeBillingPanelProps = {
  user: User
  enforced: EnforcedBilling | null
  invoices: BillingInvoice[]
  hasOlder?: boolean
  loadingOlder?: boolean
  onLoadOlder?: () => void
}

type CancelMode = 'cancel' | 'undo'

export function MeBillingPanel({ user, enforced, invoices, hasOlder, loadingOlder, onLoadOlder }: MeBillingPanelProps) {
  const queryClient = useQueryClient()
  const { success, error, warning } = useToast()
  const menuRef = useRef<HTMLDivElement>(null)
  const [planOpen, setPlanOpen] = useState(false)
  const [menuCardId, setMenuCardId] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const [cancelMode, setCancelMode] = useState<CancelMode | null>(null)
  const [deleteCardId, setDeleteCardId] = useState<number | null>(null)

  const renewal = enforced ? renewalLabel(enforced) : null
  const nextLine = enforced ? nextPayLine(enforced) : ''
  const usage = enforced ? messageUsage(enforced) : null
  const scheduledCancel = Boolean(enforced?.billing?.cancel_at_period_end)
  const inFreePeriod = Boolean(
    enforced?.status === 'ACTIVE' &&
      enforced.billing?.no_charge_until &&
      Date.parse(enforced.billing.no_charge_until) > Date.now(),
  )
  const savedCards = enforced?.cards ?? []
  const cards = enforced
    ? savedCards.length > 0
      ? savedCards
      : enforced.card
        ? [{ id: 0, company: enforced.card.company, last4: enforced.card.last4, is_default: true }]
        : []
    : []
  const deleteTarget = cards.find((card) => card.id === deleteCardId) ?? null
  const cancelCopy = enforced && cancelMode ? cancelDescriptions(enforced, cancelMode) : null

  useEffect(() => {
    if (menuCardId == null) return
    const onPointer = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuCardId(null)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuCardId(null)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuCardId])

  const refreshBilling = () => queryClient.invalidateQueries({ queryKey: ['billing'] })

  const startAddCard = async () => {
    if (!enforced?.customer_key) {
      error('결제 정보를 만들지 못했어요. 화면을 다시 열어 주세요.')
      return
    }
    setBusy(true)
    try {
      await beginBillingCard({
        customerKey: enforced.customer_key,
        intent: 'add',
        email: user.email,
        name: user.name,
      })
    } catch (err) {
      if (isCardCancel(err)) return
      error(err instanceof Error ? err.message : apiErrorMessage(err, '카드를 등록하지 못했어요.'))
    } finally {
      setBusy(false)
    }
  }

  const makeDefault = async (cardId: number) => {
    const card = cards.find((row) => row.id === cardId)
    if (!card) return
    if (card.is_default || card.id === 0) {
      warning('이 카드가 이미 기본 결제 수단이에요.')
      return
    }
    setBusy(true)
    try {
      await billingService.setDefaultCard(card.id)
      success('기본 결제 수단으로 등록했어요.')
      await refreshBilling()
    } catch (err) {
      error(apiErrorMessage(err, '기본 결제 수단으로 바꾸지 못했어요.'))
    } finally {
      setBusy(false)
    }
  }

  const onCancelClick = () => {
    if (!enforced) return
    if (scheduledCancel) {
      setCancelMode('undo')
      return
    }
    if (inFreePeriod) {
      error('무료 기간에는 해지할 수 없어요.')
      return
    }
    if (enforced.status !== 'ACTIVE' && enforced.status !== 'PAST_DUE') {
      error('유료로 쓰는 중에만 해지할 수 있어요.')
      return
    }
    setCancelMode('cancel')
  }

  const confirmCancel = async () => {
    if (!cancelMode || !enforced) return
    setBusy(true)
    try {
      if (cancelMode === 'undo') {
        await billingService.undoCancel()
        success('해지 예약을 취소했어요.')
      } else {
        await billingService.scheduleCancel()
        success(enforced.status === 'PAST_DUE' ? '무료로 바꿨어요.' : '이번 결제 기간이 끝나면 무료로 돌아가요.')
      }
      await refreshBilling()
      setCancelMode(null)
    } catch (err) {
      error(apiErrorMessage(err, '구독을 바꾸지 못했어요.'))
    } finally {
      setBusy(false)
    }
  }

  const confirmDelete = async () => {
    if (deleteTarget == null) return
    setBusy(true)
    try {
      if (deleteTarget.id === 0) await billingService.deleteCard()
      else await billingService.deleteStoredCard(deleteTarget.id)
      success('카드를 지웠어요.')
      await refreshBilling()
      setDeleteCardId(null)
    } catch (err) {
      error(apiErrorMessage(err, '카드를 지우지 못했어요.'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>요금제 · 사용량</h2>
        <div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>요금제</span>
            <div className={styles.rowValueStack}>
              {enforced ? (
                <div className={styles.valueLine}>
                  <span className={styles.rowValue}>{enforced.plan.name}</span>
                  {renewal ? <span className={styles.infoChip}>{renewal}</span> : null}
                </div>
              ) : null}
              {nextLine ? <p className={styles.rowHint}>{nextLine}</p> : null}
            </div>
            <div className={styles.pillRow}>
              <Pill tone="primary" disabled={!enforced || busy} onClick={() => setPlanOpen(true)}>
                요금제 변경
              </Pill>
              <Pill tone="quiet" disabled={!enforced || busy} onClick={onCancelClick}>
                {scheduledCancel ? '해지 취소' : '구독 해지'}
              </Pill>
            </div>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>알림톡</span>
            <div className={styles.rowValueStack}>
              {usage ? (
                <div className={styles.usageHead}>
                  <span className={styles.rowValue}>{usage.left}</span>
                  {usage.ratio ? <span className={styles.usageRatio}>{usage.ratio}</span> : null}
                </div>
              ) : (
                <div className={styles.usageHead} />
              )}
              <div className={styles.usageTrack}>
                <div className={styles.usageFill} style={{ width: `${usage?.percent ?? 0}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>결제 수단</h2>
          <Pill tone="quiet" disabled={!enforced || busy} onClick={() => void startAddCard()}>
            새로 추가
          </Pill>
        </div>
        {cards.length > 0 ? (
          <div>
            {cards.map((card) => {
              const canDelete = !card.is_default || enforced?.status === 'FREE'
              const menuOpen = menuCardId === card.id
              return (
                <div key={card.id} className={styles.row}>
                  <CardMark />
                  <div className={styles.rowValueStack}>
                    <span className={styles.rowValue}>{card.company}</span>
                    <p className={styles.rowHint}>{`···· ${card.last4}`}</p>
                  </div>
                  {card.is_default ? <span className={styles.mutedChip}>기본 결제 수단</span> : <span />}
                  <div className={styles.cardMenuWrap} ref={menuOpen ? menuRef : undefined}>
                    <button
                      type="button"
                      className={styles.iconPill}
                      aria-label="결제 수단 메뉴"
                      aria-expanded={menuOpen}
                      aria-haspopup="menu"
                      onClick={() => setMenuCardId(menuOpen ? null : card.id)}
                    >
                      <KebabIcon />
                    </button>
                    {menuOpen ? (
                      <div className={styles.cardMenu} role="menu">
                        <button
                          type="button"
                          role="menuitem"
                          className={styles.cardMenuItem}
                          onClick={() => {
                            setMenuCardId(null)
                            void makeDefault(card.id)
                          }}
                        >
                          기본 결제 수단으로 등록
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          className={`${styles.cardMenuItem} ${styles.cardMenuDanger}`}
                          disabled={!canDelete || busy}
                          onClick={() => {
                            setMenuCardId(null)
                            setDeleteCardId(card.id)
                          }}
                        >
                          삭제
                        </button>
                        {canDelete ? null : (
                          <p className={styles.cardMenuHint}>유료로 쓰는 동안에는 기본 카드를 지울 수 없어요.</p>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        ) : null}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>결제 정보</h2>
          <Pill tone="quiet">편집</Pill>
        </div>
        <div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>결제 이메일</span>
            {enforced ? (
              <div className={styles.rowValueStack}>
                <span className={styles.rowValue}>{user.email}</span>
                <p className={styles.rowHint}>영수증과 결제 안내가 이 주소로 발송돼요</p>
              </div>
            ) : (
              <div className={styles.rowValueStack} />
            )}
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>이름</span>
            {enforced ? (
              <span className={`${styles.rowValue} ${styles.rowMain}`}>{user.name}</span>
            ) : (
              <span className={styles.rowMain} />
            )}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>거래 내역</h2>
        {enforced && invoices.length > 0 ? (
          <div>
            {invoices.map((row) => {
              const status = invoiceStatusLabel(row)
              const date = invoiceDateLabel(row.paid_at)
              const extra = row.overage_amount + row.carried_amount
              const amount =
                row.plan_amount > 0 && extra > 0
                  ? `${wonLabel(row.total_amount)} · 구독료 ${moneyLabel(row.plan_amount)} + 초과 ${moneyLabel(extra)}`
                  : wonLabel(row.total_amount)
              const refundNote =
                row.refund_status === 'DONE' && row.refunded_amount != null
                  ? `${moneyLabel(row.refunded_amount)} 환불 · ${invoiceDateLabel(row.refunded_at)}`
                  : row.refund_status === 'FAILED' && row.refund_failure_reason
                    ? `환불 실패 · ${row.refund_failure_reason}`
                    : null
              return (
                <div key={row.id} className={styles.invoiceRow}>
                  <span className={styles.invoiceName}>{invoiceTitle(row)}</span>
                  <span className={styles.invoiceDate}>{date}</span>
                  <span className={status.failed ? styles.failChip : styles.mutedChip}>{status.label}</span>
                  <div className={styles.invoiceTrail}>
                    <span className={styles.invoiceAmount}>{amount}</span>
                    {refundNote ? <span className={styles.invoiceMeta}>{refundNote}</span> : null}
                    {row.receipt_url ? (
                      <a className={styles.chevronLink} href={row.receipt_url} target="_blank" rel="noreferrer" aria-label="영수증">
                        <ChevronRightIcon width={16} height={16} />
                      </a>
                    ) : (
                      <span className={styles.chevronLink} aria-hidden>
                        <ChevronRightIcon width={16} height={16} />
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
            {hasOlder ? (
              <Button type="button" variant="secondary" size="sm" disabled={loadingOlder} onClick={onLoadOlder}>
                {loadingOlder ? '불러오는 중…' : '이전 결제 보기'}
              </Button>
            ) : null}
          </div>
        ) : null}
      </section>

      {enforced ? (
        <MePlanChangeModal
          open={planOpen}
          onClose={() => setPlanOpen(false)}
          enforced={enforced}
          email={user.email}
          name={user.name}
        />
      ) : null}
      <ConfirmModal
        isOpen={cancelCopy != null}
        onClose={() => setCancelMode(null)}
        onConfirm={() => void confirmCancel()}
        title={cancelCopy?.title ?? ''}
        descriptions={cancelCopy?.descriptions}
        confirmLabel={cancelCopy?.confirmLabel}
        confirmVariant={cancelCopy?.variant}
      />
      <ConfirmModal
        isOpen={deleteTarget != null}
        onClose={() => setDeleteCardId(null)}
        onConfirm={() => void confirmDelete()}
        title="이 카드를 지울까요?"
        descriptions={
          deleteTarget
            ? [`${deleteTarget.company} ${deleteTarget.last4} 카드를 지워요.`, '지운 카드로는 결제되지 않아요.']
            : []
        }
        confirmLabel="삭제"
        confirmVariant="danger"
      />
    </>
  )
}

function cancelDescriptions(enforced: EnforcedBilling, mode: CancelMode) {
  if (mode === 'undo') {
    return {
      title: '해지를 취소할까요?',
      descriptions: ['다음 결제일에도 지금 요금제로 결제돼요.'],
      confirmLabel: '해지 취소',
      variant: 'primary' as const,
    }
  }
  if (enforced.status === 'PAST_DUE') {
    return {
      title: '요금제를 해지할까요?',
      descriptions: [
        '바로 무료로 바뀌고, 한도를 넘는 학생은 잠겨요.',
        '못 받은 초과 사용이 있으면 다음에 결제할 때 같이 내요.',
      ],
      confirmLabel: '해지하기',
      variant: 'danger' as const,
    }
  }
  const periodEnd = enforced.billing?.next_billing_at ?? null
  return {
    title: '요금제를 해지할까요?',
    descriptions: [
      periodEnd
        ? `${resetDayLabel(periodEnd)}까지는 지금 요금제를 그대로 써요.`
        : '이번 결제 기간이 끝날 때까지 지금 요금제를 그대로 써요.',
      '그때 초과 사용이 있으면 그 금액만 결제되고, 그 뒤 무료가 돼요.',
      '그 전에 해지 취소로 되돌릴 수 있어요.',
    ],
    confirmLabel: '해지하기',
    variant: 'danger' as const,
  }
}

function Pill({
  tone,
  label,
  disabled,
  onClick,
  children,
}: {
  tone: 'primary' | 'quiet' | 'icon'
  label?: string
  disabled?: boolean
  onClick?: () => void
  children: ReactNode
}) {
  const className = tone === 'primary' ? styles.primaryPill : tone === 'quiet' ? styles.quietPill : styles.iconPill
  return (
    <button type="button" className={className} aria-label={label} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}

function CardMark() {
  return (
    <svg className={styles.cardMark} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="1.5" y="4" width="17" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1.5 8h17" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function KebabIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden>
      <circle cx="9" cy="4" r="1.2" />
      <circle cx="9" cy="9" r="1.2" />
      <circle cx="9" cy="14" r="1.2" />
    </svg>
  )
}
