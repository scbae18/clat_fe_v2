'use client'

import { useRouter } from 'next/navigation'
import Modal from '@/components/common/Modal'
import {
  rootStyle,
  iconWrapStyle,
  titleStyle,
  summaryRowStyle,
  summaryCardStyle,
  summaryInnerStyle,
  summaryLabelPrimaryStyle,
  summaryLabelMutedStyle,
  summaryValuePrimaryStyle,
  summaryValueMutedStyle,
  ctaBtnStyle,
} from './AttendanceEndedModal.css'

type Props = {
  isOpen: boolean
  onClose: () => void
  lessonRecordId: number
  presentCount: number
  lateCount: number
  absentCount: number
}

function CheckIcon() {
  return (
    <svg
      className={iconWrapStyle}
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="30" cy="30" r="30" fill="#3B51CC" />
      <path d="M17 31L26 40L43 23" stroke="white" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

export default function AttendanceEndedModal({
  isOpen,
  onClose,
  lessonRecordId,
  presentCount,
  lateCount,
  absentCount,
}: Props) {
  const router = useRouter()
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className={rootStyle}>
        <CheckIcon />
        <h2 className={titleStyle}>{'\uCD9C\uACB0\uC774 \uC885\uB8CC\uB410\uC5B4\uC694'}</h2>

        <div className={summaryRowStyle}>
          <div className={summaryCardStyle}>
            <div className={summaryInnerStyle}>
              <p className={summaryLabelPrimaryStyle}>{'\uCD9C\uC11D'}</p>
              <p className={summaryValuePrimaryStyle}>{presentCount}</p>
            </div>
          </div>
          <div className={summaryCardStyle}>
            <div className={summaryInnerStyle}>
              <p className={summaryLabelMutedStyle}>{'\uC9C0\uAC01'}</p>
              <p className={summaryValueMutedStyle}>{lateCount}</p>
            </div>
          </div>
          <div className={summaryCardStyle}>
            <div className={summaryInnerStyle}>
              <p className={summaryLabelMutedStyle}>{'\uACB0\uC11D'}</p>
              <p className={summaryValueMutedStyle}>{absentCount}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className={ctaBtnStyle}
          onClick={() => {
            onClose()
            router.push(`/lesson/${lessonRecordId}`)
          }}
        >
          {'\uC218\uC5C5 \uC785\uB825\uD558\uAE30 \u2192'}
        </button>
      </div>
    </Modal>
  )
}
