'use client'

import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import UsersIcon from '@/assets/icons/icon-users.svg'
import StudentNameSearchBar, {
  emptyStateIconStyle,
  emptyStateStyle,
} from '@/components/common/StudentNameSearchBar'
import type { LessonStudent, Attendance, CompletionStatus } from '@/types/lessonStudent'
import type { LessonItemDetail, CreateLessonAdhocItemBody } from '@/services/lesson'
import AddItemForm from '@/app/(main)/template/_components/AddItemForm/AddItemForm'
import Modal from '@/components/common/Modal'
import EnrollStudentsModal from '@/components/student/EnrollStudentsModal/EnrollStudentsModal'
import useDisclosure from '@/hooks/useDisclosure'
import { lessonItemRef, matchesLessonItem } from '@/lib/lessonItemRef'
import type { ItemSource } from '@/lib/lessonItemRef'
import { isLessonStudentInputComplete } from '@/lib/lessonProgress'
import {
  tableStyle,
  tableWrapStyle,
  tdStyle,
  thCompactStyle,
  tdCompactStyle,
  tdShrinkStyle,
  nameCellStyle,
  addColumnCellStyle,
  addColumnButtonStyle,
  completeRowTdStyle,
} from './LessonTable.css'
import {
  AttendanceCell,
  CompletionCell,
  SelectCell,
  ScoreEarnedCell,
  TextInputCell,
} from './LessonTableCells'
import { DynamicColumnHeader } from './DynamicColumnHeader'
import { AttendanceColumnHeader } from './AttendanceColumnHeader'
import {
  getScoreColumnMax,
  getTdClassName,
  isScoreItem,
  mapFormToAdhocBody,
} from './lessonTableUtils'

interface LessonTableSectionProps {
  students: LessonStudent[]
  templateItems: LessonItemDetail[]
  extraAttendanceOptions?: Array<{ id: number; label: string }>
  onChange: (students: LessonStudent[]) => void
  onCellBlur?: (studentId: number, source: ItemSource, itemId: number) => void
  onAddItem?: (body: CreateLessonAdhocItemBody) => void | Promise<void>
  onRemoveColumn?: (item: LessonItemDetail) => void
  onTogglePartial?: (item: LessonItemDetail, isPartial: boolean) => void
  onAddStudents?: (studentIds: number[]) => void | Promise<void>
  onAddAttendanceOption?: (label: string) => void
  onRemoveAttendanceOption?: (optionId: number, label: string) => void
}

export default function LessonTable({
  students,
  templateItems,
  extraAttendanceOptions = [],
  onChange,
  onCellBlur,
  onAddItem,
  onRemoveColumn,
  onTogglePartial,
  onAddStudents,
  onAddAttendanceOption,
  onRemoveAttendanceOption,
}: LessonTableSectionProps) {
  const tableRef = useRef<HTMLTableElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [focusedStudentId, setFocusedStudentId] = useState<number | null>(null)
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const addStudentsModal = useDisclosure()

  const dynamicItems = useMemo(
    () => templateItems.filter((i) => !i.is_common && i.item_type !== 'ATTENDANCE'),
    [templateItems],
  )

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return students
    return students.filter((s) => s.name.toLowerCase().includes(query))
  }, [students, searchQuery])

  const partialItemRefs = useMemo(() => {
    const refs = new Set<string>()
    for (const item of templateItems) {
      if (item.is_partial) refs.add(lessonItemRef(item))
    }
    return refs
  }, [templateItems])

  const handleRowFocus = (studentId: number) => {
    setFocusedStudentId(studentId)
  }

  const handleTableBlur = (e: React.FocusEvent<HTMLTableElement>) => {
    if (tableRef.current?.contains(e.relatedTarget as Node)) return
    setFocusedStudentId(null)
  }

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
        onAddStudent={onAddStudents ? addStudentsModal.open : undefined}
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
                <AttendanceColumnHeader
                  extraOptions={extraAttendanceOptions}
                  allAttend={allAttend}
                  onToggleAllAttend={() => handleAllAttend(!allAttend)}
                  onAddOption={onAddAttendanceOption}
                  onRemoveOption={onRemoveAttendanceOption}
                />
                {dynamicItems.map((item) => (
                    <DynamicColumnHeader
                      key={lessonItemRef(item)}
                      item={item}
                      students={students}
                      onChange={onChange}
                      canRemove={onRemoveColumn != null}
                      onRemoveColumn={onRemoveColumn}
                      onTogglePartial={onTogglePartial}
                    />
                ))}
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
              {filteredStudents.map((student) => {
                const isComplete = isLessonStudentInputComplete(student, partialItemRefs)
                return (
                <tr key={student.id}>
                  <td className={getTdClassName(tdCompactStyle, student.id, focusedStudentId, isComplete)}>
                    <Link href={`/students/${student.id}`} className={nameCellStyle}>
                      {student.name}
                    </Link>
                  </td>
                  <td
                    className={getTdClassName(tdCompactStyle, student.id, focusedStudentId, isComplete)}
                    onMouseDown={() => handleRowFocus(student.id)}
                    onFocusCapture={() => handleRowFocus(student.id)}
                  >
                    <AttendanceCell
                      value={student.attendance}
                      extraLabels={extraAttendanceOptions.map((opt) => opt.label)}
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
                      isComplete,
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
                                studentItem?.value ?? '',
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
                  {onAddItem ? (
                    <td
                      className={
                        isComplete ? `${addColumnCellStyle} ${completeRowTdStyle}` : addColumnCellStyle
                      }
                    />
                  ) : null}
                </tr>
              )
              })}
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

      {onAddStudents ? (
        <EnrollStudentsModal
          isOpen={addStudentsModal.isOpen}
          onClose={addStudentsModal.close}
          currentStudentIds={students.map((s) => s.id)}
          onConfirm={(ids) => {
            void onAddStudents(ids)
          }}
        />
      ) : null}
    </div>
  )
}
