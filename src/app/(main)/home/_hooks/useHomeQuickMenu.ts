import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { alimtalkService } from '@/services/alimtalk'
import { lessonService } from '@/services/lesson'
import { studentService } from '@/services/student'

export type HomeQuickMenuStats = {
  unenteredClassCount: number
  todayClassCount: number
  lessonProgress: number
  monthSendCount: number
  incompleteStudentCount: number
  studentCount: number
  studentProgress: number
}

const EMPTY_STATS: HomeQuickMenuStats = {
  unenteredClassCount: 0,
  todayClassCount: 0,
  lessonProgress: 0,
  monthSendCount: 0,
  incompleteStudentCount: 0,
  studentCount: 0,
  studentProgress: 0,
}

/** 미입력 0개면 100%. 그 외에는 입력 완료 반 / 오늘 반 */
function lessonCompletePercent(unentered: number, total: number): number {
  if (unentered <= 0) return 100
  if (total <= 0) return 100
  return Math.round(((total - unentered) / total) * 100)
}

function ratioPercent(part: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((part / total) * 100)
}

/** 한국 달력 기준 이번 달 00:00 ~ 말일 24:00 직전 */
function seoulMonthBounds(now = new Date()): { from: Date; to: Date } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'numeric',
  }).formatToParts(now)
  const year = Number(parts.find((p) => p.type === 'year')?.value)
  const month = Number(parts.find((p) => p.type === 'month')?.value)
  const from = new Date(`${year}-${String(month).padStart(2, '0')}-01T00:00:00+09:00`)
  const nextMonth = month === 12 ? 1 : month + 1
  const nextYear = month === 12 ? year + 1 : year
  const nextStart = new Date(
    `${nextYear}-${String(nextMonth).padStart(2, '0')}-01T00:00:00+09:00`,
  )
  return { from, to: new Date(nextStart.getTime() - 1) }
}

/**
 * 발송 내역과 같은 목록(최신순)을 가져와,
 * 한국 시간 이번 달 sent_at 인 배치의 total_count(통 수)만 합산.
 * from/to 쿼리는 ISO 문자열이 Date로 바뀌며 400이 나 0이 되므로 쓰지 않는다.
 */
async function fetchMonthSendCount(): Promise<number> {
  const { from, to } = seoulMonthBounds()
  const fromMs = from.getTime()
  const toMs = to.getTime()
  let page = 1
  let sum = 0

  while (page <= 20) {
    const res = await alimtalkService.getBatches({ page, limit: 100 })
    const rows = res.data ?? []
    if (rows.length === 0) break

    let reachedOlderMonth = false
    for (const batch of rows) {
      const t = new Date(batch.sent_at).getTime()
      if (Number.isNaN(t) || t < fromMs) {
        reachedOlderMonth = true
        break
      }
      if (t > toMs) continue
      sum += batch.total_count
    }

    if (reachedOlderMonth || rows.length < 100) break
    page += 1
  }

  return sum
}

export function useHomeQuickMenu() {
  const [stats, setStats] = useState<HomeQuickMenuStats>(EMPTY_STATS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      const today = format(new Date(), 'yyyy-MM-dd')
      const [lessonsRes, studentsRes, monthSendCount] = await Promise.all([
        lessonService.getLessons(today).catch(() => ({ data: [] as const })),
        studentService.getStudents().catch(() => ({ data: [] as const })),
        fetchMonthSendCount().catch(() => 0),
      ])

      if (cancelled) return

      const lessons = lessonsRes.data ?? []
      const unenteredClassCount = lessons.filter((lesson) => lesson.progress_rate < 1).length
      const todayClassCount = lessons.length

      const students = studentsRes.data ?? []
      const incompleteStudentCount = students.filter(
        (student) => (student.total_incomplete_items ?? 0) > 0,
      ).length
      const studentCount = students.length

      setStats({
        unenteredClassCount,
        todayClassCount,
        lessonProgress: lessonCompletePercent(unenteredClassCount, todayClassCount),
        monthSendCount,
        incompleteStudentCount,
        studentCount,
        studentProgress: ratioPercent(incompleteStudentCount, studentCount),
      })
      setIsLoading(false)
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return { stats, isLoading }
}
