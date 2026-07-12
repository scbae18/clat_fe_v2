import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import { attendanceService } from '@/services/attendance'
import {
  useAttendanceSessionStore,
  dispatchAttendanceSessionEnded,
} from '@/stores/attendanceSessionStore'
import { useToastStore } from '@/stores/toastStore'
import { useUiStore } from '@/stores/uiStore'
import { getSidebarWidth } from '@/lib/sidebar'

import { formatAttendanceRemaining, useRemainingSeconds } from './attendanceTime'

const POLL_MS = 10_000

export function useAttendanceFloatingBar() {
  const active = useAttendanceSessionStore((s) => s.active)
  const setActive = useAttendanceSessionStore((s) => s.setActive)
  const attendanceDetailNonce = useAttendanceSessionStore((s) => s.attendanceDetailNonce)
  const pathname = usePathname()
  const addToast = useToastStore((s) => s.addToast)
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed)

  const [detailOpen, setDetailOpen] = useState(false)
  const [endConfirmOpen, setEndConfirmOpen] = useState(false)
  const [snapshot, setSnapshot] = useState<{
    present: number
    late: number
    absent: number
    expiresAt: string
  } | null>(null)
  const [endedSummary, setEndedSummary] = useState<{
    lessonRecordId: number
    present: number
    late: number
    absent: number
  } | null>(null)

  const expiresAt = snapshot?.expiresAt ?? active?.expiresAt ?? null
  const remainingSeconds = useRemainingSeconds(expiresAt)

  const lessonDetailFooter = pathname != null && /^\/lesson\/\d+$/.test(pathname)
  const bottom = lessonDetailFooter ? 100 : 32
  const horizontal = 48
  const sidebar = getSidebarWidth(sidebarCollapsed)

  useEffect(() => {
    if (attendanceDetailNonce > 0 && active) setDetailOpen(true)
  }, [attendanceDetailNonce, active])

  const clearAndNotifyEnd = useCallback(
    (lessonRecordId: number) => {
      setActive(null)
      setSnapshot(null)
      dispatchAttendanceSessionEnded(lessonRecordId)
    },
    [setActive],
  )

  useEffect(() => {
    if (!active?.sessionId) {
      setSnapshot(null)
      return
    }

    let cancelled = false

    const fetchSession = async () => {
      try {
        const d = await attendanceService.getSession(active.sessionId)
        if (cancelled) return
        if (!d.is_active) {
          clearAndNotifyEnd(active.lessonRecordId)
          addToast({
            variant: 'success',
            message: '출결이 종료됐어요.',
          })
          return
        }
        setSnapshot({
          present: d.present_count,
          late: d.late_count,
          absent: d.absent_count,
          expiresAt: d.expires_at,
        })
      } catch {
        /* keep countdown from store when API is unavailable */
      }
    }

    void fetchSession()
    const id = setInterval(fetchSession, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [active?.sessionId, active?.lessonRecordId, clearAndNotifyEnd, addToast])

  useEffect(() => {
    if (!active || remainingSeconds > 0) return
    attendanceService
      .getSession(active.sessionId)
      .then((d) => {
        if (!d.is_active) {
          clearAndNotifyEnd(active.lessonRecordId)
          addToast({
            variant: 'warning',
            message: '출결 시간이 만료됐어요.',
          })
        }
      })
      .catch(() => {})
  }, [remainingSeconds, active, clearAndNotifyEnd, addToast])

  const handleEnd = async () => {
    if (!active) return
    try {
      const d = await attendanceService.getSession(active.sessionId).catch(() => null)
      await attendanceService.endSession(active.sessionId)
      setEndedSummary({
        lessonRecordId: active.lessonRecordId,
        present: d?.present_count ?? snapshot?.present ?? 0,
        late: d?.late_count ?? snapshot?.late ?? 0,
        absent: d?.absent_count ?? snapshot?.absent ?? 0,
      })
      clearAndNotifyEnd(active.lessonRecordId)
      addToast({ variant: 'success', message: '출결이 종료됐어요.' })
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message ?? '출결 종료에 실패했어요.'
      addToast({ variant: 'error', message: msg })
    } finally {
      setEndConfirmOpen(false)
    }
  }

  return {
    active,
    detailOpen,
    setDetailOpen,
    endConfirmOpen,
    setEndConfirmOpen,
    endedSummary,
    setEndedSummary,
    present: snapshot?.present ?? 0,
    late: snapshot?.late ?? 0,
    absent: snapshot?.absent ?? 0,
    remainingLabel: formatAttendanceRemaining(remainingSeconds),
    barPosition: { left: sidebar + horizontal, right: horizontal, bottom },
    handleEnd,
  }
}
