'use client'

import { ReactNode } from 'react'
import TrashIcon from '@/assets/icons/icon-trash.svg'
import { colors } from '@/styles/tokens/colors'
import type { Student } from '@/types/student'
import { formatCompletionRatePercent } from '@/lib/completionRate'
import { formatListLabel } from '@/lib/formatListLabel'
import { listParentPhones } from '@/lib/parentPhones'
import { useTutorial } from '@/features/tutorial/TutorialProvider'
import {
  tableWrapStyle,
  tableStyle,
  trStyle,
  thStyle,
  tdStyle,
  stickyNameCellStyle,
  tdPhoneStyle,
  tdParentPhonesStyle,
  tdCompletionStyle,
  completionCellStyle,
  progressTrackStyle,
  progressBarStyle,
  percentTextStyle,
  remainingTextStyle,
  deleteButtonStyle,
  trSelectedStyle,
  trClickableStyle,
  trLockedStyle,
  lockedProgressBarStyle,
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
  selectionMode?: boolean
  selectedIds?: number[]
  onToggleSelect?: (id: number) => void
  separateSchoolGrade?: boolean
}

function getProgressColor(rate: number, totalIncomplete: number): string {
  if (totalIncomplete === 0) return colors.success500
  if (rate >= 0.7) return colors.success500
  if (rate >= 0.4) return colors.warning500
  return colors.error500
}

export default function StudentTable({
  students,
  middleColumns,
  onDelete,
  onRowClick,
  selectionMode = false,
  selectedIds = [],
  onToggleSelect,
  separateSchoolGrade = false,
}: StudentTableProps) {
  const tour = useTutorial()

  return (
    <div className={tableWrapStyle}>
      <table className={tableStyle}>
        <thead>
          <tr>
            <th className={`${thStyle} ${stickyNameCellStyle}`}>학생</th>
            <th className={thStyle}>학생 전화</th>
            <th className={thStyle}>학부모 전화</th>
            {middleColumns.map((col) => (
              <th key={col.header} className={thStyle}>
                {col.header}
              </th>
            ))}
            {separateSchoolGrade ? (
              <>
                <th className={thStyle}>학교</th>
                <th className={thStyle}>학년</th>
              </>
            ) : (
              <th className={thStyle}>학교/학년</th>
            )}
            <th className={thStyle}>완료율</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const completionPct = formatCompletionRatePercent(student.completion_rate)
            const color = getProgressColor(student.completion_rate, student.total_incomplete_items)
            const school = student.school_name?.trim() || '-'
            const grade = student.grade?.trim()
            const schoolLabel = grade ? `${school} · ${grade}` : school
            const parentPhoneLabel = listParentPhones(student).join('\n')
            const isLocked = Boolean(student.locked)
            const isSelected = selectionMode && !isLocked && selectedIds.includes(student.id)
            const canClickRow = !isLocked && (selectionMode || Boolean(onRowClick))
            const handleRowClick = () => {
              if (isLocked) return
              if (selectionMode) {
                onToggleSelect?.(student.id)
                return
              }
              onRowClick?.(student.id)
            }

            return (
              <tr
                key={student.id}
                className={[
                  trStyle,
                  isLocked ? trLockedStyle : '',
                  isSelected ? trSelectedStyle : '',
                  canClickRow ? trClickableStyle : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={canClickRow ? handleRowClick : undefined}
                aria-disabled={isLocked || undefined}
                data-tour={tour.studentId === student.id ? 'tutorial-student' : undefined}
              >
                <td className={`${tdStyle} ${stickyNameCellStyle}`} title={student.name}>
                  {student.name}
                </td>
                <td className={tdPhoneStyle} title={student.phone}>
                  {student.phone}
                </td>
                <td className={tdParentPhonesStyle} title={parentPhoneLabel}>
                  {parentPhoneLabel}
                </td>
                {middleColumns.map((col) => {
                  const title = col.getTitle?.(student)
                  return (
                    <td key={col.header} className={tdStyle} title={title}>
                      {col.render(student)}
                    </td>
                  )
                })}
                {separateSchoolGrade ? (
                  <>
                    <td className={tdStyle} title={school}>
                      {school}
                    </td>
                    <td className={tdStyle} title={grade || '-'}>
                      {grade || '-'}
                    </td>
                  </>
                ) : (
                  <td className={tdStyle} title={schoolLabel}>
                    {schoolLabel}
                  </td>
                )}
                <td className={tdCompletionStyle}>
                  <div className={completionCellStyle}>
                    <div className={progressTrackStyle}>
                      <div
                        className={`${progressBarStyle}${isLocked ? ` ${lockedProgressBarStyle}` : ''}`}
                        style={
                          isLocked
                            ? { width: `${completionPct}%` }
                            : { width: `${completionPct}%`, backgroundColor: color }
                        }
                      />
                    </div>
                    <span className={percentTextStyle}>{completionPct}%</span>
                    <span className={remainingTextStyle} style={isLocked ? undefined : { color }}>
                      {student.completion_rate === 1
                        ? '모두 완료'
                        : student.total_incomplete_items == null
                          ? '-'
                          : student.total_incomplete_items === 0
                            ? null
                            : `${student.total_incomplete_items}개 남음`}
                    </span>
                    {!selectionMode && (
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
                    )}
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
