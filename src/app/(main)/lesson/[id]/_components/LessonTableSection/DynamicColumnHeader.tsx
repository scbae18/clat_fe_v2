'use client'

import type { LessonStudent } from '@/types/lessonStudent'
import type { LessonItemDetail } from '@/services/lesson'
import {
  thShrinkStyle,
  scoreColHeaderStyle,
  scoreHeaderMaxRowStyle,
  scoreHeaderMaxLabelStyle,
  scoreHeaderMaxSuffixStyle,
  scoreInputMaxStyle,
  completeHeaderNoteInputStyle,
  colHeaderWrapStyle,
  colHeaderTitleBlockStyle,
  itemControlButtonStyle,
  partialChipRecipe,
} from './LessonTable.css'
import {
  applyScoreMaxToAllStudents,
  applyCompleteNoteToAllStudents,
  getScoreColumnMax,
  getCompleteColumnNote,
  isScoreItem,
  isCompleteItem,
} from './lessonTableUtils'
import { canMarkLessonItemPartial } from '@/lib/lessonProgress'

interface DynamicColumnHeaderProps {
  item: LessonItemDetail
  students: LessonStudent[]
  onChange: (students: LessonStudent[]) => void
  canRemove: boolean
  onRemoveColumn?: (item: LessonItemDetail) => void
  onTogglePartial?: (item: LessonItemDetail, isPartial: boolean) => void
}

export function DynamicColumnHeader({
  item,
  students,
  onChange,
  canRemove,
  onRemoveColumn,
  onTogglePartial,
}: DynamicColumnHeaderProps) {
  const isScore = isScoreItem(item)
  const isComplete = isCompleteItem(item)
  const showPartial = canMarkLessonItemPartial(item) && onTogglePartial != null
  const isPartial = item.is_partial === true

  const titleRow = (
    <div className={colHeaderWrapStyle}>
      <div className={colHeaderTitleBlockStyle}>
        <span>{item.name}</span>
        {showPartial ? (
          <button
            type="button"
            className={partialChipRecipe({ on: isPartial })}
            aria-pressed={isPartial}
            aria-label={`${item.name} 일부입력`}
            onClick={() => onTogglePartial?.(item, !isPartial)}
          >
            일부입력
          </button>
        ) : null}
      </div>
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
      ) : isComplete ? (
        <div className={scoreColHeaderStyle}>
          {titleRow}
          <div className={scoreHeaderMaxRowStyle}>
            <span className={scoreHeaderMaxLabelStyle}>내용</span>
            <input
              className={completeHeaderNoteInputStyle}
              type="text"
              autoComplete="off"
              value={getCompleteColumnNote(students, item)}
              onChange={(ev) =>
                onChange(applyCompleteNoteToAllStudents(students, item, ev.target.value))
              }
              placeholder="선택"
              aria-label={`${item.name} 내용`}
            />
          </div>
        </div>
      ) : (
        titleRow
      )}
    </th>
  )
}
