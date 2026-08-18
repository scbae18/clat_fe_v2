import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'

export const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const

function asDate(value: string | Date): Date {
  return typeof value === 'string' ? parseISO(value) : value
}

export function formatYmd(value: string | Date): string {
  const d = asDate(value)
  if (Number.isNaN(d.getTime())) return '-'
  return format(d, 'yyyy.MM.dd')
}

export function formatMd(value: string | Date): string {
  const d = asDate(value)
  if (Number.isNaN(d.getTime())) return '-'
  return format(d, 'MM.dd')
}

export function formatMdE(value: string | Date): string {
  const d = asDate(value)
  if (Number.isNaN(d.getTime())) return '-'
  return format(d, 'MM.dd (E)', { locale: ko })
}

export function formatMdHm(value: string | Date): string {
  const d = asDate(value)
  if (Number.isNaN(d.getTime())) return '-'
  return format(d, 'MM.dd HH:mm')
}

export function formatLong(value: string | Date): string {
  const d = asDate(value)
  if (Number.isNaN(d.getTime())) return '-'
  return format(d, 'yyyy년 M월 d일 (E) HH:mm 기준', { locale: ko })
}

export function formatToday(value: string | Date): string {
  const d = asDate(value)
  if (Number.isNaN(d.getTime())) return '-'
  return format(d, 'M월 d일 (E)', { locale: ko })
}

export function fromNow(value: string | Date | null): string {
  if (!value) return '기록 없음'
  const d = asDate(value)
  if (Number.isNaN(d.getTime())) return '-'
  return formatDistanceToNow(d, { locale: ko, addSuffix: true })
}

export function daysLabel(days: number[]): string {
  if (days.length === 0) return '-'
  return [...days]
    .sort((a, b) => a - b)
    .map((d) => DAY_LABELS[d] ?? d)
    .join('·')
}
