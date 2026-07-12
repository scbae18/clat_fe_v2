'use client'

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
  endBtnStyle,
} from './AttendanceDetailModal.css'
import {
  cellButtonGroupStyle,
  cellButtonRecipe,
} from '@/app/(main)/lesson/[id]/_components/LessonTableSection/LessonTable.css'
import {
  useAttendanceDetailSession,
  type AttendanceCheckStatus,
} from '@/hooks/attendance/useAttendanceDetailSession'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import TimerIllustration from './icons/TimerIllustration'
import { colors } from '@/styles/tokens/colors'
import type { ResolvedStudentCheckLink } from '@/lib/attendanceUrls'

const LABEL: Record<AttendanceCheckStatus, string> = {
  PRESENT: '출석',
  LATE: '지각',
  ABSENT: '결석',
}

function AttendanceStatusButtons({
  status,
  disabled,
  onChange,
}: {
  status: AttendanceCheckStatus
  disabled?: boolean
  onChange: (next: AttendanceCheckStatus) => void
}) {
  return (
    <div className={cellButtonGroupStyle}>
      <button
        type="button"
        disabled={disabled}
        className={cellButtonRecipe({ variant: status === 'PRESENT' ? 'attend' : 'default' })}
        onClick={() => onChange('PRESENT')}
      >
        {LABEL.PRESENT}
      </button>
      <button
        type="button"
        disabled={disabled}
        className={cellButtonRecipe({ variant: status === 'LATE' ? 'late' : 'default' })}
        onClick={() => onChange('LATE')}
      >
        {LABEL.LATE}
      </button>
      <button
        type="button"
        disabled={disabled}
        className={cellButtonRecipe({ variant: status === 'ABSENT' ? 'absent' : 'default' })}
        onClick={() => onChange('ABSENT')}
      >
        {LABEL.ABSENT}
      </button>
    </div>
  )
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
  const detailSession = useAttendanceDetailSession({
    isOpen,
    sessionId,
    prefetchedLinks,
  })

  const titleText = `${className} 출결 현황`

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className={rootStyle}>
        <TimerIllustration className={timerIconWrapStyle} />
        <h2 className={titleStyle}>{titleText}</h2>

        {detailSession.detail && (
          <>
            <div className={metaRowStyle}>
              <div className={metaItemStyle}>
                <span className={metaIconBoxStyle}>#</span>
                {detailSession.detail.code}
              </div>
              <div className={metaItemStyle}>
                <ClockMini />
                {detailSession.remainingLabel}
              </div>
              <div className={metaItemStyle}>
                <UsersMini />
                {detailSession.detail.total_count}명
              </div>
            </div>

            <div className={summaryRowStyle}>
              <div className={summaryCardStyle}>
                <div className={summaryInnerStyle}>
                  <p className={summaryLabelPresentStyle}>{LABEL.PRESENT}</p>
                  <p className={summaryValuePresentStyle}>{detailSession.detail.present_count}</p>
                </div>
              </div>
              <div className={summaryCardStyle}>
                <div className={summaryInnerStyle}>
                  <p className={summaryLabelAbsentStyle}>{LABEL.ABSENT}</p>
                  <p className={summaryValueAbsentStyle}>{detailSession.detail.absent_count}</p>
                </div>
              </div>
            </div>

            <div className={pillsRowStyle}>
              {(
                [
                  ['all', '전체', detailSession.detail.total_count],
                  ['present', LABEL.PRESENT, detailSession.attendChipCount],
                  ['absent', LABEL.ABSENT, detailSession.detail.absent_count],
                ] as const
              ).map(([key, label, count]) => (
                <button
                  key={key}
                  type="button"
                  className={`${pillStyle} ${detailSession.filter === key ? pillActiveStyle : pillInactiveStyle}`}
                  onClick={() => detailSession.setFilter(key)}
                >
                  <span>{label}</span>
                  <span>{count}</span>
                </button>
              ))}
            </div>

            <div className={gridStyle}>
              {detailSession.filteredStudents.map((row) => (
                <div key={row.student_id} className={studentCellStyle}>
                  <span className={studentNameStyle} title={row.student_name}>
                    {row.student_name}
                  </span>
                  <div className={studentRightStyle}>
                    <span className={timeTextStyle}>
                      {row.checked_at
                        ? format(new Date(row.checked_at), 'HH:mm', { locale: ko })
                        : '—'}
                    </span>
                    <button
                      type="button"
                      className={linkBtnStyle}
                      onClick={() => void detailSession.copyText(detailSession.urlForStudent(row))}
                    >
                      링크
                    </button>
                    <AttendanceStatusButtons
                      status={row.status}
                      disabled={detailSession.patching === row.student_id}
                      onChange={(next) => void detailSession.onStatusChange(row.student_id, next)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button type="button" className={endBtnStyle} onClick={onRequestEnd}>
              출결 종료하기
            </button>
          </>
        )}
      </div>
    </Modal>
  )
}
