'use client'

import InfoIcon from '@/assets/icons/icon-info.svg'
import type { ParsedLessonScore } from '@/lib/lessonScore'
import * as styles from '../studentDashboard.css'
import { MSG, formatScoreNum } from '../_lib/studentDashboardShared'

type StudentStatsRowProps = {
  monthlyCompletionPct: number
  monthlyAttendancePct: number
  completionDelta: number | null
  attendanceDelta: number | null
  recentScoreParsed: ParsedLessonScore | null
  scoreDelta: number | null
  scoreDeltaIsPercent: boolean
}

function Trend({
  delta,
  suffix,
}: {
  delta: number | null
  suffix: string
}) {
  if (delta == null || delta === 0) {
    return <span className={styles.statTrendMuted}>—</span>
  }
  return (
    <span className={delta > 0 ? styles.statTrendMuted : styles.statTrendDown}>
      {delta > 0 ? MSG.arrowUp : MSG.arrowDown} {Math.abs(delta)}
      {suffix}
    </span>
  )
}

export function StudentStatsRow({
  monthlyCompletionPct,
  monthlyAttendancePct,
  completionDelta,
  attendanceDelta,
  recentScoreParsed,
  scoreDelta,
  scoreDeltaIsPercent,
}: StudentStatsRowProps) {
  return (
    <div className={styles.statsRow}>
      <div className={styles.statMini}>
        <span className={styles.statMiniLabel}>{MSG.monthComplete}</span>
        <span className={styles.statMiniValue}>{monthlyCompletionPct}%</span>
        <div className={styles.statTrendRow}>
          <span className={styles.statTrendMuted}>{MSG.vsLastMonth}</span>
          <Trend delta={completionDelta} suffix="%" />
        </div>
      </div>
      <div className={styles.statMini}>
        <span className={styles.statMiniLabel}>
          {MSG.recentScore}
          <button type="button" className={styles.infoIconBtn} title={MSG.recentScoreTitle}>
            <InfoIcon width={16} height={16} />
          </button>
        </span>
        <span className={styles.statMiniValue}>
          {recentScoreParsed && recentScoreParsed.earned != null ? (
            recentScoreParsed.max != null ? (
              <>
                {formatScoreNum(recentScoreParsed.earned)}
                <span className={styles.statMiniValueMax}>
                  {' / '}
                  {formatScoreNum(recentScoreParsed.max)}
                  점
                </span>
              </>
            ) : (
              `${formatScoreNum(recentScoreParsed.earned)}점`
            )
          ) : (
            '—'
          )}
        </span>
        <div className={styles.statTrendRow}>
          <span className={styles.statTrendMuted}>{MSG.vsClassAvg}</span>
          <Trend delta={scoreDelta} suffix={scoreDeltaIsPercent ? '%' : '점'} />
        </div>
      </div>
      <div className={styles.statMini}>
        <span className={styles.statMiniLabel}>{MSG.monthAttend}</span>
        <span className={styles.statMiniValue}>{monthlyAttendancePct}%</span>
        <div className={styles.statTrendRow}>
          <span className={styles.statTrendMuted}>{MSG.vsLastMonth}</span>
          <Trend delta={attendanceDelta} suffix="%" />
        </div>
      </div>
    </div>
  )
}
