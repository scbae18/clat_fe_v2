'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { colors } from '@/styles/tokens/colors'
import type { ScoreHistoryPoint } from '@/services/studentDashboard'
import { parseLessonScoreValue } from '@/lib/lessonScore'
import * as styles from './studentDashboard.css'

const SERIES_COLORS = [
  colors.primary500,
  colors.success500,
  colors.warning500,
  colors.error500,
  colors.primary300,
  colors.gray600,
] as const

function chartYFromRaw(value: string): number | null {
  const p = parseLessonScoreValue(value)
  if (!p || p.earned == null) return null
  return p.percent != null ? p.percent : p.earned
}

export interface ChartPointMeta extends ScoreHistoryPoint {
  studentValue: number
  rawLabel: string
}

export interface ScoreSeries {
  itemName: string
  color: string
  points: { xIdx: number; meta: ChartPointMeta }[]
}

function buildSeries(rows: ScoreHistoryPoint[]): {
  xKeys: string[]
  xLabels: string[]
  series: ScoreSeries[]
  yMin: number
  yMax: number
} {
  const sorted = [...rows].sort((a, b) => {
    const d = a.lesson_date.localeCompare(b.lesson_date)
    if (d !== 0) return d
    const lr = (a.lesson_record_id ?? 0) - (b.lesson_record_id ?? 0)
    if (lr !== 0) return lr
    return a.item_name.localeCompare(b.item_name)
  })

  const xKeys: string[] = []
  const seen = new Set<string>()
  for (const r of sorted) {
    const k = String(r.lesson_record_id ?? `${r.lesson_date}-${r.class_name}`)
    if (!seen.has(k)) {
      seen.add(k)
      xKeys.push(k)
    }
  }

  const labelByKey = new Map<string, string>()
  for (const r of sorted) {
    const k = String(r.lesson_record_id ?? `${r.lesson_date}-${r.class_name}`)
    if (!labelByKey.has(k)) {
      const md = r.lesson_date.slice(5).replace('-', '/')
      labelByKey.set(k, `${md} · ${r.class_name}`)
    }
  }
  const xLabels = xKeys.map((k) => labelByKey.get(k) ?? k)

  const byItem = new Map<string, ScoreHistoryPoint[]>()
  for (const r of sorted) {
    const arr = byItem.get(r.item_name) ?? []
    arr.push(r)
    byItem.set(r.item_name, arr)
  }

  let yMin = Infinity
  let yMax = -Infinity
  const series: ScoreSeries[] = []
  let colorIdx = 0

  for (const [itemName, itemRows] of [...byItem.entries()].sort((a, b) =>
    a[0].localeCompare(b[0])
  )) {
    const pts: { xIdx: number; meta: ChartPointMeta }[] = []
    for (const r of itemRows) {
      const studentValue = chartYFromRaw(r.value)
      if (studentValue === null) continue
      const k = String(r.lesson_record_id ?? `${r.lesson_date}-${r.class_name}`)
      const xIdx = xKeys.indexOf(k)
      if (xIdx < 0) continue
      yMin = Math.min(yMin, studentValue)
      yMax = Math.max(yMax, studentValue)
      const rawLabel = (r.value ?? '').trim() || '—'
      pts.push({
        xIdx,
        meta: { ...r, studentValue, rawLabel },
      })
    }
    if (pts.length === 0) continue
    pts.sort((a, b) => a.xIdx - b.xIdx)
    const color = SERIES_COLORS[colorIdx % SERIES_COLORS.length]
    colorIdx += 1
    series.push({ itemName, color, points: pts })
  }

  if (!Number.isFinite(yMin) || !Number.isFinite(yMax)) {
    yMin = 0
    yMax = 1
  } else if (yMin === yMax) {
    yMin -= 1
    yMax += 1
  }

  return { xKeys, xLabels, series, yMin, yMax }
}

function buildPath(
  points: { xIdx: number; meta: ChartPointMeta }[],
  yMin: number,
  yMax: number,
  width: number,
  height: number,
  padX: number,
  padY: number,
  xCount: number
) {
  if (points.length === 0) return ''
  const spread = yMax - yMin || 1
  const innerW = width - padX * 2
  const innerH = height - padY * 2
  const xAt = (xIdx: number) =>
    padX + (innerW * xIdx) / Math.max(1, xCount - 1)
  const yAt = (v: number) => padY + innerH - ((v - yMin) / spread) * innerH

  return points
    .map((p, i) => {
      const x = xAt(p.xIdx)
      const y = yAt(p.meta.studentValue)
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

const MSG = {
  empty: '\uD45C\uC2DC\uD560 \uC810\uC218 \uAE30\uB85D\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.',
  myScore: '\uB0B4 \uC810\uC218',
  classAvg: '\uBC18 \uD3C9\uADE0',
  classHigh: '\uBC18 \uCD5C\uACE0',
  dash: '\u2014',
  axisHint: '\uB9CC\uC810 \uC788\uC74C: 100\uC810 \uD658\uC0B0',
} as const

function fmtNum(n: number | null | undefined, digits = 1): string {
  if (n == null || !Number.isFinite(n)) return MSG.dash
  return digits === 0 ? String(Math.round(n)) : n.toFixed(digits)
}

export default function ScoreLineChart({
  rows,
  motionKey,
}: {
  rows: ScoreHistoryPoint[]
  /** 기간·데이터가 바뀔 때마다 전달하면 차트가 짧게 다시 그려집니다. */
  motionKey?: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [tip, setTip] = useState<{
    left: number
    top: number
    meta: ChartPointMeta
  } | null>(null)

  const { xKeys, xLabels, series, yMin, yMax } = useMemo(() => buildSeries(rows), [rows])

  const w = 564
  const h = 260
  const padX = 48
  const padY = 28

  const hideTip = useCallback(() => setTip(null), [])

  const showTip = useCallback(
    (e: React.MouseEvent, meta: ChartPointMeta) => {
      const el = wrapRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setTip({
        left: Math.min(Math.max(e.clientX - r.left, 8), r.width - 8),
        top: Math.max(e.clientY - r.top - 8, 8),
        meta,
      })
    },
    []
  )

  if (series.length === 0) {
    return <div className={styles.emptyState}>{MSG.empty}</div>
  }

  const gridTicks = [0, 0.25, 0.5, 0.75, 1]
  const gridY = gridTicks.map((t) => padY + (h - padY * 2) * (1 - t))
  const xCount = xKeys.length
  const anyFrac = rows.some((r) => String(r.value ?? '').includes('/'))
  const yAxisUnit = anyFrac ? '%' : ''

  return (
    <div ref={wrapRef} className={styles.chartWrap}>
      {anyFrac ? (
        <p className={styles.chartAxisHint}>{MSG.axisHint}</p>
      ) : null}
      {tip && (
        <div
          className={styles.chartTooltip}
          style={{
            left: tip.left,
            top: tip.top,
            transform: 'translate(-50%, calc(-100% - 10px))',
          }}
        >
          <div className={styles.chartTooltipTitle}>
            {tip.meta.item_name}{' '}
            <span className={styles.chartTooltipMuted}>
              ({tip.meta.lesson_date} · {tip.meta.class_name})
            </span>
          </div>
          <div className={styles.chartTooltipRow}>
            <span className={styles.chartTooltipMuted}>입력</span>
            <span>{tip.meta.rawLabel}</span>
          </div>
          <div className={styles.chartTooltipRow}>
            <span className={styles.chartTooltipMuted}>{MSG.myScore}</span>
            <span>
              {fmtNum(tip.meta.studentValue, 1)}
              {anyFrac ? '%' : '\uC810'}
            </span>
          </div>
          <div className={styles.chartTooltipRow}>
            <span className={styles.chartTooltipMuted}>{MSG.classAvg}</span>
            <span>{fmtNum(tip.meta.lesson_avg ?? null, 1)}</span>
          </div>
          <div className={styles.chartTooltipRow}>
            <span className={styles.chartTooltipMuted}>{MSG.classHigh}</span>
            <span>{fmtNum(tip.meta.lesson_high ?? null, 0)}</span>
          </div>
        </div>
      )}

      <div className={styles.chartLegend}>
        {series.map((s) => (
          <span key={s.itemName} className={styles.chartLegendItem}>
            <span
              className={styles.chartLegendSwatch}
              style={{ backgroundColor: s.color }}
            />
            {s.itemName}
          </span>
        ))}
      </div>

      <div
        className={`${styles.chartSvgArea} ${styles.chartMotion}`}
        key={motionKey ?? String(rows.length)}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ display: 'block' }}
          onMouseLeave={hideTip}
        >
        {gridY.map((y, i) => {
          const t = gridTicks[i]
          const val = yMin + (yMax - yMin) * t
          return (
            <g key={`grid-${i}`}>
              <line
                x1={padX}
                x2={w - padX}
                y1={y}
                y2={y}
                stroke={colors.gray50}
                strokeWidth={1}
              />
              <text
                x={padX - 8}
                y={y + 3}
                textAnchor="end"
                fill={colors.gray500}
                fontSize="10"
              >
                {`${Math.round(val)}${yAxisUnit}`}
              </text>
            </g>
          )
        })}
        {xLabels.map((label, i) => {
          const innerW = w - padX * 2
          const x = padX + (innerW * i) / Math.max(1, xCount - 1)
          return (
            <text
              key={`${label}-${i}`}
              x={x}
              y={h - 6}
              textAnchor={xCount <= 1 ? 'middle' : i === 0 ? 'start' : i === xCount - 1 ? 'end' : 'middle'}
              fill={colors.gray500}
              fontSize="10"
            >
              {label.length > 14 ? `${label.slice(0, 12)}…` : label}
            </text>
          )
        })}
        {series.map((s) => (
          <path
            key={s.itemName}
            d={buildPath(s.points, yMin, yMax, w, h, padX, padY, xCount)}
            fill="none"
            stroke={s.color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {series.map((s) =>
          s.points.map((p, i) => {
            const spread = yMax - yMin || 1
            const innerW = w - padX * 2
            const innerH = h - padY * 2
            const x = padX + (innerW * p.xIdx) / Math.max(1, xCount - 1)
            const y =
              padY + innerH - ((p.meta.studentValue - yMin) / spread) * innerH
            return (
              <circle
                key={`${s.itemName}-${p.xIdx}-${i}`}
                cx={x}
                cy={y}
                r={5}
                fill={colors.white}
                stroke={s.color}
                strokeWidth={2}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => showTip(e, p.meta)}
                onMouseMove={(e) => showTip(e, p.meta)}
              />
            )
          })
        )}
        </svg>
      </div>
    </div>
  )
}
