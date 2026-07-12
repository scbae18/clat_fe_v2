import { useEffect } from 'react'

import type { LessonStudent } from '@/types/lessonStudent'
import type { LessonDetail } from '@/services/lesson'
import useDisclosure from '@/hooks/useDisclosure'
import { useToastStore } from '@/stores/toastStore'
import {
  useAttendanceSessionStore,
  ATTENDANCE_SESSION_ENDED_EVENT,
} from '@/stores/attendanceSessionStore'
import { attendanceService } from '@/services/attendance'
import { resolveStudentCheckLinks } from '@/lib/attendanceUrls'

type UseLessonAttendanceOnDetailParams = {
  lessonId: number
  lesson: LessonDetail | null
  error: 'TEMPLATE_NOT_FOUND' | null
  students: Pick<LessonStudent, 'id' | 'name'>[]
  refetchAfterAttendanceEnd: () => void | Promise<void>
}

/**
 * Lesson detail: sync active session, student check links, end-event refresh,
 * and start-modal / header button state.
 */
export function useLessonAttendanceOnDetail({
  lessonId,
  lesson,
  error,
  students,
  refetchAfterAttendanceEnd,
}: UseLessonAttendanceOnDetailParams) {
  const addToast = useToastStore((s) => s.addToast)
  const attendanceStartModal = useDisclosure()
  const activeAttendance = useAttendanceSessionStore((s) => s.active)
  const setActiveAttendance = useAttendanceSessionStore((s) => s.setActive)
  const bumpAttendanceDetail = useAttendanceSessionStore((s) => s.bumpAttendanceDetail)

  useEffect(() => {
    const onEnded = (e: Event) => {
      const ce = e as CustomEvent<{ lessonRecordId: number }>
      if (ce.detail?.lessonRecordId === lessonId) void refetchAfterAttendanceEnd()
    }
    window.addEventListener(ATTENDANCE_SESSION_ENDED_EVENT, onEnded)
    return () => window.removeEventListener(ATTENDANCE_SESSION_ENDED_EVENT, onEnded)
  }, [lessonId, refetchAfterAttendanceEnd])

  useEffect(() => {
    if (!lessonId || !lesson || error === 'TEMPLATE_NOT_FOUND') return
    attendanceService
      .getSessionByLesson(lessonId)
      .then((r) => {
        if (r.session_id && r.is_active !== false && r.expires_at) {
          setActiveAttendance({
            sessionId: r.session_id,
            lessonRecordId: lessonId,
            className: lesson.class_name,
            code: r.code ?? '',
            expiresAt: r.expires_at,
          })
        } else {
          const cur = useAttendanceSessionStore.getState().active
          if (cur?.lessonRecordId === lessonId) setActiveAttendance(null)
        }
      })
      .catch(() => {})
  }, [lessonId, lesson, error, setActiveAttendance])

  useEffect(() => {
    const cur = useAttendanceSessionStore.getState().active
    if (!cur || cur.lessonRecordId !== lessonId || !cur.sessionId) return
    if (cur.studentLinks && cur.studentLinks.length > 0) return
    if (students.length === 0) return
    setActiveAttendance({
      ...cur,
      studentLinks: resolveStudentCheckLinks(
        cur.sessionId,
        students.map((s) => ({ id: s.id, name: s.name })),
      ),
    })
  }, [lessonId, students, setActiveAttendance])

  const hasAttendanceItem = lesson?.items.some((i) => i.item_type === 'ATTENDANCE') ?? false
  const attendanceInProgress =
    activeAttendance?.lessonRecordId === lessonId && activeAttendance != null
  const attendanceLocked = lesson?.attendance_locked === true

  const handleAttendanceButtonClick = () => {
    if (attendanceInProgress) {
      bumpAttendanceDetail()
      return
    }
    if (attendanceLocked) {
      addToast({
        variant: 'warning',
        message: '이 수업은 이미 출결을 시작해서 다시 시작할 수 없어요.',
      })
      return
    }
    attendanceStartModal.open()
  }

  const attendanceButtonLabel = attendanceInProgress
    ? '출결 진행 중'
    : attendanceLocked
      ? '출결 시작 불가 (이미 진행됨)'
      : '출결 시작하기'

  const attendanceButtonVariant =
    attendanceInProgress || attendanceLocked ? ('secondary' as const) : ('primary' as const)

  return {
    hasAttendanceItem,
    attendanceStartModal,
    handleAttendanceButtonClick,
    attendanceButtonLabel,
    attendanceButtonVariant,
  }
}
