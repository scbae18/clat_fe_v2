'use client'

import type { LessonStudent } from '@/types/lessonStudent'
import type { LessonItemDetail } from '@/services/lesson'
import {
  thShrinkStyle,
  scoreColHeaderStyle,
  scoreColStatsStyle,
  scoreHeaderMaxRowStyle,
  scoreHeaderMaxLabelStyle,
  scoreHeaderMaxSuffixStyle,
  scoreInputMaxStyle,
  colHeaderWrapStyle,
  itemControlButtonStyle,
} from './LessonTable.css'
import {
  applyScoreMaxToAllStudents,
  formatScoreStats,
  getScoreColumnMax,
  isScoreItem,
  SCORE_STATS_EMPTY,
} from './lessonTableUtils'

interface DynamicColumnHeaderProps {
  item: LessonItemDetail
  students: LessonStudent[]
  onChange: (students: LessonStudent[]) => void
  stats: { avg: number; max: number } | null | undefined
  canRemove: boolean
  onRemoveColumn?: (item: LessonItemDetail) => void
}

export function DynamicColumnHeader({
  item,
  students,
  onChange,
  stats,
  canRemove,
  onRemoveColumn,
}: DynamicColumnHeaderProps) {
  const isScore = isScoreItem(item)

  const titleRow = (
    <div className={colHeaderWrapStyle}>
      <span>{item.name}</span>
      {canRemove ? (
        <button
          type="button"
          className={itemControlButtonStyle}
          aria-label={`${item.name} 항목 제거`}
          onClick={() => onRemoveColumn?.(item)}
        >
          ×
        </button>
      ) : null}
    </div>
  )

  return (
    <th className={thShrinkStyle}>
      {isScore ? (
        <div className={scoreColHeaderStyle}>
          {titleRow}
          <span className={scoreColStatsStyle}>
            {stats ? formatScoreStats(stats.avg, stats.max) : SCORE_STATS_EMPTY}
          </span>
          <div className={scoreHeaderMaxRowStyle}>
            <span className={scoreHeaderMaxLabelStyle}>만점</span>
            <input
              className={scoreInputMaxStyle}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={getScoreColumnMax(students, item)}
              onChange={(ev) =>
                onChange(applyScoreMaxToAllStudents(students, item, ev.target.value))
              }
              placeholder="100"
              aria-label="이 항목 만점"
            />
            <span className={scoreHeaderMaxSuffixStyle} aria-hidden>
              점
            </span>
          </div>
        </div>
      ) : (
        titleRow
      )}
    </th>
  )
}
