'use client'

import { ReactNode } from 'react'
import TrashIcon from '@/assets/icons/icon-trash.svg'
import { colors } from '@/styles/tokens/colors'
import type { Student } from '@/types/student'
import {
  tableStyle,
  trStyle,
  thStyle,
  tdStyle,
  completionCellStyle,
  progressTrackStyle,
  progressBarStyle,
  percentTextStyle,
  remainingTextStyle,
  deleteButtonStyle,
} from './StudentTable.css'

interface MiddleColumn {
  header: string
  render: (student: Student) => ReactNode
}

interface StudentTableProps {
  students: Student[]
  middleColumns: MiddleColumn[]
  onDelete: (id: number) => void
  onRowClick?: (id: number) => void
}

// 고정 컬럼 수: 학생, 학생 전화, 학부모 전화, 학교, 완료율
const FIXED_COLUMN_COUNT = 5

function getCellPaddingRight(totalColumns: number): number {
  if (totalColumns <= 5) return 44
  if (totalColumns <= 6) return 28
  return 16
}

function getProgressColor(rate: number, totalIncomplete: number): string {
  if (rate === 0 && totalIncomplete === 0) return colors.gray500
  if (rate >= 0.7) return colors.success500
  if (rate >= 0.4) return colors.warning500
  return colors.error500
}

export default function StudentTable({
  students,
  middleColumns,
  onDelete,
  onRowClick,
}: StudentTableProps) {
  const totalColumns = FIXED_COLUMN_COUNT + middleColumns.length
  const cellPaddingRight = getCellPaddingRight(totalColumns)

  return (
    <table
      className={tableStyle}
      style={{ '--cell-padding-right': `${cellPaddingRight}px` } as React.CSSProperties}
    >
      <colgroup>
        <col style={{ width: '120px' }} />
        <col style={{ width: '180px' }} />
        <col style={{ width: '180px' }} />
        {middleColumns.map((_, i) => (
          <col key={i} />
        ))}
        <col style={{ width: '120px' }} />
        <col style={{ width: '460px' }} />
      </colgroup>
      <thead>
        <tr>
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
          const color = getProgressColor(student.completion_rate, student.total_incomplete_items)
          return (
            <tr
              key={student.id}
              className={trStyle}
              onClick={() => onRowClick?.(student.id)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              <td className={tdStyle}>{student.name}</td>
              <td className={tdStyle}>{student.phone}</td>
              <td className={tdStyle}>{student.parent_phone}</td>
              {middleColumns.map((col) => (
                <td key={col.header} className={tdStyle}>
                  {col.render(student)}
                </td>
              ))}
              <td className={tdStyle}>{student.school_name ?? '-'}</td>
              <td className={tdStyle} style={{ padding: 0 }}>
                <div className={completionCellStyle}>
                  <div className={progressTrackStyle}>
                    <div
                      className={progressBarStyle}
                      style={{ width: `${student.completion_rate * 100}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className={percentTextStyle}>{student.completion_rate * 100}%</span>
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
                    className={deleteButtonStyle}
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
  )
}
