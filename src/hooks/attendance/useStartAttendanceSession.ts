import { useState } from 'react'

import { attendanceService } from '@/services/attendance'
import { useAttendanceSessionStore } from '@/stores/attendanceSessionStore'
import { useToastStore } from '@/stores/toastStore'
import {
  resolveStudentCheckLinks,
  type ResolvedStudentCheckLink,
} from '@/lib/attendanceUrls'

export type AttendanceStudentRef = {
  id: number
  name: string
}

type UseStartAttendanceSessionParams = {
  lessonRecordId: number
  className: string
  students: AttendanceStudentRef[]
  onStarted?: () => void
}

export function useStartAttendanceSession({
  lessonRecordId,
  className,
  students,
  onStarted,
}: UseStartAttendanceSessionParams) {
  const [submitting, setSubmitting] = useState(false)
  const setActive = useAttendanceSessionStore((s) => s.setActive)
  const addToast = useToastStore((s) => s.addToast)

  const start = async (durationMinutes: number) => {
    setSubmitting(true)
    try {
      const res = await attendanceService.createSession({
        lesson_record_id: lessonRecordId,
        duration_minutes: durationMinutes,
      })
      if (!res.session_id || !res.expires_at) throw new Error('INVALID_SESSION')
      const studentLinks: ResolvedStudentCheckLink[] = resolveStudentCheckLinks(
        res.session_id,
        students,
        res.student_links,
      )
      setActive({
        sessionId: res.session_id,
        lessonRecordId,
        className,
        code: res.code,
        expiresAt: res.expires_at,
        studentLinks,
      })
      addToast({ variant: 'success', message: '출결이 시작됐어요.' })
      onStarted?.()
      return true
    } catch {
      addToast({ variant: 'error', message: '출결 시작에 실패했어요.' })
      return false
    } finally {
      setSubmitting(false)
    }
  }

  return { start, submitting }
}
