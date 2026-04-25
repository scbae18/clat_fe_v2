import type { RiskSignal } from '../../_types/atRisk'
import * as styles from './SignalCard.css'

interface SignalCardProps {
  signal: RiskSignal
  triggered?: boolean
  weight?: number
}

function levelStyle(points: number, weight: number) {
  const ratio = weight > 0 ? points / weight : 0
  if (ratio >= 0.6) return 'danger' as const
  if (ratio >= 0.3) return 'warn' as const
  return 'normal' as const
}

export default function SignalCard({
  signal,
  triggered,
  weight = 30,
}: SignalCardProps) {
  const lvl = levelStyle(signal.points, weight)
  const cardClass =
    lvl === 'danger'
      ? `${styles.card} ${styles.cardTriggered}`
      : lvl === 'warn'
        ? `${styles.card} ${styles.cardWarn}`
        : styles.card

  const valueClass =
    lvl === 'danger'
      ? `${styles.value} ${styles.valueDanger}`
      : lvl === 'warn'
        ? `${styles.value} ${styles.valueWarn}`
        : styles.value

  const meterFillClass =
    lvl === 'danger'
      ? `${styles.meterFill} ${styles.meterFillDanger}`
      : lvl === 'warn'
        ? `${styles.meterFill} ${styles.meterFillWarn}`
        : styles.meterFill

  const meterPct = Math.min(
    100,
    Math.max(0, Math.round((signal.points / weight) * 100)),
  )

  return (
    <div className={cardClass}>
      <div className={styles.head}>
        <div className={styles.labelRow}>
          <span className={styles.label}>{signal.label}</span>
          {triggered ? <span className={styles.points}>· 임계 초과</span> : null}
        </div>
        <span className={styles.points}>{signal.points}점 기여</span>
      </div>
      <div className={styles.valueRow}>
        <span className={valueClass}>{signal.value}</span>
        <span className={styles.threshold}>(기준 {signal.threshold})</span>
      </div>
      <div className={styles.meterTrack}>
        <div
          className={meterFillClass}
          style={{ width: `${meterPct}%` }}
        />
      </div>
      {signal.detail ? <p className={styles.detail}>{signal.detail}</p> : null}
    </div>
  )
}
