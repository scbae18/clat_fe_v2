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
import { cohortScoreMetric } from '@/lib/lessonScore'
import { lessonItemRef, matchesLessonItem } from '@/lib/lessonItemRef'
import type { ItemSource } from '@/lib/lessonItemRef'
import {
  tableStyle,
  tableWrapStyle,
  tdStyle,
  thCompactStyle,
  tdCompactStyle,
  thInnerStyle,
  checkboxLabelStyle,
  checkboxLabelActiveStyle,
  tdShrinkStyle,
  nameCellStyle,
  addColumnCellStyle,
  addColumnButtonStyle,
} from './LessonTable.css'
import {
  AttendanceCell,
  CompletionCell,
  SelectCell,
  ScoreEarnedCell,
  TextInputCell,
} from './LessonTableCells'
import { DynamicColumnHeader } from './DynamicColumnHeader'
import {
  getScoreColumnMax,
  getTdClassName,
  isScoreItem,
  mapFormToAdhocBody,
} from './lessonTableUtils'

interface LessonTableSectionProps {
  students: LessonStudent[]
  templateItems: LessonItemDetail[]
  onChange: (students: LessonStudent[]) => void
  onCellBlur?: (studentId: number, source: ItemSource, itemId: number) => void
  onAddItem?: (body: CreateLessonAdhocItemBody) => void | Promise<void>
  onRemoveColumn?: (item: LessonItemDetail) => void
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
    [templateItems],
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
    is_completed?: boolean | null,
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
            : row,
        )
        return { ...s, items }
      }),
    )
  }

  const allAttend =
    filteredStudents.length > 0 && filteredStudents.every((s) => s.attendance === '출석')
  const handleAllAttend = (checked: boolean) => {
    const visibleIds = new Set(filteredStudents.map((s) => s.id))
    onChange(
      students.map((s) =>
        visibleIds.has(s.id) ? { ...s, attendance: checked ? '출석' : null } : s,
      ),
    )
  }

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
        <div className={tableWrapStyle}>
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
                {dynamicItems.map((item) => {
                  const stats = isScoreItem(item)
                    ? (scoreStatsByItemId.get(lessonItemRef(item)) ?? null)
                    : null
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
                })}
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
                      focusedStudentId,
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
                          ? '완료'
                          : studentItem?.is_completed === false
                            ? '미완료'
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
                                v === '완료' ? true : v === '미완료' ? false : null,
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
        </div>
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
