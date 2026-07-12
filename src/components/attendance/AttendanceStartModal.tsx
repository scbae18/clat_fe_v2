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
import TimerIllustration from './icons/TimerIllustration'
import {
  useStartAttendanceSession,
  type AttendanceStudentRef,
} from '@/hooks/attendance/useStartAttendanceSession'

const PRESETS = [5, 10, 15, 20] as const

const MSG = {
  title: '출결을 시작할까요',
  subtitleTail: '명에게 알림톡이 발송되고 출결이 시작돼요.',
  limit: '제한 시간',
  min: '분',
  direct: '직접 입력',
  directPh: '분 단위 숫자',
  li1: '시간 초과 시 미확인 학생은 자동으로 결석 처리돼요.',
  li2: '출결 후 수업 입력 화면에서 직접 수정할 수 있어요.',
  cancel: '취소',
  startBtn: '출결 시작',
} as const

export type { AttendanceStudentRef }

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

  const resetAndClose = () => {
    setPreset(15)
    setDirectVal('')
    onClose()
  }

  const { start, submitting } = useStartAttendanceSession({
    lessonRecordId,
    className,
    students,
    onStarted: resetAndClose,
  })

  const effectiveMinutes =
    preset === 'direct' ? Math.max(1, Math.floor(Number(directVal)) || 1) : preset

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
            onClick={() => void start(effectiveMinutes)}
            disabled={submitting}
          >
            {MSG.startBtn} · {effectiveMinutes}
            {MSG.min}
          </button>
        </div>
      </div>
    </Modal>
  )
}
