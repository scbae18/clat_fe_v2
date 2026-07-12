import type { LessonStudent } from '@/types/lessonStudent'
import type { LessonItemDetail, CreateLessonAdhocItemBody } from '@/services/lesson'
import { joinScoreStorage, splitScoreStorage } from '@/lib/lessonScore'
import { matchesLessonItem } from '@/lib/lessonItemRef'
import { activeRowTdStyle } from './LessonTable.css'

export function mapFormToAdhocBody(
  label: string,
  type: string,
  choices?: string[],
): CreateLessonAdhocItemBody {
  const itemTypeMap = {
    number: 'SCORE',
    text: 'TEXT',
    choice: 'SELECT',
    completion: 'COMPLETE',
  } as const

  const body: CreateLessonAdhocItemBody = {
    name: label,
    is_common: false,
    item_type: itemTypeMap[type as keyof typeof itemTypeMap] ?? 'TEXT',
  }

  if (type === 'choice' && choices?.length) {
    body.options = choices
  }

  return body
}

export function isScoreItem(item: LessonItemDetail) {
  return item.item_type === 'SCORE' || item.item_type === 'NUMBER'
}

export function getTdClassName(
  base: string,
  studentId: number,
  focusedStudentId: number | null,
) {
  return focusedStudentId === studentId ? `${base} ${activeRowTdStyle}` : base
}

export function getScoreColumnMax(students: LessonStudent[], item: LessonItemDetail): string {
  for (const s of students) {
    const v = s.items.find((i) => matchesLessonItem(i, item))?.value ?? ''
    const { max } = splitScoreStorage(v)
    if (max) return max
  }
  return ''
}

export function applyScoreMaxToAllStudents(
  students: LessonStudent[],
  item: LessonItemDetail,
  maxStr: string,
): LessonStudent[] {
  return students.map((s) => {
    const it = s.items.find((i) => matchesLessonItem(i, item))
    const { earned } = splitScoreStorage(it?.value ?? '')
    return {
      ...s,
      items: s.items.map((i) =>
        matchesLessonItem(i, item) ? { ...i, value: joinScoreStorage(earned, maxStr) } : i,
      ),
    }
  })
}

export const SCORE_STATS_EMPTY = '입력 시 평균·최고 표시'

export function formatScoreStats(avg: number, max: number) {
  return `평균 ${avg.toFixed(1)}점 · 최고 ${String(Math.round(max * 10) / 10)}점`
}
