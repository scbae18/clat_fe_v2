import { useCallback, type Dispatch, type SetStateAction } from 'react'

import type { LessonStudent } from '@/types/lessonStudent'
import { lessonService, type LessonDetail } from '@/services/lesson'
import { parseAttendanceValue } from '@/lib/attendanceLabels'

type SetState<T> = Dispatch<SetStateAction<T>>

type UseLessonAttendanceRefreshParams = {
  lessonId: number
  setLesson: SetState<LessonDetail | null>
  setStudents: SetState<LessonStudent[]>
  triggerReload: () => void
}

/**
 * After attendance session ends: merge server attendance/lock into local form
 * without wiping unsaved common/individual values.
 */
export function useLessonAttendanceRefresh({
  lessonId,
  setLesson,
  setStudents,
  triggerReload,
}: UseLessonAttendanceRefreshParams) {
  return useCallback(async () => {
    if (!lessonId) return
    try {
      const data = await lessonService.getLesson(lessonId)
      setLesson(data)

      setStudents((prev) => {
        if (prev.length === 0) {
          return prev
        }

        const attendanceItems = data.items.filter((i) => i.item_type === 'ATTENDANCE')
        const attendanceItem = attendanceItems[0]
        const attendanceItemId = attendanceItem?.id

        return prev.map((student) => {
          const sd = data.student_data.find((s) => s.student_id === student.id)
          const sdItems = sd?.items ?? []

          let attendance: LessonStudent['attendance'] = student.attendance
          let attendanceValue = ''
          if (attendanceItemId) {
            attendanceValue = String(
              sdItems.find((si) => {
                const src = si.source ?? 'template'
                return src === 'template' && si.template_item_id === attendanceItemId
              })?.value ?? '',
            )
            const parsed = parseAttendanceValue(attendanceValue)
            if (parsed) attendance = parsed
          }

          const mergedItems = student.items.map((item) => {
            if (
              attendanceItemId &&
              item.source === 'template' &&
              item.item_id === attendanceItemId
            ) {
              return {
                ...item,
                value: attendanceValue !== '' ? attendanceValue : item.value,
              }
            }
            return item
          })

          return {
            ...student,
            attendance,
            items: mergedItems,
          }
        })
      })
    } catch {
      triggerReload()
    }
  }, [lessonId, setLesson, setStudents, triggerReload])
}
