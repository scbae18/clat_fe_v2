'use client'

import {
  barWrapStyle,
  leftClusterStyle,
  titleBlockStyle,
  titleTextGroupStyle,
  titleTextStyle,
  codeTextStyle,
  statsRowStyle,
  statBlockStyle,
  statLabelStyle,
  statValueStyle,
  dividerStyle,
  rightClusterStyle,
  timeTextStyle,
  actionsStyle,
  btnSecondaryStyle,
  btnPrimaryStyle,
  timerIconStyle,
} from './AttendanceFloatingBar.css'

function TimerIcon() {
  return (
    <svg
      className={timerIconStyle}
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.75" />
      <path d="M12 9.5V13L14.5 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M9 4.5H15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

export interface AttendanceFloatingBarProps {
  classLabel: string
  code: string
  presentCount: number
  lateCount: number
  absentCount: number
  remainingLabel: string
  onDetail: () => void
  onEnd: () => void
}

export default function AttendanceFloatingBar({
  classLabel,
  code,
  presentCount,
  lateCount,
  absentCount,
  remainingLabel,
  onDetail,
  onEnd,
}: AttendanceFloatingBarProps) {
  return (
    <div className={barWrapStyle} role="status" aria-live="polite">
      <div className={leftClusterStyle}>
        <div className={titleBlockStyle}>
          <TimerIcon />
          <div className={titleTextGroupStyle}>
            <p className={titleTextStyle}>
              {classLabel}
              {' \uCD9C\uC11D\uCCB4\uD06C'}
            </p>
            <p className={codeTextStyle}>
              {'\uCD9C\uACB0 \uCF54\uB4DC '}
              {code || '----'}
            </p>
          </div>
        </div>
        <div className={statsRowStyle}>
          <div className={statBlockStyle}>
            <p className={statLabelStyle}>{'\uCD9C\uC11D'}</p>
            <p className={statValueStyle}>{presentCount}</p>
          </div>
          <div className={dividerStyle} />
          <div className={statBlockStyle}>
            <p className={statLabelStyle}>{'\uC9C0\uAC01'}</p>
            <p className={statValueStyle}>{lateCount}</p>
          </div>
          <div className={dividerStyle} />
          <div className={statBlockStyle}>
            <p className={statLabelStyle}>{'\uACB0\uC11D'}</p>
            <p className={statValueStyle}>{absentCount}</p>
          </div>
        </div>
      </div>
      <div className={rightClusterStyle}>
        <p className={timeTextStyle}>
          {'\uB0A8\uC740 \uC2DC\uAC04 '}
          {remainingLabel}
        </p>
        <div className={actionsStyle}>
          <button type="button" className={btnSecondaryStyle} onClick={onDetail}>
            {'\uC0C1\uC138 \uBCF4\uAE30'}
          </button>
          <button type="button" className={btnPrimaryStyle} onClick={onEnd}>
            {'\uCD9C\uACB0 \uC885\uB8CC'}
          </button>
        </div>
      </div>
    </div>
  )
}
