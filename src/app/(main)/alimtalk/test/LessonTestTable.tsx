'use client'

import { useState } from 'react'
import type { LessonItemDetail } from '@/services/lesson'
import type { Attendance, CompletionStatus, LessonStudent, LessonStudentItem } from '@/types/lessonStudent'
import { splitColumnNote } from '@/lib/columnNote'
import { splitScoreStorage } from '@/lib/lessonScore'
import { matchesLessonItem } from '@/lib/lessonItemRef'
import { AttendanceColumnHeader } from '@/app/(main)/lesson/[id]/_components/LessonTableSection/AttendanceColumnHeader'
import { DynamicColumnHeader } from '@/app/(main)/lesson/[id]/_components/LessonTableSection/DynamicColumnHeader'
import {
  AttendanceCell,
  CompletionCell,
  ScoreEarnedCell,
  TextInputCell,
} from '@/app/(main)/lesson/[id]/_components/LessonTableSection/LessonTableCells'
import {
  attendanceCellStyle,
  tableStyle,
  tableWrapStyle,
  tdStyle,
} from '@/app/(main)/lesson/[id]/_components/LessonTableSection/LessonTable.css'
import * as styles from './test.css'
import {
  getScoreColumnMax,
  isScoreItem,
} from '@/app/(main)/lesson/[id]/_components/LessonTableSection/lessonTableUtils'

const CONTENT_ID = 1
const SCORE_ID = 2
const HOMEWORK_ID = 3
const EXTRA_ID = 4

function column(id: number, name: string, itemType: LessonItemDetail['item_type']): LessonItemDetail {
  return {
    id,
    source: 'template',
    name,
    item_type: itemType,
    is_common: false,
    include_in_message: true,
    is_partial: false,
    sort_order: id,
  }
}

const INITIAL_ITEMS: LessonItemDetail[] = [
  column(CONTENT_ID, '오늘 학습 내용', 'TEXT'),
  column(SCORE_ID, '시험점수', 'SCORE'),
  column(HOMEWORK_ID, '과제', 'COMPLETE'),
  column(EXTRA_ID, '기타 사항', 'TEXT'),
]

function blankStudent(): LessonStudent {
  return {
    id: 1,
    name: '',
    attendance: null,
    items: INITIAL_ITEMS.map((item) => ({
      item_id: item.id,
      source: 'template' as const,
      value: '',
      is_completed: null,
    })),
  }
}

export type LessonTestValue = {
  content: string
  attendance: Attendance
  score: string
  scoreMax: string
  homework: CompletionStatus
}

function readValue(student: LessonStudent): LessonTestValue {
  const contentRaw = student.items.find((item) => item.item_id === CONTENT_ID)?.value ?? ''
  const scoreRaw = student.items.find((item) => item.item_id === SCORE_ID)?.value ?? ''
  const homeworkItem = student.items.find((item) => item.item_id === HOMEWORK_ID)
  const { earned, max } = splitScoreStorage(scoreRaw)
  const homework: CompletionStatus =
    homeworkItem?.is_completed === true
      ? '완료'
      : homeworkItem?.is_completed === false
        ? '미완료'
        : null
  return {
    content: splitColumnNote(contentRaw).value.trim(),
    attendance: student.attendance,
    score: earned.trim(),
    scoreMax: max.trim(),
    homework,
  }
}

function replaceItem(
  student: LessonStudent,
  item: LessonItemDetail,
  patch: Partial<LessonStudentItem>,
): LessonStudent {
  const exists = student.items.some((row) => matchesLessonItem(row, item))
  const items = exists
    ? student.items.map((row) => (matchesLessonItem(row, item) ? { ...row, ...patch } : row))
    : [...student.items, { item_id: item.id, source: item.source ?? 'template', value: '', ...patch }]
  return { ...student, items }
}

export default function LessonTestTable({
  onChange,
}: {
  onChange: (value: LessonTestValue) => void
}) {
  const [student, setStudent] = useState<LessonStudent>(blankStudent)
  const items = INITIAL_ITEMS
  const [extraOptions, setExtraOptions] = useState<Array<{ id: number; label: string }>>([])
  const [nextExtraId, setNextExtraId] = useState(1)

  const commit = (next: LessonStudent) => {
    setStudent(next)
    onChange(readValue(next))
  }

  const students = [student]

  return (
    <div className={tableWrapStyle}>
      <table className={`${tableStyle} ${styles.lessonTable}`}>
        <colgroup>
          <col className={styles.attendanceCol} />
        </colgroup>
        <thead>
          <tr>
            <AttendanceColumnHeader
              extraOptions={extraOptions}
              allAttend={false}
              showAllAttend={false}
              onToggleAllAttend={() => {}}
              onAddOption={(label) => {
                setExtraOptions((prev) => [...prev, { id: nextExtraId, label }])
                setNextExtraId((id) => id + 1)
              }}
              onRemoveOption={(optionId) => {
                setExtraOptions((prev) => prev.filter((option) => option.id !== optionId))
                const removed = extraOptions.find((option) => option.id === optionId)
                if (removed && student.attendance === removed.label) {
                  commit({ ...student, attendance: null })
                }
              }}
            />
            {items.map((item) => (
              <DynamicColumnHeader
                key={item.id}
                item={item}
                students={students}
                onChange={(nextStudents) => {
                  const next = nextStudents[0]
                  if (next) commit(next)
                }}
                canRemove={false}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={`${tdStyle} ${attendanceCellStyle}`}>
              <AttendanceCell
                value={student.attendance}
                extraLabels={extraOptions.map((option) => option.label)}
                onChange={(attendance) => commit({ ...student, attendance })}
              />
            </td>
            {items.map((item) => {
              const row = student.items.find((entry) => matchesLessonItem(entry, item))
              if (item.item_type === 'COMPLETE') {
                const status: CompletionStatus =
                  row?.is_completed === true ? '완료' : row?.is_completed === false ? '미완료' : null
                return (
                  <td key={item.id} className={tdStyle}>
                    <CompletionCell
                      value={status}
                      onChange={(next) =>
                        commit(
                          replaceItem(student, item, {
                            value: row?.value ?? '',
                            is_completed: next === '완료' ? true : next === '미완료' ? false : null,
                          }),
                        )
                      }
                    />
                  </td>
                )
              }
              if (isScoreItem(item)) {
                return (
                  <td key={item.id} className={tdStyle}>
                    <ScoreEarnedCell
                      value={row?.value ?? ''}
                      columnMax={getScoreColumnMax(students, item)}
                      onChange={(value) => commit(replaceItem(student, item, { value }))}
                    />
                  </td>
                )
              }
              return (
                <td key={item.id} className={tdStyle}>
                  <TextInputCell
                    value={row?.value ?? ''}
                    onChange={(value) => commit(replaceItem(student, item, { value }))}
                  />
                </td>
              )
            })}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
