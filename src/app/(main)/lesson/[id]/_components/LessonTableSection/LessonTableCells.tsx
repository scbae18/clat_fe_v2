'use client'

import type { Attendance, CompletionStatus } from '@/types/lessonStudent'
import { joinScoreStorage, splitScoreStorage } from '@/lib/lessonScore'
import { isCoreAttendanceLabel } from '@/lib/attendanceLabels'
import {
  cellButtonGroupStyle,
  cellButtonRecipe,
  extraCellButtonStyle,
  cellTextInputStyle,
  scoreInputStyle,
} from './LessonTable.css'

export function AttendanceCell({
  value,
  extraLabels = [],
  onChange,
}: {
  value: Attendance
  extraLabels?: string[]
  onChange: (v: Attendance) => void
}) {
  const extras = extraLabels.filter((label) => label && !isCoreAttendanceLabel(label))
  const orphan =
    value && !isCoreAttendanceLabel(value) && !extras.includes(value) ? value : null
  const extraButtons = orphan ? [...extras, orphan] : extras

  return (
    <div className={cellButtonGroupStyle}>
      <button
        type="button"
        className={cellButtonRecipe({ variant: value === '출석' ? 'attend' : 'default' })}
        onClick={() => onChange(value === '출석' ? null : '출석')}
      >
        출석
      </button>
      <button
        type="button"
        className={cellButtonRecipe({ variant: value === '지각' ? 'late' : 'default' })}
        onClick={() => onChange(value === '지각' ? null : '지각')}
      >
        지각
      </button>
      <button
        type="button"
        className={cellButtonRecipe({ variant: value === '결석' ? 'absent' : 'default' })}
        onClick={() => onChange(value === '결석' ? null : '결석')}
      >
        결석
      </button>
      {extraButtons.map((label) => (
        <button
          type="button"
          key={label}
          className={`${cellButtonRecipe({ variant: value === label ? 'extraOn' : 'default' })} ${extraCellButtonStyle}`}
          onClick={() => onChange(value === label ? null : label)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export function CompletionCell({
  value,
  onChange,
}: {
  value: CompletionStatus
  onChange: (v: CompletionStatus) => void
}) {
  return (
    <div className={cellButtonGroupStyle}>
      <button
        className={cellButtonRecipe({ variant: value === '완료' ? 'done' : 'default' })}
        onClick={() => onChange(value === '완료' ? null : '완료')}
      >
        완료
      </button>
      <button
        className={cellButtonRecipe({
          variant: value === '미완료' ? 'undone' : 'default',
        })}
        onClick={() => onChange(value === '미완료' ? null : '미완료')}
      >
        미완료
      </button>
    </div>
  )
}

export function SelectCell({
  options,
  value,
  onChange,
}: {
  options: { id: number; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className={cellButtonGroupStyle}>
      {options.map((opt) => (
        <button
          key={opt.id}
          className={cellButtonRecipe({ variant: value === opt.label ? 'attend' : 'default' })}
          onClick={() => onChange(value === opt.label ? '' : opt.label)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function ScoreEarnedCell({
  value,
  columnMax,
  onChange,
  onBlur,
}: {
  value: string
  columnMax: string
  onChange: (v: string) => void
  onBlur?: () => void
}) {
  const { earned } = splitScoreStorage(value)
  return (
    <input
      className={scoreInputStyle}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={earned}
      onChange={(ev) => onChange(joinScoreStorage(ev.target.value, columnMax))}
      onBlur={() => onBlur?.()}
      placeholder="—"
      aria-label="얻은 점수"
    />
  )
}

export function TextInputCell({
  value,
  onChange,
  onBlur,
}: {
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
}) {
  return (
    <input
      className={cellTextInputStyle}
      type="text"
      autoComplete="off"
      value={value}
      onChange={(ev) => onChange(ev.target.value)}
      onBlur={() => onBlur?.()}
      placeholder="—"
    />
  )
}
