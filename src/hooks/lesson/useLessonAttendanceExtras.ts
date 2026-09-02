import { useCallback, type Dispatch, type SetStateAction } from 'react'

import type { LessonStudent } from '@/types/lessonStudent'
import { lessonService, type LessonDetail } from '@/services/lesson'
import { useToastStore } from '@/stores/toastStore'
import {
  MAX_ATTENDANCE_EXTRA_LABEL_LENGTH,
  MAX_ATTENDANCE_EXTRA_OPTIONS,
} from '@/lib/attendanceLabels'

type SetState<T> = Dispatch<SetStateAction<T>>

function apiErrorMessage(err: unknown, fallback: string): string {
  return (
    (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
      ?.message ?? fallback
  )
}

type UseLessonAttendanceExtrasParams = {
  lessonId: number
  setLesson: SetState<LessonDetail | null>
  setStudents: SetState<LessonStudent[]>
}

export function useLessonAttendanceExtras({
  lessonId,
  setLesson,
  setStudents,
}: UseLessonAttendanceExtrasParams) {
  const addToast = useToastStore((s) => s.addToast)

  const addAttendanceOption = useCallback(
    async (rawLabel: string) => {
      const label = rawLabel.trim()
      if (!label) return
      if (label.length > MAX_ATTENDANCE_EXTRA_LABEL_LENGTH) {
        addToast({
          variant: 'warning',
          message: `선택지는 ${MAX_ATTENDANCE_EXTRA_LABEL_LENGTH}자까지 입력할 수 있어요.`,
        })
        return
      }
      try {
        const created = await lessonService.addAttendanceOption(lessonId, label)
        setLesson((prev) => {
          if (!prev) return prev
          const extras = prev.attendance_extra_options ?? []
          if (extras.some((opt) => opt.id === created.id)) return prev
          if (extras.length >= MAX_ATTENDANCE_EXTRA_OPTIONS) return prev
          return {
            ...prev,
            attendance_extra_options: [...extras, created],
          }
        })
        addToast({ variant: 'success', message: '출결 선택지가 추가됐어요.' })
      } catch (err: unknown) {
        addToast({
          variant: 'error',
          message: apiErrorMessage(err, '선택지 추가에 실패했어요.'),
        })
      }
    },
    [addToast, lessonId, setLesson],
  )

  const removeAttendanceOption = useCallback(
    async (optionId: number, label: string) => {
      try {
        await lessonService.removeAttendanceOption(lessonId, optionId)
        setLesson((prev) =>
          prev
            ? {
                ...prev,
                attendance_extra_options: (prev.attendance_extra_options ?? []).filter(
                  (opt) => opt.id !== optionId,
                ),
              }
            : prev,
        )
        setStudents((prev) =>
          prev.map((student) =>
            student.attendance === label ? { ...student, attendance: null } : student,
          ),
        )
        addToast({ variant: 'success', message: '출결 선택지를 삭제했어요.' })
      } catch (err: unknown) {
        addToast({
          variant: 'error',
          message: apiErrorMessage(err, '선택지 삭제에 실패했어요.'),
        })
      }
    },
    [addToast, lessonId, setLesson, setStudents],
  )

  return { addAttendanceOption, removeAttendanceOption }
}
