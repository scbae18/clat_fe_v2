'use client'

import { useMemo } from 'react'
import CheckIcon from '@/assets/icons/icon-check.svg'
import type { LessonStudent, Attendance, CompletionStatus } from '@/types/lessonStudent'
import type { LessonItemDetail } from '@/services/lesson'
import {
  tableStyle,
  tdStyle,
  thCompactStyle,
  tdCompactStyle,
  thShrinkStyle,
  tdShrinkStyle,
  cellButtonGroupStyle,
  cellButtonRecipe,
  cellEditableStyle,
  nameCellStyle,
  thInnerStyle,
  checkboxLabelStyle,
  checkboxLabelActiveStyle,
  scoreColHeaderStyle,
  scoreColStatsStyle,
  scoreInputStyle,
} from './LessonTable.css'

interface LessonTableSectionProps {
  students: LessonStudent[]
  templateItems: LessonItemDetail[]
  onChange: (students: LessonStudent[]) => void
}

function parseLessonScore(raw: string): number | null {
  const t = String(raw).trim()
  if (!t) return null
  const n = parseFloat(t.replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : null
}

function isScoreItem(item: LessonItemDetail) {
  return item.item_type === 'SCORE' || item.item_type === 'NUMBER'
}

function AttendanceCell({
  value,
  onChange,
}: {
  value: Attendance
  onChange: (v: Attendance) => void
}) {
  return (
    <div className={cellButtonGroupStyle}>
      <button
        className={cellButtonRecipe({ variant: value === '출석' ? 'attend' : 'default' })}
        onClick={() => onChange(value === '출석' ? null : '출석')}
      >
        출석
      </button>
      <button
        className={cellButtonRecipe({ variant: value === '지각' ? 'late' : 'default' })}
        onClick={() => onChange(value === '지각' ? null : '지각')}
      >
        지각
      </button>
      <button
        className={cellButtonRecipe({ variant: value === '결석' ? 'absent' : 'default' })}
        onClick={() => onChange(value === '결석' ? null : '결석')}
      >
        결석
      </button>
    </div>
  )
}

function CompletionCell({
  value,
  onChange,
}: {
  value: CompletionStatus
  onChange: (v: CompletionStatus) => void
}) {
  return (
    <div className={cellButtonGroupStyle}>
      <button
        className={cellButtonRecipe({ variant: value === '\uC644\uB8CC' ? 'done' : 'default' })}
        onClick={() => onChange(value === '\uC644\uB8CC' ? null : '\uC644\uB8CC')}
      >
        {'\uC644\uB8CC'}
      </button>
      <button
        className={cellButtonRecipe({
          variant: value === '\uBBF8\uC644\uB8CC' ? 'undone' : 'default',
        })}
        onClick={() => onChange(value === '\uBBF8\uC644\uB8CC' ? null : '\uBBF8\uC644\uB8CC')}
      >
        {'\uBBF8\uC644\uB8CC'}
      </button>
    </div>
  )
}

function SelectCell({
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

function ScoreCell({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <input
      className={scoreInputStyle}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={'\u2014'}
      aria-label={'\uC810\uC218'}
    />
  )
}

const SCORE_STATS_EMPTY = '\uC785\uB825 \uC2DC \uD3C9\uADE0\u00B7\uCD5C\uACE0 \uD45C\uC2DC'

function formatScoreStats(avg: number, max: number) {
  return (
    '\uD3C9\uADE0 ' +
    avg.toFixed(1) +
    '\uC810 \u00B7 \uCD5C\uACE0 ' +
    String(Math.round(max)) +
    '\uC810'
  )
}

export default function LessonTable({
  students,
  templateItems,
  onChange,
}: LessonTableSectionProps) {
  const dynamicItems = useMemo(
    () => templateItems.filter((i) => !i.is_common && i.item_type !== 'ATTENDANCE'),
    [templateItems]
  )

  const scoreStatsByItemId = useMemo(() => {
    const m = new Map<number, { avg: number; max: number } | null>()
    for (const item of dynamicItems) {
      if (!isScoreItem(item)) continue
      const nums: number[] = []
      for (const s of students) {
        const v = s.items.find((i) => i.template_item_id === item.id)?.value ?? ''
        const n = parseLessonScore(v)
        if (n !== null) nums.push(n)
      }
      if (nums.length === 0) m.set(item.id, null)
      else
        m.set(item.id, {
          max: Math.max(...nums),
          avg: nums.reduce((a, b) => a + b, 0) / nums.length,
        })
    }
    return m
  }, [dynamicItems, students])

  const updateAttendance = (studentId: number, value: Attendance) => {
    onChange(students.map((s) => (s.id === studentId ? { ...s, attendance: value } : s)))
  }

  const updateItem = (
    studentId: number,
    templateItemId: number,
    value: string,
    is_completed?: boolean | null
  ) => {
    onChange(
      students.map((s) => {
        if (s.id !== studentId) return s
        const items = s.items.map((item) =>
          item.template_item_id === templateItemId
            ? { ...item, value, is_completed: is_completed ?? item.is_completed }
            : item
        )
        return { ...s, items }
      })
    )
  }

  const allAttend = students.every((s) => s.attendance === '출석')
  const handleAllAttend = (checked: boolean) => {
    onChange(students.map((s) => ({ ...s, attendance: checked ? '출석' : null })))
  }

  return (
    <table className={tableStyle}>
      <thead>
        <tr>
          <th className={thCompactStyle}>학생</th>
          <th className={thCompactStyle}>
            <div className={thInnerStyle}>
              출결
              <div
                className={`${checkboxLabelStyle}${allAttend ? ` ${checkboxLabelActiveStyle}` : ''}`}
                onClick={() => handleAllAttend(!allAttend)}
              >
                <CheckIcon width={14} height={14} />
                전체 출석
              </div>
            </div>
          </th>
          {dynamicItems.map((item) => {
            const isScore = isScoreItem(item)
            const stats = isScore ? scoreStatsByItemId.get(item.id) ?? null : null
            return (
              <th key={item.id} className={thShrinkStyle}>
                {isScore ? (
                  <div className={scoreColHeaderStyle}>
                    <span>{item.name}</span>
                    <span className={scoreColStatsStyle}>
                      {stats ? formatScoreStats(stats.avg, stats.max) : SCORE_STATS_EMPTY}
                    </span>
                  </div>
                ) : (
                  item.name
                )}
              </th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id}>
            <td className={tdCompactStyle}>
              <span className={nameCellStyle}>{student.name}</span>
            </td>
            <td className={tdCompactStyle}>
              <AttendanceCell
                value={student.attendance}
                onChange={(v) => updateAttendance(student.id, v)}
              />
            </td>
            {dynamicItems.map((item) => {
              const studentItem = student.items.find((i) => i.template_item_id === item.id)
              if (item.item_type === 'SELECT') {
                return (
                  <td key={item.id} className={tdShrinkStyle}>
                    <SelectCell
                      options={item.options ?? []}
                      value={studentItem?.value ?? ''}
                      onChange={(v) => updateItem(student.id, item.id, v)}
                    />
                  </td>
                )
              }

              if (item.item_type === 'COMPLETE') {
                const status: CompletionStatus =
                  studentItem?.is_completed === true
                    ? '\uC644\uB8CC'
                    : studentItem?.is_completed === false
                      ? '\uBBF8\uC644\uB8CC'
                      : null
                return (
                  <td key={item.id} className={tdShrinkStyle}>
                    <CompletionCell
                      value={status}
                      onChange={(v) =>
                        updateItem(
                          student.id,
                          item.id,
                          v ?? '',
                          v === '\uC644\uB8CC' ? true : v === '\uBBF8\uC644\uB8CC' ? false : null
                        )
                      }
                    />
                  </td>
                )
              }

              if (isScoreItem(item)) {
                return (
                  <td key={item.id} className={tdShrinkStyle}>
                    <ScoreCell
                      value={studentItem?.value ?? ''}
                      onChange={(v) => updateItem(student.id, item.id, v)}
                    />
                  </td>
                )
              }

              return (
                <td key={item.id} className={tdStyle}>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    className={cellEditableStyle}
                    onBlur={(e) =>
                      updateItem(student.id, item.id, e.currentTarget.textContent ?? '')
                    }
                    dangerouslySetInnerHTML={{ __html: studentItem?.value ?? '' }}
                  />
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
