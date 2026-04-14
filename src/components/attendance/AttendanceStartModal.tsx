'use client'

import { useState } from 'react'
import Modal from '@/components/common/Modal'
import {
  rootStyle,
  timerIconWrapStyle,
  titleStyle,
  subtitleStyle,
  sectionLabelStyle,
  chipRowStyle,
  chipStyle,
  chipSelectedStyle,
  directInputStyle,
  infoBoxStyle,
  infoListStyle,
  actionsRowStyle,
  actionHalfStyle,
  cancelBtnStyle,
  primaryBtnStyle,
} from './AttendanceStartModal.css'
import { attendanceService } from '@/services/attendance'
import { useAttendanceSessionStore } from '@/stores/attendanceSessionStore'
import { useToastStore } from '@/stores/toastStore'
import TimerIllustration from './icons/TimerIllustration'
import {
  resolveStudentCheckLinks,
  type ResolvedStudentCheckLink,
} from '@/lib/attendanceUrls'

const PRESETS = [5, 10, 15, 20] as const

const MSG = {
  startOk: '\uCD9C\uACB0\uC774 \uC2DC\uC791\uB410\uC5B4\uC694.',
  startFail: '\uCD9C\uACB0 \uC2DC\uC791\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694.',
  title: '\uCD9C\uACB0\uC744 \uC2DC\uC791\uD560\uAC8C\uC694',
  subtitleTail:
    '\uBA85\uC5D0\uAC8C \uC54C\uB9BC\uD1A1\uC774 \uBC1C\uC1A1\uB418\uACE0 \uCD9C\uACB0\uC774 \uC2DC\uC791\uB3FC\uC694.',
  limit: '\uC81C\uD55C \uC2DC\uAC04',
  min: '\uBD84',
  direct: '\uC9C1\uC811 \uC785\uB825',
  directPh: '\uBD84 \uB2E8\uC704 \uC22B\uC790',
  li1:
    '\uC2DC\uAC04 \uCD08\uACFC \uC2DC \uBBF8\uD655\uC778 \uD559\uC0DD\uC740 \uC790\uB3D9\uC73C\uB85C \uACB0\uC11D \uCC98\uB9AC\uB3FC\uC694.',
  li2:
    '\uCD9C\uACB0 \uD6C4 \uC218\uC5C5 \uC785\uB825 \uD654\uBA74\uC5D0\uC11C \uC9C1\uC811 \uC218\uC815\uD560 \uC218 \uC788\uC5B4\uC694.',
  cancel: '\uCDE8\uC18C',
  startBtn: '\uCD9C\uACB0 \uC2DC\uC791',
} as const

export interface AttendanceStudentRef {
  id: number
  name: string
}

export interface AttendanceStartModalProps {
  isOpen: boolean
  onClose: () => void
  lessonRecordId: number
  className: string
  studentCount: number
  students?: AttendanceStudentRef[]
}

export default function AttendanceStartModal({
  isOpen,
  onClose,
  lessonRecordId,
  className,
  studentCount,
  students = [],
}: AttendanceStartModalProps) {
  const [preset, setPreset] = useState<number | 'direct'>(15)
  const [directVal, setDirectVal] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const setActive = useAttendanceSessionStore((s) => s.setActive)
  const addToast = useToastStore((s) => s.addToast)

  const effectiveMinutes =
    preset === 'direct' ? Math.max(1, Math.floor(Number(directVal)) || 1) : preset

  const resetAndClose = () => {
    setPreset(15)
    setDirectVal('')
    onClose()
  }

  const handleStart = async () => {
    setSubmitting(true)
    try {
      const res = await attendanceService.createSession({
        lesson_record_id: lessonRecordId,
        duration_minutes: effectiveMinutes,
      })
      if (!res.session_id || !res.expires_at) throw new Error('INVALID_SESSION')
      const studentLinks = resolveStudentCheckLinks(
        res.session_id,
        students,
        res.student_links
      )
      setActive({
        sessionId: res.session_id,
        lessonRecordId,
        className,
        code: res.code,
        expiresAt: res.expires_at,
        studentLinks,
      })
      addToast({ variant: 'success', message: MSG.startOk })
      resetAndClose()
    } catch {
      addToast({ variant: 'error', message: MSG.startFail })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} size="md">
      <div className={rootStyle}>
        <TimerIllustration className={timerIconWrapStyle} />

        <h2 className={titleStyle}>{MSG.title}</h2>
        <p className={subtitleStyle}>
          {className} {studentCount}
          {MSG.subtitleTail}
        </p>

        <p className={sectionLabelStyle}>{MSG.limit}</p>
        <div className={chipRowStyle}>
          {PRESETS.map((m) => (
            <button
              key={m}
              type="button"
              className={`${chipStyle}${preset === m ? ` ${chipSelectedStyle}` : ''}`}
              onClick={() => setPreset(m)}
            >
              {m}
              {MSG.min}
            </button>
          ))}
          <button
            type="button"
            className={`${chipStyle}${preset === 'direct' ? ` ${chipSelectedStyle}` : ''}`}
            onClick={() => setPreset('direct')}
          >
            {MSG.direct}
          </button>
        </div>
        {preset === 'direct' && (
          <input
            className={directInputStyle}
            type="number"
            min={1}
            placeholder={MSG.directPh}
            value={directVal}
            onChange={(e) => setDirectVal(e.target.value)}
          />
        )}

        <div className={infoBoxStyle}>
          <ul className={infoListStyle}>
            <li>{MSG.li1}</li>
            <li>{MSG.li2}</li>
          </ul>
        </div>

        <div className={actionsRowStyle}>
          <button
            type="button"
            className={`${actionHalfStyle} ${cancelBtnStyle}`}
            onClick={resetAndClose}
            disabled={submitting}
          >
            {MSG.cancel}
          </button>
          <button
            type="button"
            className={`${actionHalfStyle} ${primaryBtnStyle}`}
            onClick={handleStart}
            disabled={submitting}
          >
            {MSG.startBtn} {'\u00B7'} {effectiveMinutes}
            {MSG.min}
          </button>
        </div>
      </div>
    </Modal>
  )
}
