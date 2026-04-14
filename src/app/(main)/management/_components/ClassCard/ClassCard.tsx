import { useRouter } from 'next/navigation'
import Text from '@/components/common/Text'
import Chip from '@/components/common/Chip'
import CalendarIcon from '@/assets/icons/icon-calendar.svg'
import UsersIcon from '@/assets/icons/icon-users.svg'
import {
  cardStyle,
  headerStyle,
  chipGroupStyle,
  dateStyle,
  infoGroupStyle,
  infoRowStyle,
} from './ClassCard.css'

interface ClassCardProps {
  id: number
  academyName: string
  name: string
  schedule: string
  studentCount: number
  isEnded?: boolean
  startDate?: string
  endDate?: string
}

export default function ClassCard({
  id,
  academyName,
  name,
  schedule,
  studentCount,
  isEnded,
  startDate,
  endDate,
}: ClassCardProps) {
  const router = useRouter()

  return (
    <div className={cardStyle} onClick={() => router.push(`/management/${id}`)}>
      <div className={headerStyle}>
        <div className={chipGroupStyle}>
          <Chip variant="default" label={academyName} />
          {isEnded && <Chip variant="ended" label="종료" />}
        </div>
        {isEnded && startDate && endDate && (
          <span className={dateStyle}>{startDate} – {endDate}</span>
        )}
      </div>
      <Text variant="headingLg" as="h3">{name}</Text>
      <div className={infoGroupStyle}>
        <div className={infoRowStyle}>
          <CalendarIcon width={16} height={16} />
          {schedule}
        </div>
        <div className={infoRowStyle}>
          <UsersIcon width={16} height={16} />
          {studentCount}명
        </div>
      </div>
    </div>
  )
}