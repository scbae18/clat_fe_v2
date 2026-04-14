import { wrapperStyle, labelStyle, trackStyle, barStyle, countStyle } from './ProgressBar.css'

interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = total === 0 ? 0 : Math.round((current / total) * 100)

  return (
    <div className={wrapperStyle}>
      <span className={labelStyle}>진행도</span>
      <div className={trackStyle}>
        <div className={barStyle} style={{ width: `${percent}%` }} />
      </div>
      <span className={countStyle}>{current}/{total}명 입력</span>
    </div>
  )
}