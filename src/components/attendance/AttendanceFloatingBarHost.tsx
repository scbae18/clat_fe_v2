'use client'

import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import AttendanceFloatingBar from './AttendanceFloatingBar'
import AttendanceDetailModal from './AttendanceDetailModal'
import AttendanceEndedModal from './AttendanceEndedModal'
import ConfirmModal from '@/components/common/ConfirmModal'
import {
  useAttendanceSessionStore,
  dispatchAttendanceSessionEnded,
} from '@/stores/attendanceSessionStore'
import { attendanceService } from '@/services/attendance'
import { useToastStore } from '@/stores/toastStore'

const POLL_MS = 10_000

function formatRemaining(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function useRemainingSeconds(expiresAtIso: string | null) {
  const [sec, setSec] = useState(0)
  useEffect(() => {
    if (!expiresAtIso) return
    const tick = () => {
      const end = new Date(expiresAtIso).getTime()
      if (!Number.isFinite(end)) {
        setSec(0)
        return
      }
      const now = Date.now()
      setSec(Math.max(0, Math.floor((end - now) / 1000)))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [expiresAtIso])
  return sec
}

export default function AttendanceFloatingBarHost() {
  const active = useAttendanceSessionStore((s) => s.active)
  const setActive = useAttendanceSessionStore((s) => s.setActive)
  const attendanceDetailNonce = useAttendanceSessionStore((s) => s.attendanceDetailNonce)
  const pathname = usePathname()
  const addToast = useToastStore((s) => s.addToast)

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
  const sidebar = 240

  useEffect(() => {
    if (attendanceDetailNonce > 0 && active) setDetailOpen(true)
  }, [attendanceDetailNonce, active])

  const clearAndNotifyEnd = useCallback(
    (lessonRecordId: number) => {
      setActive(null)
      setSnapshot(null)
      dispatchAttendanceSessionEnded(lessonRecordId)
    },
    [setActive]
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
            message: '\uCD9C\uACB0\uC774 \uC885\uB8CC\uB410\uC5B4\uC694.',
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

    fetchSession()
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
            message: '\uCD9C\uACB0 \uC2DC\uAC04\uC774 \uB9CC\uB8CC\uB410\uC5B4\uC694.',
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
      addToast({ variant: 'success', message: '\uCD9C\uACB0\uC774 \uC885\uB8CC\uB410\uC5B4\uC694.' })
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message ?? '\uCD9C\uACB0 \uC885\uB8CC\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694.'
      addToast({ variant: 'error', message: msg })
    } finally {
      setEndConfirmOpen(false)
    }
  }

  const present = snapshot?.present ?? 0
  const late = snapshot?.late ?? 0
  const absent = snapshot?.absent ?? 0
  const remainingLabel = formatRemaining(remainingSeconds)

  return (
    <>
      {active ? (
        <div
          style={{
            position: 'fixed',
            left: sidebar + horizontal,
            right: horizontal,
            bottom,
            zIndex: 110,
            pointerEvents: 'none',
          }}
        >
          <div style={{ pointerEvents: 'auto' }}>
            <AttendanceFloatingBar
              classLabel={active.className}
              code={active.code}
              presentCount={present}
              lateCount={late}
              absentCount={absent}
              remainingLabel={remainingLabel}
              onDetail={() => setDetailOpen(true)}
              onEnd={() => setEndConfirmOpen(true)}
            />
          </div>
        </div>
      ) : null}

      {active ? (
        <AttendanceDetailModal
          isOpen={detailOpen}
          onClose={() => setDetailOpen(false)}
          sessionId={active.sessionId}
          className={active.className}
          prefetchedLinks={active.studentLinks}
          onRequestEnd={() => {
            setDetailOpen(false)
            setEndConfirmOpen(true)
          }}
        />
      ) : null}

      <ConfirmModal
        isOpen={endConfirmOpen}
        onClose={() => setEndConfirmOpen(false)}
        onConfirm={handleEnd}
        title={'\uCD9C\uACB0\uC744 \uC885\uB8CC\uD560\uAE4C\uC694?'}
        descriptions={[
          '\uC885\uB8CC \uD6C4\uC5D0\uB294 \uAC19\uC740 \uC218\uC5C5\uC5D0\uC11C \uCD9C\uACB0\uC744 \uB2E4\uC2DC \uC2DC\uC791\uD560 \uC218 \uC5C6\uC5B4\uC694.',
        ]}
        confirmLabel={'\uC885\uB8CC'}
        confirmVariant="danger"
      />

      {endedSummary ? (
        <AttendanceEndedModal
          isOpen={true}
          onClose={() => setEndedSummary(null)}
          lessonRecordId={endedSummary.lessonRecordId}
          presentCount={endedSummary.present}
          lateCount={endedSummary.late}
          absentCount={endedSummary.absent}
        />
      ) : null}
    </>
  )
}
