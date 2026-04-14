'use client'

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
  activeRowStyle,
} from './LessonTable.css'

interface LessonTableSectionProps {
  students: LessonStudent[]
  templateItems: LessonItemDetail[]
  onChange: (students: LessonStudent[]) => void
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
        className={cellButtonRecipe({ variant: value === '완료' ? 'done' : 'default' })}
        onClick={() => onChange(value === '완료' ? null : '완료')}
      >
        완료
      </button>
      <button
        className={cellButtonRecipe({ variant: value === '미완료' ? 'undone' : 'default' })}
        onClick={() => onChange(value === '미완료' ? null : '미완료')}
      >
        미완료
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

export default function LessonTable({
  students,
  templateItems,
  onChange,
}: LessonTableSectionProps) {
  const dynamicItems = templateItems.filter((i) => !i.is_common && i.item_type !== 'ATTENDANCE')

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
          {dynamicItems.map((item) => (
            <th key={item.id} className={thShrinkStyle}>
              {item.name}
            </th>
          ))}
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
                    ? '완료'
                    : studentItem?.is_completed === false
                      ? '미완료'
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
                          v === '완료' ? true : v === '미완료' ? false : null
                        )
                      }
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
