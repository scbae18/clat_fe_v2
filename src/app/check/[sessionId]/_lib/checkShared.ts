import type { Dispatch, SetStateAction } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

import {
  attendanceService,
  type AttendanceCheckStatus,
} from '@/services/attendance'

export type PublicSessionPayload = Awaited<
  ReturnType<typeof attendanceService.getPublicCheckSession>
>

export type CheckDoneState = {
  status: AttendanceCheckStatus
  class_name?: string
  lesson_date?: string
}

export type CheckBlockedState = { title: string; sub?: string }

export const LABEL: Record<AttendanceCheckStatus, string> = {
  PRESENT: '출석',
  LATE: '지각',
  ABSENT: '결석',
}

export function formatRemaining(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function formatLessonDateLabel(raw: string | undefined) {
  if (!raw) return ''
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return raw
  return format(d, 'M월 d일(E)', { locale: ko })
}

/** @returns true if handled as terminal (출석/지각 완료 또는 마감·결석) */
export function applyPublicSessionToState(
  r: PublicSessionPayload,
  set: {
    setDone: Dispatch<SetStateAction<CheckDoneState | null>>
    setBlocked: Dispatch<SetStateAction<CheckBlockedState | null>>
    setClassName: (v: string) => void
    setExpiresAt: (v: string | null) => void
    setStudentName: (v: string | null) => void
  },
): boolean {
  if (r.current_status === 'PRESENT' || r.current_status === 'LATE') {
    set.setDone({
      status: r.current_status,
      class_name: r.class_name,
      lesson_date: r.lesson_date,
    })
    set.setBlocked(null)
    return true
  }
  if (r.closed) {
    set.setBlocked({
      title: '출결이 마감됐어요',
      sub:
        r.message ??
        '제한 시간 내 출결 코드를 입력하지 않아 결석 처리되었어요. 선생님께 문의해 주세요.',
    })
    return true
  }
  set.setClassName(r.class_name ?? '')
  set.setExpiresAt(r.expires_at ?? null)
  set.setStudentName(r.student_name ?? null)
  return false
}
