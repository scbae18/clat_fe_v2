import type { RiskHistoryPoint } from '../../_types/atRisk'
import * as styles from './ScoreTrendMini.css'

interface ScoreTrendMiniProps {
  data: RiskHistoryPoint[]
  height?: number
}

const WIDTH = 720
const MARGIN = { top: 12, right: 16, bottom: 28, left: 32 }
const SCORE_MAX = 100

function dotClass(level: RiskHistoryPoint['level']): string {
  if (level === 'HIGH') return `${styles.dot} ${styles.dotHigh}`
  if (level === 'MEDIUM') return `${styles.dot} ${styles.dotMedium}`
  return `${styles.dot} ${styles.dotLow}`
}

export default function ScoreTrendMini({ data, height = 220 }: ScoreTrendMiniProps) {
  if (data.length === 0) return null

  const chartW = WIDTH - MARGIN.left - MARGIN.right
  const chartH = height - MARGIN.top - MARGIN.bottom

  const xStep = data.length > 1 ? chartW / (data.length - 1) : chartW
  const yScale = (score: number) => chartH - (score / SCORE_MAX) * chartH

  const points = data.map((p, i) => ({
    x: MARGIN.left + i * xStep,
    y: MARGIN.top + yScale(p.score),
    point: p,
  }))

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(' ')

  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(2)} ${
    MARGIN.top + chartH
  } L ${points[0].x.toFixed(2)} ${MARGIN.top + chartH} Z`

  const yTicks = [0, 40, 70, 100]

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${WIDTH} ${height}`}
        preserveAspectRatio="none"
        role="img"
        aria-label="위험도 추이 그래프"
      >
        {yTicks.map((tick) => {
          const y = MARGIN.top + yScale(tick)
          const lineClass =
            tick === 70
              ? styles.thresholdHigh
              : tick === 40
                ? styles.thresholdMedium
                : styles.grid
          return (
            <g key={tick}>
              <line
                className={lineClass}
                x1={MARGIN.left}
                y1={y}
                x2={WIDTH - MARGIN.right}
                y2={y}
              />
              <text
                className={styles.axisLabel}
                x={8}
                y={y}
                dominantBaseline="middle"
              >
                {tick}
              </text>
            </g>
          )
        })}

        <path className={styles.areaPath} d={areaPath} />
        <path className={styles.linePath} d={linePath} />

        {points.map((p) => (
          <circle
            key={p.point.date}
            className={dotClass(p.point.level)}
            cx={p.x}
            cy={p.y}
            r={4}
          />
        ))}

        {points.map((p, i) => {
          if (i % 2 !== 0 && i !== points.length - 1) return null
          return (
            <text
              key={`x-${p.point.date}`}
              className={styles.axisLabel}
              x={p.x}
              y={height - 8}
              textAnchor="middle"
            >
              {p.point.date.slice(5)}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
