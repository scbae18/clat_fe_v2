'use client'

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import type { LessonStudent } from '@/types/lessonStudent'
import type { LessonItemDetail } from '@/services/lesson'
import {
  dynamicColThStyle,
  dynamicColThTopStyle,
  scoreColHeaderStyle,
  scoreHeaderMaxRowStyle,
  scoreHeaderFieldGroupStyle,
  scoreHeaderMaxLabelStyle,
  scoreHeaderMaxSuffixStyle,
  scoreHeaderAvgValueStyle,
  scoreInputMaxStyle,
  completeColHeaderStyle,
  completeHeaderNoteInputStyle,
  colHeaderWrapStyle,
  colHeaderActionsStyle,
  colHeaderNameStyle,
  itemControlButtonStyle,
  partialChipRecipe,
  partialTooltipStyle,
} from './LessonTable.css'
import {
  applyScoreMaxToAllStudents,
  applyScoreNoteToAllStudents,
  applyCompleteNoteToAllStudents,
  formatScoreColumnMetric,
  getScoreColumnAverage,
  getScoreColumnMax,
  getScoreColumnNote,
  getCompleteColumnNote,
  isScoreItem,
  isCompleteItem,
} from './lessonTableUtils'
import { canMarkLessonItemPartial } from '@/lib/lessonProgress'

const PARTIAL_TIP = '입력되지 않은 학생의 문자에 포함되지 않습니다'
const NOTE_TIP = '항목에 대한 설명을 작성하고 알림톡에도 포함됩니다.'

interface DynamicColumnHeaderProps {
  item: LessonItemDetail
  students: LessonStudent[]
  onChange: (students: LessonStudent[]) => void
  canRemove: boolean
  onRemoveColumn?: (item: LessonItemDetail) => void
  onTogglePartial?: (item: LessonItemDetail, isPartial: boolean) => void
}

function HeaderChip({
  label,
  pressed,
  tip,
  ariaLabel,
  onClick,
  onMouseDown,
}: {
  label: string
  pressed: boolean
  tip: string
  ariaLabel: string
  onClick: () => void
  onMouseDown?: (ev: MouseEvent<HTMLButtonElement>) => void
}) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const updatePos = () => {
    const el = buttonRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPos({ x: rect.left + rect.width / 2, y: rect.top })
  }

  const show = () => {
    updatePos()
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const onMove = () => updatePos()
    window.addEventListener('scroll', onMove, true)
    window.addEventListener('resize', onMove)
    return () => {
      window.removeEventListener('scroll', onMove, true)
      window.removeEventListener('resize', onMove)
    }
  }, [open])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={partialChipRecipe({ on: pressed })}
        aria-pressed={pressed}
        aria-label={ariaLabel}
        onMouseEnter={show}
        onMouseLeave={() => setOpen(false)}
        onFocus={show}
        onBlur={() => setOpen(false)}
        onMouseDown={onMouseDown}
        onClick={onClick}
      >
        {label}
      </button>
      {open
        ? createPortal(
            <span
              className={partialTooltipStyle}
              role="tooltip"
              style={
                {
                  '--partial-tooltip-x': `${pos.x}px`,
                  '--partial-tooltip-y': `${pos.y}px`,
                } as CSSProperties
              }
            >
              {tip}
            </span>,
            document.body,
          )
        : null}
    </>
  )
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
  const columnNote = isComplete
    ? getCompleteColumnNote(students, item)
    : isScore
      ? getScoreColumnNote(students, item)
      : ''
  const [columnNoteOpen, setColumnNoteOpen] = useState(false)
  const columnNoteInputRef = useRef<HTMLInputElement>(null)
  const showColumnNote = (isComplete || isScore) && (columnNoteOpen || columnNote.trim() !== '')
  const isTallHeader = isScore || showColumnNote

  useEffect(() => {
    if (!columnNoteOpen) return
    columnNoteInputRef.current?.focus()
  }, [columnNoteOpen])

  const titleRow = (
    <div className={colHeaderWrapStyle}>
      <span className={colHeaderNameStyle}>{item.name}</span>
      {isComplete || isScore ? (
        <HeaderChip
          label="내용입력"
          pressed={showColumnNote}
          tip={NOTE_TIP}
          ariaLabel={`${item.name} 내용입력. ${NOTE_TIP}`}
          onMouseDown={(ev) => ev.preventDefault()}
          onClick={() => {
            if (columnNoteOpen && columnNote.trim() === '') {
              setColumnNoteOpen(false)
              return
            }
            setColumnNoteOpen(true)
          }}
        />
      ) : null}
      <div className={colHeaderActionsStyle}>
        {showPartial && onTogglePartial ? (
          <HeaderChip
            label="일부입력"
            pressed={isPartial}
            tip={PARTIAL_TIP}
            ariaLabel={`${item.name} 일부입력. ${PARTIAL_TIP}`}
            onClick={() => onTogglePartial(item, !isPartial)}
          />
        ) : null}
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
    </div>
  )

  return (
    <th className={isTallHeader ? `${dynamicColThStyle} ${dynamicColThTopStyle}` : dynamicColThStyle}>
      {isScore ? (
        <div className={scoreColHeaderStyle}>
          {titleRow}
          <div className={scoreHeaderMaxRowStyle}>
            <span className={scoreHeaderFieldGroupStyle}>
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
            </span>
            <span className={scoreHeaderFieldGroupStyle}>
              <span className={scoreHeaderMaxLabelStyle}>평균</span>
              <span className={scoreHeaderAvgValueStyle}>
                {formatScoreColumnMetric(getScoreColumnAverage(students, item))}
              </span>
            </span>
          </div>
          {showColumnNote ? (
            <div className={scoreHeaderMaxRowStyle}>
              <input
                ref={columnNoteInputRef}
                className={completeHeaderNoteInputStyle}
                type="text"
                autoComplete="off"
                value={columnNote}
                onChange={(ev) =>
                  onChange(applyScoreNoteToAllStudents(students, item, ev.target.value))
                }
                onKeyDown={(ev) => {
                  ev.stopPropagation()
                  if (ev.key === 'Escape') {
                    ev.preventDefault()
                    if (columnNote.trim() === '') setColumnNoteOpen(false)
                  }
                }}
                onBlur={() => {
                  if (columnNote.trim() === '') setColumnNoteOpen(false)
                }}
                placeholder="선택"
                aria-label={`${item.name} 내용`}
              />
            </div>
          ) : null}
        </div>
      ) : isComplete ? (
        <div className={completeColHeaderStyle}>
          {titleRow}
          {showColumnNote ? (
            <div className={scoreHeaderMaxRowStyle}>
              <input
                ref={columnNoteInputRef}
                className={completeHeaderNoteInputStyle}
                type="text"
                autoComplete="off"
                value={columnNote}
                onChange={(ev) =>
                  onChange(applyCompleteNoteToAllStudents(students, item, ev.target.value))
                }
                onKeyDown={(ev) => {
                  ev.stopPropagation()
                  if (ev.key === 'Escape') {
                    ev.preventDefault()
                    if (columnNote.trim() === '') setColumnNoteOpen(false)
                  }
                }}
                onBlur={() => {
                  if (columnNote.trim() === '') setColumnNoteOpen(false)
                }}
                placeholder="선택"
                aria-label={`${item.name} 내용`}
              />
            </div>
          ) : null}
        </div>
      ) : (
        titleRow
      )}
    </th>
  )
}
