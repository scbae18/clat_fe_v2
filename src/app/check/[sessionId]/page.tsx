'use client'

import { Suspense, use, useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { attendanceService, type AttendanceCheckStatus } from '@/services/attendance'
import * as styles from './checkSession.css'

const LABEL: Record<AttendanceCheckStatus, string> = {
  PRESENT: '\uCD9C\uC11D',
  LATE: '\uC9C0\uAC01',
  ABSENT: '\uACB0\uC11D',
}

function formatRemaining(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function useCountdown(iso: string | null) {
  const [sec, setSec] = useState(0)
  useEffect(() => {
    if (!iso) return
    const t = () => setSec(Math.max(0, Math.floor((new Date(iso).getTime() - Date.now()) / 1000)))
    t()
    const id = setInterval(t, 1000)
    return () => clearInterval(id)
  }, [iso])
  return sec
}

function SuccessCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="40" cy="40" r="40" fill="#3B51CC" />
      <path
        d="M23 41.5 L34.5 53 L57 28"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ClosedWarningIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="40" cy="40" r="40" fill="#E5E6EC" />
      <path
        d="M40 24v28M40 56v2"
        stroke="#5B5C72"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function formatLessonDateLabel(raw: string | undefined) {
  if (!raw) return ''
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return raw
  return format(d, 'M월 d일(E)', { locale: ko })
}

function CheckSessionInner({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId: sidStr } = use(params)
  const sessionId = Number(sidStr)
  const search = useSearchParams()
  const studentIdRaw = search.get('studentId')
  const studentId = studentIdRaw ? Number(studentIdRaw) : NaN

  const inputRef = useRef<HTMLInputElement>(null)

  const [className, setClassName] = useState('')
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [studentName, setStudentName] = useState<string | null>(null)
  const [blocked, setBlocked] = useState<{ title: string; sub?: string } | null>(null)
  const [loadErr, setLoadErr] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [submitErr, setSubmitErr] = useState<string | null>(null)
  const [done, setDone] = useState<{
    status: AttendanceCheckStatus
    class_name?: string
    lesson_date?: string
  } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const remain = useCountdown(expiresAt)

  useEffect(() => {
    if (!Number.isFinite(sessionId) || !Number.isFinite(studentId)) return
    let cancelled = false
    attendanceService
      .getPublicCheckSession(sessionId, studentId)
      .then((r) => {
        if (cancelled) return
        if (r.closed) {
          setBlocked({
            title: '\uCD9C\uACB0\uC774 \uB9C8\uAC10\uB410\uC5B4\uC694',
            sub:
              '\uCD9C\uACB0 \uAC00\uB2A5 \uC2DC\uAC04\uC774 \uC9C0\uB0AC\uC5B4\uC694. \uC120\uC0DD\uB2D8\uAED8 \uC9C1\uC811 \uBB38\uC758\uD574\uC8FC\uC138\uC694.',
          })
          return
        }
        if (r.already_checked) {
          setBlocked({
            title: '\uC774\uBBF8 \uCD9C\uACB0 \uCC98\uB9AC\uB41C \uD559\uC0DD\uC785\uB2C8\uB2E4',
          })
          return
        }
        setClassName(r.class_name ?? '')
        setExpiresAt(r.expires_at ?? null)
        setStudentName(r.student_name ?? null)
      })
      .catch(() => {
        if (!cancelled) {
          setLoadErr(
            '\uC138\uC158 \uC815\uBCF4\uB97C \uBD88\uB7EC\uC62C \uC218 \uC5C6\uC5B4\uC694. \uCF54\uB4DC\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694.'
          )
        }
      })
    return () => {
      cancelled = true
    }
  }, [sessionId, studentId])

  useEffect(() => {
    if (!Number.isFinite(sessionId) || !Number.isFinite(studentId)) return
    if (blocked || done) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 400)
    return () => clearTimeout(t)
  }, [sessionId, studentId, blocked, done])

  const onCodeInput = useCallback((raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 4)
    setCode(digits)
    setSubmitErr(null)
  }, [])

  const onConfirm = async () => {
    if (code.length !== 4) {
      setSubmitErr('\u0034\uC790\uB9AC \uCF54\uB4DC\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694.')
      return
    }
    setSubmitting(true)
    setSubmitErr(null)
    try {
      const res = await attendanceService.submitPublicCheckCode(sessionId, studentId, code)
      setDone({
        status: res.status,
        class_name: res.class_name,
        lesson_date: res.lesson_date,
      })
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message ??
        ((e as { response?: { status?: number } })?.response?.status === 404
          ? '\uCD9C\uACB0 \uCCB4\uD06C API\uAC00 \uC544\uC9C1 \uC5C6\uC5B4\uC694. \uC11C\uBC84 \uAD6C\uD604\uC744 \uD655\uC778\uD574 \uC8FC\uC138\uC694.'
          : '\uCF54\uB4DC\uAC00 \uC62C\uBC14\uB974\uC9C0 \uC54A\uC544\uC694')
      setSubmitErr(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (!Number.isFinite(studentId)) {
    return (
      <div className={styles.page}>
        <div className={styles.contentColumn}>
          <h1 className={styles.title}>{'\uD559\uC0DD \uC815\uBCF4\uAC00 \uC5C6\uC5B4\uC694.'}</h1>
          <p className={styles.subStack} style={{ marginTop: '14px' }}>
            {
              'URL\uC5D0 studentId\uAC00 \uD3EC\uD568\uB418\uC5B4 \uC788\uB294\uC9C0 \uD655\uC778\uD574 \uC8FC\uC138\uC694.'
            }
          </p>
        </div>
      </div>
    )
  }

  if (blocked) {
    return (
      <div className={styles.page}>
        <div className={styles.contentColumn}>
          <div className={styles.blockedStack}>
            <ClosedWarningIcon className={styles.blockedIconWrap} />
            <h1 className={styles.blockedTitle}>{blocked.title}</h1>
            {blocked.sub ? <p className={styles.blockedSub}>{blocked.sub}</p> : null}
          </div>
        </div>
      </div>
    )
  }

  if (done) {
    const displayClass = done.class_name ?? className
    const dateLine = formatLessonDateLabel(done.lesson_date)
    return (
      <div className={styles.page}>
        <div className={styles.contentColumn}>
          <div className={styles.successStack}>
            <SuccessCheckIcon className={styles.successIconWrap} />
            <h1 className={styles.successTitle}>
              {'\uCD9C\uACB0\uC774 \uD655\uC778\uB410\uC5B4\uC694'}
            </h1>
            <div>
              <p className={styles.successSub} style={{ marginBottom: 0 }}>
                {'\uC120\uC0DD\uB2D8\uAED8 \uCD9C\uC11D\uC774'}
              </p>
              <p className={styles.successSub}>
                {'\uC790\uB3D9\uC73C\uB85C \uC804\uB2EC\uB410\uC5B4\uC694'}
              </p>
            </div>
          </div>
          <div className={styles.summaryCard}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryKey}>{'\uBC18'}</span>
              <span className={styles.summaryVal}>{displayClass}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryKey}>{'\uB0A0\uC9DC'}</span>
              <span className={styles.summaryVal}>{dateLine || '—'}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryKey}>{'\uC0C1\uD0DC'}</span>
              <span className={styles.summaryValStatus}>{LABEL[done.status]}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const digits = [code[0] ?? '', code[1] ?? '', code[2] ?? '', code[3] ?? '']

  return (
    <div className={styles.page}>
      <input
        ref={inputRef}
        className={styles.hiddenNumericInput}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={4}
        value={code}
        onChange={(e) => onCodeInput(e.target.value)}
        aria-label={'\uCD9C\uACB0 \uCF54\uB4DC 4\uC790\uB9AC'}
      />
      <div className={styles.contentColumn}>
        {className ? <div className={styles.chip}>{className}</div> : <div style={{ height: '25px', marginBottom: '20px' }} />}
        <h1 className={styles.title}>{'\uCD9C\uACB0 \uCF54\uB4DC\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694'}</h1>
        <div className={styles.subStack}>
          <p style={{ margin: 0 }}>{'\uC120\uC0DD\uB2D8\uAED8 \uBC1B\uC740'}</p>
          <p style={{ margin: 0 }}>{'\u0034\uC790\uB9AC \uCF54\uB4DC\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694'}</p>
        </div>
        {studentName ? <p className={styles.studentName}>{studentName}</p> : null}
        {loadErr ? <p className={styles.loadErrText}>{loadErr}</p> : null}

        <div className={styles.timerDigitsBlock} onClick={() => inputRef.current?.focus()}>
          <div className={styles.timerLine}>
            <span className={styles.timerLabel}>{'\uB0A8\uC740 \uC2DC\uAC04 '}</span>
            <span className={styles.timerValue}>{formatRemaining(remain)}</span>
          </div>
          <div className={styles.digitsRow}>
            {digits.map((ch, i) => (
              <div
                key={i}
                className={`${styles.digitBox}${ch ? ` ${styles.digitBoxFilled}` : ''}`}
              >
                {ch}
              </div>
            ))}
          </div>
        </div>

        {submitErr ? <p className={styles.errorText}>{submitErr}</p> : null}

        <button
          type="button"
          className={styles.confirmBtn}
          disabled={submitting || code.length !== 4}
          onClick={onConfirm}
        >
          {'\uD655\uC778'}
        </button>
      </div>
    </div>
  )
}

export default function StudentCheckPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  return (
    <Suspense
      fallback={
        <div className={styles.page}>
          <p className={styles.subStack}>…</p>
        </div>
      }
    >
      <CheckSessionInner params={params} />
    </Suspense>
  )
}
