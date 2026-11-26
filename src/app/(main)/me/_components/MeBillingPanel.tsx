'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import type { User } from '@/types/user'
import type { EnforcedBilling } from '@/lib/billingView'
import type { BillingInvoice } from '@/services/billing'
import ChevronRightIcon from '@/assets/icons/icon-chevron-right.svg'
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

type MeBillingPanelProps = {
  user: User
  enforced: EnforcedBilling | null
  invoices: BillingInvoice[]
}

export function MeBillingPanel({ user, enforced, invoices }: MeBillingPanelProps) {
  const renewal = enforced ? renewalLabel(enforced) : null
  const nextLine = enforced ? nextPayLine(enforced) : ''
  const usage = enforced ? messageUsage(enforced) : null
  const billingHref = enforced ? '/billing' : undefined

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
              <Pill href={billingHref} tone="primary">
                요금제 변경
              </Pill>
              <Pill href={billingHref} tone="quiet">
                구독 해지
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
          <Pill href={billingHref} tone="quiet">
            새로 추가
          </Pill>
        </div>
        {enforced?.card ? (
          <div>
            <div className={styles.row}>
              <CardMark />
              <div className={styles.rowValueStack}>
                <span className={styles.rowValue}>{enforced.card.company}</span>
                <p className={styles.rowHint}>{`···· ${enforced.card.last4}`}</p>
              </div>
              <span className={styles.mutedChip}>기본 결제 수단</span>
              <Pill href={billingHref} tone="icon" label="결제 수단 관리">
                <KebabIcon />
              </Pill>
            </div>
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
              const status = invoiceStatusLabel(row.status)
              const date = invoiceDateLabel(row.paid_at)
              return (
                <div key={row.id} className={styles.invoiceRow}>
                  <span className={styles.invoiceName}>{invoiceTitle(row)}</span>
                  <span className={styles.invoiceDate}>{date}</span>
                  <span className={status.failed ? styles.failChip : styles.mutedChip}>{status.label}</span>
                  <span className={styles.invoiceAmount}>{wonLabel(row.total_amount)}</span>
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
              )
            })}
          </div>
        ) : null}
      </section>
    </>
  )
}

function Pill({
  href,
  tone,
  label,
  children,
}: {
  href?: string
  tone: 'primary' | 'quiet' | 'icon'
  label?: string
  children: ReactNode
}) {
  const className = tone === 'primary' ? styles.primaryPill : tone === 'quiet' ? styles.quietPill : styles.iconPill
  if (href) {
    return (
      <Link href={href} className={className} aria-label={label}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" className={className} aria-label={label}>
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
