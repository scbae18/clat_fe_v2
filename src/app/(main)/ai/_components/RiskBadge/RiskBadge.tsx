import type { RiskLevel } from '../../_types/atRisk'
import { badgeRecipe, dot } from './RiskBadge.css'

const LABEL: Record<RiskLevel, string> = {
  HIGH: '위험',
  MEDIUM: '주의',
  LOW: '안정',
  NEW: '관찰 중',
}

interface RiskBadgeProps {
  level: RiskLevel
  size?: 'sm' | 'md' | 'lg'
  showDot?: boolean
  label?: string
}

export default function RiskBadge({
  level,
  size = 'md',
  showDot = true,
  label,
}: RiskBadgeProps) {
  return (
    <span className={badgeRecipe({ level, size })}>
      {showDot ? <span className={dot({ level })} /> : null}
      {label ?? LABEL[level]}
    </span>
  )
}
