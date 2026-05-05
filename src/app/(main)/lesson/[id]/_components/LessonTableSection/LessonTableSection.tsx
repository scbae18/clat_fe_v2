'use client'

import { useMemo } from 'react'
import CheckIcon from '@/assets/icons/icon-check.svg'
import type { LessonStudent, Attendance, CompletionStatus } from '@/types/lessonStudent'
import type { LessonItemDetail } from '@/services/lesson'
import { cohortScoreMetric, joinScoreStorage, splitScoreStorage } from '@/lib/lessonScore'
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
  scoreHeaderMaxRowStyle,
  scoreHeaderMaxLabelStyle,
  scoreInputStyle,
  scoreInputNarrowStyle,
} from './LessonTable.css'

interface LessonTableSectionProps {
  students: LessonStudent[]
  templateItems: LessonItemDetail[]
  onChange: (students: LessonStudent[]) => void
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

function getScoreColumnMax(students: LessonStudent[], itemId: number): string {
  for (const s of students) {
    const v = s.items.find((i) => i.template_item_id === itemId)?.value ?? ''
    const { max } = splitScoreStorage(v)
    if (max) return max
  }
  return ''
}

function applyScoreMaxToAllStudents(
  students: LessonStudent[],
  itemId: number,
  maxStr: string
): LessonStudent[] {
  return students.map((s) => {
    const it = s.items.find((i) => i.template_item_id === itemId)
    const { earned } = splitScoreStorage(it?.value ?? '')
    return {
      ...s,
      items: s.items.map((i) =>
        i.template_item_id === itemId ? { ...i, value: joinScoreStorage(earned, maxStr) } : i
      ),
    }
  })
}

function ScoreEarnedCell({
  value,
  columnMax,
  onChange,
}: {
  value: string
  columnMax: string
  onChange: (v: string) => void
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
      placeholder={'\u2014'}
      aria-label={'\uC5BB\uC740 \uC810\uC218'}
    />
  )
}

const SCORE_STATS_EMPTY = '\uC785\uB825 \uC2DC \uD3C9\uADE0\u00B7\uCD5C\uACE0 \uD45C\uC2DC'

function formatScoreStats(avg: number, max: number, usePercent: boolean) {
  const unit = usePercent ? '%' : '\uC810'
  return (
    '\uD3C9\uADE0 ' +
    avg.toFixed(1) +
    unit +
    ' \u00B7 \uCD5C\uACE0 ' +
    String(Math.round(max * 10) / 10) +
    unit
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
    const m = new Map<number, { avg: number; max: number; usePercent: boolean } | null>()
    for (const item of dynamicItems) {
      if (!isScoreItem(item)) continue
      const nums: number[] = []
      let withSlash = 0
      let withoutSlash = 0
      for (const s of students) {
        const v = s.items.find((i) => i.template_item_id === item.id)?.value ?? ''
        const raw = String(v).trim()
        if (!raw) continue
        if (raw.includes('/')) withSlash++
        else withoutSlash++
        const n = cohortScoreMetric(v)
        if (n !== null) nums.push(n)
      }
      if (nums.length === 0) m.set(item.id, null)
      else if (withSlash > 0 && withoutSlash > 0) m.set(item.id, null)
      else
        m.set(item.id, {
          max: Math.max(...nums),
          avg: nums.reduce((a, b) => a + b, 0) / nums.length,
          usePercent: withSlash > 0,
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
            ? {
                ...item,
                value,
                is_completed: is_completed === undefined ? item.is_completed : is_completed,
              }
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
                      {stats
                        ? formatScoreStats(stats.avg, stats.max, stats.usePercent)
                        : SCORE_STATS_EMPTY}
                    </span>
                    <div className={scoreHeaderMaxRowStyle}>
                      <span className={scoreHeaderMaxLabelStyle}>{'\uB9CC\uC810'}</span>
                      <input
                        className={scoreInputNarrowStyle}
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        value={getScoreColumnMax(students, item.id)}
                        onChange={(ev) =>
                          onChange(applyScoreMaxToAllStudents(students, item.id, ev.target.value))
                        }
                        placeholder={'\uC804\uCCB4 \uACF5\uC6A9'}
                        aria-label={'\uC774 \uD56D\uBAA9 \uB9CC\uC810'}
                      />
                    </div>
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
                const colMax = getScoreColumnMax(students, item.id)
                return (
                  <td key={item.id} className={tdShrinkStyle}>
                    <ScoreEarnedCell
                      value={studentItem?.value ?? ''}
                      columnMax={colMax}
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
