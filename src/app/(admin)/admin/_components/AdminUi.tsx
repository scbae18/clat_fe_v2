'use client'

import type { CSSProperties, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { colors } from '@/styles/tokens/colors'
import * as styles from '../admin.css'

export function AdminHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className={styles.pageHeader}>
      <div>
        <h1 className={styles.pageTitle}>{title}</h1>
        {subtitle ? <p className={styles.pageSub}>{subtitle}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  )
}

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconTone = 'primary50',
  wow,
  valueTone,
  accent,
}: {
  label: string
  value: string | number
  sub?: string
  icon: LucideIcon
  iconTone?: keyof typeof styles.iconBox
  wow?: { label: string; pct: number }
  valueTone?: 'success' | 'error'
  accent?: keyof typeof styles.statCardAccent
}) {
  const wowTone = wow ? (wow.pct > 0 ? 'up' : wow.pct < 0 ? 'down' : 'flat') : null
  const cardClass = accent ? styles.statCardAccent[accent] : styles.statCard
  const valueClass =
    valueTone === 'success'
      ? styles.statValueSuccess
      : valueTone === 'error'
        ? styles.statValueError
        : styles.statValue

  return (
    <div className={cardClass}>
      <div className={styles.statTop}>
        <span className={styles.statLabel}>{label}</span>
        <span className={styles.iconBox[iconTone]}>
          <Icon size={16} />
        </span>
      </div>
      <div className={styles.statValueRow}>
        <p className={valueClass}>{typeof value === 'number' ? value.toLocaleString() : value}</p>
        {wow && wowTone ? <span className={styles.wow[wowTone]}>{wow.label}</span> : null}
      </div>
      {sub ? <p className={styles.statHint}>{sub}</p> : null}
    </div>
  )
}

export function PctBar({ pct, color }: { pct: number; color?: string }) {
  return (
    <div className={styles.track}>
      <div
        className={styles.trackFill}
        style={{ '--pct': pct, '--bar': color ?? '#3B51CC' } as CSSProperties}
      />
    </div>
  )
}

export function PctBarSm({ pct }: { pct: number }) {
  return (
    <div className={styles.trackSm}>
      <div className={styles.trackFillSm} style={{ '--pct': pct } as CSSProperties} />
    </div>
  )
}

export function AdminPager({
  page,
  limit,
  total,
  onPage,
}: {
  page: number
  limit: number
  total: number
  onPage: (next: number) => void
}) {
  const last = Math.max(1, Math.ceil(total / limit))
  if (total <= limit) return null
  return (
    <div className={styles.pager}>
      <button type="button" className={styles.ghostBtn} disabled={page <= 1} onClick={() => onPage(page - 1)}>
        이전
      </button>
      <span className={styles.mutedInline}>
        {page} / {last} · {total}건
      </span>
      <button type="button" className={styles.ghostBtn} disabled={page >= last} onClick={() => onPage(page + 1)}>
        다음
      </button>
    </div>
  )
}

const RING = 2 * Math.PI * 15.9

export function UsageRing({ pct, color }: { pct: number; color: string }) {
  const clamped = Math.max(0, Math.min(100, pct))
  return (
    <div className={styles.ringWrap}>
      <svg width={80} height={80} viewBox="0 0 36 36" className={styles.ringSvg}>
        <circle cx="18" cy="18" r="15.9" fill="none" stroke={colors.gray50} strokeWidth="3" />
        <circle
          cx="18"
          cy="18"
          r="15.9"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${(clamped / 100) * RING} ${RING}`}
          strokeLinecap="round"
          transform="rotate(-90 18 18)"
        />
      </svg>
      <div className={styles.ringCenter}>{clamped}%</div>
    </div>
  )
}
