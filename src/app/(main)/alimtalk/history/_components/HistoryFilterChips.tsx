'use client'

import * as styles from '../history.css'
import type { ChipFilter } from '../_lib/historyShared'

type Stats = {
  total: number
  complete: number
  fail: number
  lesson: number
  att: number
}

type HistoryFilterChipsProps = {
  chip: ChipFilter
  onChipChange: (chip: ChipFilter) => void
  stats: Stats
}

export function HistoryFilterChips({ chip, onChipChange, stats }: HistoryFilterChipsProps) {
  return (
    <div className={styles.chipRow}>
      <button
        type="button"
        className={`${styles.chip} ${chip === 'all' ? styles.chipActive : styles.chipInactive}`}
        onClick={() => onChipChange('all')}
      >
        전체
        <span>{stats.total}</span>
      </button>
      <button
        type="button"
        className={`${styles.chip} ${chip === 'complete' ? styles.chipActive : styles.chipInactive}`}
        onClick={() => onChipChange('complete')}
      >
        발송 완료
        <span>{stats.complete}</span>
      </button>
      <button
        type="button"
        className={`${styles.chip} ${chip === 'fail' ? styles.chipActive : styles.chipInactive}`}
        onClick={() => onChipChange('fail')}
      >
        실패
        <span>{stats.fail}</span>
      </button>
      <button
        type="button"
        className={`${styles.chip} ${chip === 'LESSON' ? styles.chipActive : styles.chipInactive}`}
        onClick={() => onChipChange('LESSON')}
      >
        수업 문자
        <span>{stats.lesson}</span>
      </button>
      <button
        type="button"
        className={`${styles.chip} ${chip === 'ATTENDANCE' ? styles.chipActive : styles.chipInactive}`}
        onClick={() => onChipChange('ATTENDANCE')}
      >
        출결 문자
        <span>{stats.att}</span>
      </button>
    </div>
  )
}
