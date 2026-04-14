'use client'

import { useEffect, useMemo, useState } from 'react'
import Modal from '@/components/common/Modal'
import {
  rootStyle,
  timerIconWrapStyle,
  titleStyle,
  metaRowStyle,
  metaItemStyle,
  metaIconBoxStyle,
  summaryRowStyle,
  summaryCardStyle,
  summaryInnerStyle,
  summaryLabelPresentStyle,
  summaryLabelAbsentStyle,
  summaryValuePresentStyle,
  summaryValueAbsentStyle,
  pillsRowStyle,
  pillStyle,
  pillActiveStyle,
  pillInactiveStyle,
  gridStyle,
  studentCellStyle,
  studentNameStyle,
  studentRightStyle,
  linkBtnStyle,
  timeTextStyle,
  badgeStyle,
  badgePresentStyle,
  badgeLateStyle,
  badgeAbsentStyle,
  endBtnStyle,
} from './AttendanceDetailModal.css'
import {
  attendanceService,
  type AttendanceCheckStatus,
  type AttendanceSessionDetail,
} from '@/services/attendance'
import { useToastStore } from '@/stores/toastStore'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import TimerIllustration from './icons/TimerIllustration'
import { colors } from '@/styles/tokens/colors'
import { studentCheckFullUrl, type ResolvedStudentCheckLink } from '@/lib/attendanceUrls'

const POLL_MS = 2000

const LABEL: Record<AttendanceCheckStatus, string> = {
  PRESENT: '\uCD9C\uC11D',
  LATE: '\uC9C0\uAC01',
  ABSENT: '\uACB0\uC11D',
}

type FilterTab = 'all' | 'present' | 'absent'

function statusValueFromLabel(v: string): AttendanceCheckStatus | null {
  if (v === LABEL.PRESENT) return 'PRESENT'
  if (v === LABEL.LATE) return 'LATE'
  if (v === LABEL.ABSENT) return 'ABSENT'
  return null
}

function badgeClass(status: AttendanceCheckStatus) {
  if (status === 'PRESENT') return badgePresentStyle
  if (status === 'LATE') return badgeLateStyle
  return badgeAbsentStyle
}

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
      setSec(Math.max(0, Math.floor((end - Date.now()) / 1000)))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [expiresAtIso])
  return sec
}

function ClockMini() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke={colors.gray700} strokeWidth="1.5" />
      <path d="M12 7v5l3 2" stroke={colors.gray700} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function UsersMini() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M16 11a3 3 0 100-6 3 3 0 000 6zM8 13a3 3 0 100-6 3 3 0 000 6z"
        stroke={colors.gray700}
        strokeWidth="1.5"
      />
      <path
        d="M3 20v-1a4 4 0 014-4h2M21 20v-1a4 4 0 00-4-4h-2"
        stroke={colors.gray700}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export interface AttendanceDetailModalProps {
  isOpen: boolean
  onClose: () => void
  sessionId: number
  className: string
  onRequestEnd: () => void
  prefetchedLinks?: ResolvedStudentCheckLink[]
}

export default function AttendanceDetailModal({
  isOpen,
  onClose,
  sessionId,
  className,
  onRequestEnd,
  prefetchedLinks,
}: AttendanceDetailModalProps) {
  const [detail, setDetail] = useState<AttendanceSessionDetail | null>(null)
  const [patching, setPatching] = useState<number | null>(null)
  const [filter, setFilter] = useState<FilterTab>('all')
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

    load()
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

  const attendChipCount = detail
    ? detail.present_count + detail.late_count
    : 0

  const linkByStudentId = useMemo(() => {
    const m = new Map<number, string>()
    for (const l of prefetchedLinks ?? []) m.set(l.student_id, l.url)
    return m
  }, [prefetchedLinks])

  const urlForStudent = (row: { student_id: number; check_url?: string | null }) =>
    row.check_url || linkByStudentId.get(row.student_id) || studentCheckFullUrl(sessionId, row.student_id)

  const onStatusChange = async (studentId: number, value: string) => {
    const st = statusValueFromLabel(value)
    if (!st) return
    setPatching(studentId)
    try {
      await attendanceService.patchStudentStatus(sessionId, studentId, st)
      const d = await attendanceService.getSession(sessionId)
      setDetail(d)
    } catch {
      addToast({ variant: 'error', message: '\uC218\uC815\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694.' })
    } finally {
      setPatching(null)
    }
  }

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      addToast({ variant: 'success', message: '\uBCF5\uC0AC\uD588\uC5B4\uC694.' })
    } catch {
      addToast({ variant: 'error', message: '\uBCF5\uC0AC\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694.' })
    }
  }

  const titleText = `${className} \uCD9C\uACB0 \uD604\uD669`

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className={rootStyle}>
        <TimerIllustration className={timerIconWrapStyle} />
        <h2 className={titleStyle}>{titleText}</h2>

        {detail && (
          <>
            <div className={metaRowStyle}>
              <div className={metaItemStyle}>
                <span className={metaIconBoxStyle}>#</span>
                {detail.code}
              </div>
              <div className={metaItemStyle}>
                <ClockMini />
                {formatRemaining(remainingSec)}
              </div>
              <div className={metaItemStyle}>
                <UsersMini />
                {detail.total_count}
                {'\uBA85'}
              </div>
            </div>

            <div className={summaryRowStyle}>
              <div className={summaryCardStyle}>
                <div className={summaryInnerStyle}>
                  <p className={summaryLabelPresentStyle}>{LABEL.PRESENT}</p>
                  <p className={summaryValuePresentStyle}>{detail.present_count}</p>
                </div>
              </div>
              <div className={summaryCardStyle}>
                <div className={summaryInnerStyle}>
                  <p className={summaryLabelAbsentStyle}>{LABEL.ABSENT}</p>
                  <p className={summaryValueAbsentStyle}>{detail.absent_count}</p>
                </div>
              </div>
            </div>

            <div className={pillsRowStyle}>
              {(
                [
                  ['all', '\uC804\uCCB4', detail.total_count],
                  ['present', LABEL.PRESENT, attendChipCount],
                  ['absent', LABEL.ABSENT, detail.absent_count],
                ] as const
              ).map(([key, label, count]) => (
                <button
                  key={key}
                  type="button"
                  className={`${pillStyle} ${filter === key ? pillActiveStyle : pillInactiveStyle}`}
                  onClick={() => setFilter(key)}
                >
                  <span>{label}</span>
                  <span>{count}</span>
                </button>
              ))}
            </div>

            <div className={gridStyle}>
              {filteredStudents.map((row) => (
                <div key={row.student_id} className={studentCellStyle}>
                  <span className={studentNameStyle}>{row.student_name}</span>
                  <div className={studentRightStyle}>
                    <span className={timeTextStyle}>
                      {row.checked_at
                        ? format(new Date(row.checked_at), 'HH:mm', { locale: ko })
                        : '\u2014'}
                    </span>
                    <button
                      type="button"
                      className={linkBtnStyle}
                      onClick={() => copyText(urlForStudent(row))}
                    >
                      {'\uB9C1\uD06C'}
                    </button>
                    <select
                      className={`${badgeStyle} ${badgeClass(row.status)}`}
                      value={LABEL[row.status]}
                      disabled={patching === row.student_id}
                      onChange={(e) => onStatusChange(row.student_id, e.target.value)}
                    >
                      <option value={LABEL.PRESENT}>{LABEL.PRESENT}</option>
                      <option value={LABEL.LATE}>{LABEL.LATE}</option>
                      <option value={LABEL.ABSENT}>{LABEL.ABSENT}</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <button type="button" className={endBtnStyle} onClick={onRequestEnd}>
              {'\uCD9C\uACB0 \uC885\uB8CC\uD558\uAE30'}
            </button>
          </>
        )}
      </div>
    </Modal>
  )
}
