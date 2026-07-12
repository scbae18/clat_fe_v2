import { useEffect, useMemo, useState } from 'react'

import {
  attendanceService,
  type AttendanceCheckStatus,
  type AttendanceSessionDetail,
} from '@/services/attendance'
import { useToastStore } from '@/stores/toastStore'
import { studentCheckFullUrl, type ResolvedStudentCheckLink } from '@/lib/attendanceUrls'

import { formatAttendanceRemaining, useRemainingSeconds } from './attendanceTime'

export type { AttendanceCheckStatus }

const POLL_MS = 2000

export type AttendanceDetailFilter = 'all' | 'present' | 'absent'

type UseAttendanceDetailSessionParams = {
  isOpen: boolean
  sessionId: number
  prefetchedLinks?: ResolvedStudentCheckLink[]
}

export function useAttendanceDetailSession({
  isOpen,
  sessionId,
  prefetchedLinks,
}: UseAttendanceDetailSessionParams) {
  const [detail, setDetail] = useState<AttendanceSessionDetail | null>(null)
  const [patching, setPatching] = useState<number | null>(null)
  const [filter, setFilter] = useState<AttendanceDetailFilter>('all')
  const addToast = useToastStore((s) => s.addToast)

  const remainingSec = useRemainingSeconds(detail?.expires_at ?? null)

  useEffect(() => {
    if (!isOpen) {
      setDetail(null)
      setFilter('all')
      return
    }

    let cancelled = false

    const load = async () => {
      try {
        const d = await attendanceService.getSession(sessionId)
        if (!cancelled) setDetail(d)
      } catch {
        if (!cancelled) setDetail(null)
      }
    }

    void load()
    const id = setInterval(load, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [isOpen, sessionId])

  const filteredStudents = useMemo(() => {
    const list = detail?.students ?? []
    if (filter === 'all') return list
    if (filter === 'present') return list.filter((s) => s.status === 'PRESENT' || s.status === 'LATE')
    return list.filter((s) => s.status === 'ABSENT')
  }, [detail?.students, filter])

  const attendChipCount = detail ? detail.present_count + detail.late_count : 0

  const linkByStudentId = useMemo(() => {
    const m = new Map<number, string>()
    for (const l of prefetchedLinks ?? []) m.set(l.student_id, l.url)
    return m
  }, [prefetchedLinks])

  const urlForStudent = (row: { student_id: number; check_url?: string | null }) =>
    row.check_url ||
    linkByStudentId.get(row.student_id) ||
    studentCheckFullUrl(sessionId, row.student_id)

  const onStatusChange = async (studentId: number, st: AttendanceCheckStatus) => {
    setPatching(studentId)
    try {
      await attendanceService.patchStudentStatus(sessionId, studentId, st)
      const d = await attendanceService.getSession(sessionId)
      setDetail(d)
    } catch {
      addToast({ variant: 'error', message: '수정에 실패했어요.' })
    } finally {
      setPatching(null)
    }
  }

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      addToast({ variant: 'success', message: '복사했어요.' })
    } catch {
      addToast({ variant: 'error', message: '복사에 실패했어요.' })
    }
  }

  return {
    detail,
    patching,
    filter,
    setFilter,
    remainingSec,
    remainingLabel: formatAttendanceRemaining(remainingSec),
    filteredStudents,
    attendChipCount,
    urlForStudent,
    onStatusChange,
    copyText,
  }
}
