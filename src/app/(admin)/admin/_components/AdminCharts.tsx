'use client'

import {
  AreaChart,
  Area,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { colors } from '@/styles/tokens/colors'

const GRID = colors.gray50
const TICK = colors.gray500
const TOOLTIP = {
  backgroundColor: colors.white,
  border: `1px solid ${colors.gray75}`,
  borderRadius: '10px',
  color: colors.gray900,
  fontSize: '12px',
  boxShadow: '0 4px 6px rgba(54, 55, 68, 0.04), 0 12px 40px rgba(54, 55, 68, 0.08)',
}

export function TrendChart({
  data,
  color = colors.primary500,
  label = '건수',
}: {
  data: Array<{ date: string; value: number }>
  color?: string
  label?: string
}) {
  const gradId = `admin-grad-${color.replace('#', '')}`
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.15} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: TICK }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: TICK }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={TOOLTIP}
          formatter={(value) => [value ?? 0, label]}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradId})`}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function BarChart({
  data,
  color = colors.primary500,
  valueLabel = '건수',
  height = 200,
}: {
  data: Array<{ label: string; value: number }>
  color?: string
  valueLabel?: string
  height?: number
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: TICK }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: TICK }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip contentStyle={TOOLTIP} formatter={(value) => [value ?? 0, valueLabel]} />
        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} maxBarSize={48} />
      </ReBarChart>
    </ResponsiveContainer>
  )
}
