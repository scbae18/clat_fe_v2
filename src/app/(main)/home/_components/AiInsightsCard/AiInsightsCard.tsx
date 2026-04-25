'use client'

import { useRouter } from 'next/navigation'
import StarIcon from '@/assets/icons/icon-star.svg'
import ChevronRightIcon from '@/assets/icons/icon-chevron-right.svg'
import { MOCK_AT_RISK_SNAPSHOTS } from '../../../ai/_data/mockAtRisk'
import type { RiskLevel, RiskSnapshot } from '../../../ai/_types/atRisk'
import * as styles from './AiInsightsCard.css'

function levelClass(level: RiskLevel): string {
  if (level === 'HIGH') return styles.levelHigh
  if (level === 'MEDIUM') return styles.levelMedium
  return styles.levelLow
}

function levelLabel(level: RiskLevel): string {
  if (level === 'HIGH') return 'HIGH'
  if (level === 'MEDIUM') return 'MEDIUM'
  if (level === 'NEW') return 'NEW'
  return 'LOW'
}

export default function AiInsightsCard() {
  const router = useRouter()

  const top: RiskSnapshot[] = [...MOCK_AT_RISK_SNAPSHOTS]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <StarIcon width={20} height={20} />
          <span className={styles.titleText}>AI 조교 인사이트</span>
          <span className={styles.newBadge}>NEW</span>
        </div>
      </div>

      <div className={styles.subText}>
        오늘 챙겨야 할 학생 <strong>{top.length}명</strong>이 있어요
      </div>

      <div className={styles.list}>
        {top.map((s) => (
          <div
            key={s.studentId}
            className={styles.item}
            role="button"
            tabIndex={0}
            onClick={() => router.push(`/ai?studentId=${s.studentId}`)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') router.push(`/ai?studentId=${s.studentId}`)
            }}
          >
            <span className={`${styles.levelBadge} ${levelClass(s.level)}`}>
              {levelLabel(s.level)}
            </span>
            <div className={styles.itemBody}>
              <div className={styles.itemHeader}>
                <span className={styles.studentName}>{s.studentName}</span>
                <span className={styles.className}>· {s.className}</span>
              </div>
              <div className={styles.oneLiner}>{s.brief.oneLiner}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.ctaWrap}>
        <button
          type="button"
          className={styles.cta}
          onClick={() => router.push('/ai')}
        >
          전체 보기
          <ChevronRightIcon width={16} height={16} />
        </button>
      </div>
    </section>
  )
}
