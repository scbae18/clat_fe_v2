import {
  dateCardRecipe,
  dayStyle,
  dateStyle,
  dateDefaultStyle,
  dateSelectedStyle,
  chipWrapStyle,
  statusDotRecipe,
} from './DateCard.css'
import Chip from '@/components/common/Chip'

type DateStatus = 'done' | 'inProgress' | 'none'

interface DateCardProps {
  day: string
  date: number
  status: DateStatus
  isSelected: boolean
  onClick: () => void
  dataTour?: string
}

const STATUS_LABEL: Record<DateStatus, string> = {
  done: '입력 완료',
  inProgress: '입력 중',
  none: '입력 전',
}

const STATUS_VARIANT: Record<DateStatus, 'done' | 'inProgress' | 'default'> = {
  done: 'done',
  inProgress: 'inProgress',
  none: 'default',
}

export default function DateCard({ day, date, status, isSelected, onClick, dataTour }: DateCardProps) {
  return (
    <div className={dateCardRecipe({ selected: isSelected })} onClick={onClick} data-tour={dataTour}>
      <span className={dayStyle}>{day}</span>
      <span className={`${dateStyle} ${isSelected ? dateSelectedStyle : dateDefaultStyle}`}>
        {date}
      </span>
      <span className={chipWrapStyle}>
        <Chip label={STATUS_LABEL[status]} variant={STATUS_VARIANT[status]} />
      </span>
      <span
        className={statusDotRecipe({ status })}
        aria-label={STATUS_LABEL[status]}
      />
    </div>
  )
}
