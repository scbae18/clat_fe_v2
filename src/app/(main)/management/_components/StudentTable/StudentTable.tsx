'use client'

import { ReactNode } from 'react'
import TrashIcon from '@/assets/icons/icon-trash.svg'
import { colors } from '@/styles/tokens/colors'
import type { Student } from '@/types/student'
import { formatCompletionRatePercent } from '@/lib/completionRate'
import { formatListLabel } from '@/lib/formatListLabel'
import {
  tableWrapStyle,
  tableStyle,
  tableAllStudentsStyle,
  tableClassDetailStyle,
  trStyle,
  thStyle,
  tdStyle,
  tdPhoneStyle,
  completionCellStyle,
  progressTrackStyle,
  progressBarStyle,
  percentTextStyle,
  remainingTextStyle,
  deleteButtonStyle,
  checkboxCellStyle,
  checkboxStyle,
} from './StudentTable.css'

interface MiddleColumn {
  header: string
  render: (student: Student) => ReactNode
  getTitle?: (student: Student) => string
}

interface StudentTableProps {
  students: Student[]
  middleColumns: MiddleColumn[]
  onDelete: (id: number) => void
  onRowClick?: (id: number) => void
  selectable?: boolean
  selectedIds?: number[]
  onToggleSelect?: (id: number) => void
  onToggleSelectAll?: () => void
}

const FIXED_COLUMN_COUNT = 5

function getCellPaddingRight(totalColumns: number): number {
  if (totalColumns <= 5) return 44
  if (totalColumns <= 6) return 28
  return 16
}

function getProgressColor(rate: number, totalIncomplete: number): string {
  if (totalIncomplete === 0) return colors.success500
  if (rate >= 0.7) return colors.success500
  if (rate >= 0.4) return colors.warning500
  return colors.error500
}

type ColumnWidth = { key: string; width: string }

function getColumnWidths(hasMiddle: boolean): ColumnWidth[] {
  if (hasMiddle) {
    return [
      { key: 'name', width: '110px' },
      { key: 'phone', width: '140px' },
      { key: 'parentPhone', width: '140px' },
      { key: 'classes', width: '200px' },
      { key: 'school', width: '180px' },
      { key: 'completion', width: '300px' },
    ]
  }
  return [
    { key: 'name', width: '120px' },
    { key: 'phone', width: '140px' },
    { key: 'parentPhone', width: '140px' },
    { key: 'school', width: '200px' },
    { key: 'completion', width: '300px' },
  ]
}

export default function StudentTable({
  students,
  middleColumns,
  onDelete,
  onRowClick,
  selectable = false,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
}: StudentTableProps) {
  const hasMiddle = middleColumns.length > 0
  const totalColumns = FIXED_COLUMN_COUNT + middleColumns.length + (selectable ? 1 : 0)
  const cellPaddingRight = getCellPaddingRight(totalColumns)
  const columnWidths = getColumnWidths(hasMiddle)
  const allSelected = selectable && students.length > 0 && selectedIds.length === students.length
  const someSelected = selectable && selectedIds.length > 0 && !allSelected

  return (
    <div className={tableWrapStyle}>
      <table
        className={`${tableStyle} ${hasMiddle ? tableAllStudentsStyle : tableClassDetailStyle}`}
        style={{ '--cell-padding-right': `${cellPaddingRight}px` } as React.CSSProperties}
      >
        <colgroup>
          {selectable && <col style={{ width: '44px' }} />}
          {columnWidths.map((col) => (
            <col key={col.key} style={{ width: col.width }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {selectable && (
              <th className={thStyle}>
                <input
                  type="checkbox"
                  className={checkboxStyle}
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected
                  }}
                  aria-label="전체 선택"
                  onChange={() => onToggleSelectAll?.()}
                />
              </th>
            )}
            <th className={thStyle}>학생</th>
            <th className={thStyle}>학생 전화</th>
            <th className={thStyle}>학부모 전화</th>
            {middleColumns.map((col) => (
              <th key={col.header} className={thStyle}>
                {col.header}
              </th>
            ))}
            <th className={thStyle}>학교</th>
            <th className={thStyle}>완료율</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const completionPct = formatCompletionRatePercent(student.completion_rate)
            const color = getProgressColor(student.completion_rate, student.total_incomplete_items)
            const school = student.school_name?.trim() || '-'
            return (
              <tr
                key={student.id}
                className={trStyle}
                onClick={() => onRowClick?.(student.id)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {selectable && (
                  <td className={checkboxCellStyle}>
                    <input
                      type="checkbox"
                      className={checkboxStyle}
                      checked={selectedIds.includes(student.id)}
                      aria-label={`${student.name} 선택`}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => onToggleSelect?.(student.id)}
                    />
                  </td>
                )}
                <td className={tdStyle} title={student.name}>
                  {student.name}
                </td>
                <td className={tdPhoneStyle} title={student.phone}>
                  {student.phone}
                </td>
                <td className={tdPhoneStyle} title={student.parent_phone}>
                  {student.parent_phone}
                </td>
                {middleColumns.map((col) => {
                  const title = col.getTitle?.(student)
                  return (
                    <td key={col.header} className={tdStyle} title={title}>
                      {col.render(student)}
                    </td>
                  )
                })}
                <td className={tdStyle} title={school}>
                  {school}
                </td>
                <td style={{ padding: 0 }}>
                  <div className={completionCellStyle}>
                    <div className={progressTrackStyle}>
                      <div
                        className={progressBarStyle}
                        style={{ width: `${completionPct}%`, backgroundColor: color }}
                      />
                    </div>
                    <span className={percentTextStyle}>{completionPct}%</span>
                    <span className={remainingTextStyle} style={{ color }}>
                      {student.completion_rate === 1
                        ? '모두 완료'
                        : student.total_incomplete_items == null
                          ? '-'
                          : student.total_incomplete_items === 0
                            ? null
                            : `${student.total_incomplete_items}개 남음`}
                    </span>
                    <button
                      type="button"
                      className={deleteButtonStyle}
                      aria-label={`${student.name} 학생 삭제`}
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(student.id)
                      }}
                    >
                      <TrashIcon width={20} height={20} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function renderStudentClasses(student: Student) {
  const { display, full } = formatListLabel(student.classes.map((c) => c.name))
  return display
}

export function studentClassesTitle(student: Student) {
  return formatListLabel(student.classes.map((c) => c.name)).full
}
