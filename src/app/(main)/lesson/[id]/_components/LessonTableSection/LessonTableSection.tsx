'use client'

import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import CheckIcon from '@/assets/icons/icon-check.svg'
import UsersIcon from '@/assets/icons/icon-users.svg'
import StudentNameSearchBar, {
  emptyStateIconStyle,
  emptyStateStyle,
} from '@/components/common/StudentNameSearchBar'
import type { LessonStudent, Attendance, CompletionStatus } from '@/types/lessonStudent'
import type { LessonItemDetail, CreateLessonAdhocItemBody } from '@/services/lesson'
import AddItemForm from '@/app/(main)/template/_components/AddItemForm/AddItemForm'
import Modal from '@/components/common/Modal'
import { cohortScoreMetric, joinScoreStorage, splitScoreStorage } from '@/lib/lessonScore'
import { lessonItemRef, matchesLessonItem } from '@/lib/lessonItemRef'
import type { ItemSource } from '@/lib/lessonItemRef'
import {
  tableStyle,
  tdStyle,
  thCompactStyle,
  tdCompactStyle,
  thShrinkStyle,
  tdShrinkStyle,
  cellButtonGroupStyle,
  cellButtonRecipe,
  cellTextInputStyle,
  nameCellStyle,
  thInnerStyle,
  checkboxLabelStyle,
  checkboxLabelActiveStyle,
  scoreColHeaderStyle,
  scoreColStatsStyle,
  scoreHeaderMaxRowStyle,
  scoreHeaderMaxLabelStyle,
  scoreHeaderMaxSuffixStyle,
  scoreInputStyle,
  scoreInputMaxStyle,
  activeRowTdStyle,
  colHeaderWrapStyle,
  itemControlButtonStyle,
  addColumnCellStyle,
  addColumnButtonStyle,
} from './LessonTable.css'

interface LessonTableSectionProps {
  students: LessonStudent[]
  templateItems: LessonItemDetail[]
  onChange: (students: LessonStudent[]) => void
  onCellBlur?: (studentId: number, source: ItemSource, itemId: number) => void
  onAddItem?: (body: CreateLessonAdhocItemBody) => void | Promise<void>
  onRemoveColumn?: (item: LessonItemDetail) => void
}

function mapFormToAdhocBody(
  label: string,
  type: string,
  choices?: string[],
): CreateLessonAdhocItemBody {
  const itemTypeMap = {
    number: 'SCORE',
    text: 'TEXT',
    choice: 'SELECT',
    completion: 'COMPLETE',
  } as const

  const body: CreateLessonAdhocItemBody = {
    name: label,
    is_common: false,
    item_type: itemTypeMap[type as keyof typeof itemTypeMap] ?? 'TEXT',
  }

  if (type === 'choice' && choices?.length) {
    body.options = choices
  }

  return body
}

function isScoreItem(item: LessonItemDetail) {
  return item.item_type === 'SCORE' || item.item_type === 'NUMBER'
}

function getTdClassName(base: string, studentId: number, focusedStudentId: number | null) {
  return focusedStudentId === studentId ? `${base} ${activeRowTdStyle}` : base
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

function getScoreColumnMax(students: LessonStudent[], item: LessonItemDetail): string {
  for (const s of students) {
    const v = s.items.find((i) => matchesLessonItem(i, item))?.value ?? ''
    const { max } = splitScoreStorage(v)
    if (max) return max
  }
  return ''
}

function applyScoreMaxToAllStudents(
  students: LessonStudent[],
  item: LessonItemDetail,
  maxStr: string
): LessonStudent[] {
  return students.map((s) => {
    const it = s.items.find((i) => matchesLessonItem(i, item))
    const { earned } = splitScoreStorage(it?.value ?? '')
    return {
      ...s,
      items: s.items.map((i) =>
        matchesLessonItem(i, item) ? { ...i, value: joinScoreStorage(earned, maxStr) } : i
      ),
    }
  })
}

function ScoreEarnedCell({
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
      placeholder={'\u2014'}
      aria-label={'\uC5BB\uC740 \uC810\uC218'}
    />
  )
}

function TextInputCell({
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
      placeholder={'\u2014'}
    />
  )
}

const SCORE_STATS_EMPTY = '\uC785\uB825 \uC2DC \uD3C9\uADE0\u00B7\uCD5C\uACE0 \uD45C\uC2DC'

function formatScoreStats(avg: number, max: number) {
  return (
    '\uD3C9\uADE0 ' +
    avg.toFixed(1) +
    '\uC810' +
    ' \u00B7 \uCD5C\uACE0 ' +
    String(Math.round(max * 10) / 10) +
    '\uC810'
  )
}

interface DynamicColumnHeaderProps {
  item: LessonItemDetail
  students: LessonStudent[]
  onChange: (students: LessonStudent[]) => void
  stats: { avg: number; max: number } | null | undefined
  canRemove: boolean
  onRemoveColumn?: (item: LessonItemDetail) => void
}

function DynamicColumnHeader({
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

export default function LessonTable({
  students,
  templateItems,
  onChange,
  onCellBlur,
  onAddItem,
  onRemoveColumn,
}: LessonTableSectionProps) {
  const tableRef = useRef<HTMLTableElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [focusedStudentId, setFocusedStudentId] = useState<number | null>(null)
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)

  const dynamicItems = useMemo(
    () => templateItems.filter((i) => !i.is_common && i.item_type !== 'ATTENDANCE'),
    [templateItems]
  )

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return students
    return students.filter((s) => s.name.toLowerCase().includes(query))
  }, [students, searchQuery])

  const handleRowFocus = (studentId: number) => {
    setFocusedStudentId(studentId)
  }

  const handleTableBlur = (e: React.FocusEvent<HTMLTableElement>) => {
    if (tableRef.current?.contains(e.relatedTarget as Node)) return
    setFocusedStudentId(null)
  }

  const scoreStatsByItemId = useMemo(() => {
    const m = new Map<string, { avg: number; max: number } | null>()
    for (const item of dynamicItems) {
      if (!isScoreItem(item)) continue
      const key = lessonItemRef(item)
      const nums: number[] = []
      let withSlash = 0
      let withoutSlash = 0
      for (const s of filteredStudents) {
        const v = s.items.find((i) => matchesLessonItem(i, item))?.value ?? ''
        const raw = String(v).trim()
        if (!raw) continue
        if (raw.includes('/')) withSlash++
        else withoutSlash++
        const n = cohortScoreMetric(v)
        if (n !== null) nums.push(n)
      }
      if (nums.length === 0) m.set(key, null)
      else if (withSlash > 0 && withoutSlash > 0) m.set(key, null)
      else
        m.set(key, {
          max: Math.max(...nums),
          avg: nums.reduce((a, b) => a + b, 0) / nums.length,
        })
    }
    return m
  }, [dynamicItems, filteredStudents])

  const updateAttendance = (studentId: number, value: Attendance) => {
    onChange(students.map((s) => (s.id === studentId ? { ...s, attendance: value } : s)))
  }

  const updateItem = (
    studentId: number,
    item: LessonItemDetail,
    value: string,
    is_completed?: boolean | null
  ) => {
    onChange(
      students.map((s) => {
        if (s.id !== studentId) return s
        const items = s.items.map((row) =>
          matchesLessonItem(row, item)
            ? {
                ...row,
                value,
                is_completed: is_completed === undefined ? row.is_completed : is_completed,
              }
            : row
        )
        return { ...s, items }
      })
    )
  }

  const allAttend =
    filteredStudents.length > 0 && filteredStudents.every((s) => s.attendance === '출석')
  const handleAllAttend = (checked: boolean) => {
    const visibleIds = new Set(filteredStudents.map((s) => s.id))
    onChange(
      students.map((s) =>
        visibleIds.has(s.id) ? { ...s, attendance: checked ? '출석' : null } : s
      )
    )
  }

  const renderDynamicHeaders = () =>
    dynamicItems.map((item) => {
      const stats = isScoreItem(item) ? scoreStatsByItemId.get(lessonItemRef(item)) ?? null : null
      return (
        <DynamicColumnHeader
          key={lessonItemRef(item)}
          item={item}
          students={students}
          onChange={onChange}
          stats={stats}
          canRemove={onRemoveColumn != null}
          onRemoveColumn={onRemoveColumn}
        />
      )
    })

  return (
    <div>
      <StudentNameSearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        totalCount={students.length}
        filteredCount={filteredStudents.length}
      />

      {filteredStudents.length === 0 ? (
        <div className={emptyStateStyle} role="status">
          <UsersIcon width={24} height={24} className={emptyStateIconStyle} aria-hidden />
          <span>검색 결과가 없어요.</span>
        </div>
      ) : (
        <table ref={tableRef} className={tableStyle} onBlur={handleTableBlur}>
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
              {renderDynamicHeaders()}
              {onAddItem ? (
                <th className={addColumnCellStyle}>
                  <button
                    type="button"
                    className={addColumnButtonStyle}
                    aria-label="개별 항목 추가"
                    onClick={() => setIsAddFormOpen(true)}
                  >
                    +
                  </button>
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td className={getTdClassName(tdCompactStyle, student.id, focusedStudentId)}>
                  <Link href={`/students/${student.id}`} className={nameCellStyle}>
                    {student.name}
                  </Link>
                </td>
                <td
                  className={getTdClassName(tdCompactStyle, student.id, focusedStudentId)}
                  onMouseDown={() => handleRowFocus(student.id)}
                  onFocusCapture={() => handleRowFocus(student.id)}
                >
                  <AttendanceCell
                    value={student.attendance}
                    onChange={(v) => updateAttendance(student.id, v)}
                  />
                </td>
                {dynamicItems.map((item) => {
                  const studentItem = student.items.find((i) => matchesLessonItem(i, item))
                  const tdClass = getTdClassName(
                    item.item_type === 'SELECT' ||
                      item.item_type === 'COMPLETE' ||
                      isScoreItem(item)
                      ? tdShrinkStyle
                      : tdStyle,
                    student.id,
                    focusedStudentId
                  )
                  const focusHandlers = {
                    onMouseDown: () => handleRowFocus(student.id),
                    onFocusCapture: () => handleRowFocus(student.id),
                  }
                  const handleCellBlur = () =>
                    onCellBlur?.(student.id, item.source ?? 'template', item.id)
                  if (item.item_type === 'SELECT') {
                    return (
                      <td key={lessonItemRef(item)} className={tdClass} {...focusHandlers}>
                        <SelectCell
                          options={item.options ?? []}
                          value={studentItem?.value ?? ''}
                          onChange={(v) => updateItem(student.id, item, v)}
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
                      <td key={lessonItemRef(item)} className={tdClass} {...focusHandlers}>
                        <CompletionCell
                          value={status}
                          onChange={(v) =>
                            updateItem(
                              student.id,
                              item,
                              v ?? '',
                              v === '\uC644\uB8CC' ? true : v === '\uBBF8\uC644\uB8CC' ? false : null
                            )
                          }
                        />
                      </td>
                    )
                  }

                  if (isScoreItem(item)) {
                    const colMax = getScoreColumnMax(students, item)
                    return (
                      <td key={lessonItemRef(item)} className={tdClass} {...focusHandlers}>
                        <ScoreEarnedCell
                          value={studentItem?.value ?? ''}
                          columnMax={colMax}
                          onChange={(v) => updateItem(student.id, item, v)}
                          onBlur={handleCellBlur}
                        />
                      </td>
                    )
                  }

                  return (
                    <td key={lessonItemRef(item)} className={tdClass} {...focusHandlers}>
                      <TextInputCell
                        value={studentItem?.value ?? ''}
                        onChange={(v) => updateItem(student.id, item, v)}
                        onBlur={handleCellBlur}
                      />
                    </td>
                  )
                })}
                {onAddItem ? <td className={addColumnCellStyle} /> : null}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {onAddItem ? (
        <Modal isOpen={isAddFormOpen} onClose={() => setIsAddFormOpen(false)} size="md">
          <AddItemForm
            onAdd={(label, type, choices) => {
              void Promise.resolve(onAddItem(mapFormToAdhocBody(label, type, choices)))
                .then(() => {
                  setIsAddFormOpen(false)
                })
                .catch(() => {
                  /* addAdhocItem shows error toast */
                })
            }}
            onCancel={() => setIsAddFormOpen(false)}
          />
        </Modal>
      ) : null}
    </div>
  )
}
