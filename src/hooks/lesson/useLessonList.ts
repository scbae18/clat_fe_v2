import { useMemo, useState } from 'react'
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { addDays, format, startOfWeek } from 'date-fns'

import { invalidateLessonLists, queryKeys } from '@/lib/queryKeys'
import { lessonService, type LessonSummary } from '@/services/lesson'
import { useAttendanceSessionStore } from '@/stores/attendanceSessionStore'
import { useToastStore } from '@/stores/toastStore'

async function fetchDayLessons(date: string): Promise<LessonSummary[]> {
  const res = await lessonService.getLessons(date)
  return res.data
}

export function useLessonList(selectedDate: Date, currentWeek: Date) {
  const queryClient = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)
  const setActiveAttendance = useAttendanceSessionStore((s) => s.setActive)

  const [deleteTarget, setDeleteTarget] = useState<LessonSummary | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const weekStartKey = format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd')
  const weekStart = useMemo(() => new Date(`${weekStartKey}T00:00:00`), [weekStartKey])
  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd')
  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => format(addDays(weekStart, i), 'yyyy-MM-dd')),
    [weekStart],
  )

  const weekQueries = useQueries({
    queries: weekDates.map((date) => ({
      queryKey: queryKeys.lessons.day(date),
      queryFn: () => fetchDayLessons(date),
      refetchOnMount: 'always' as const,
    })),
  })

  const dayQuery = useQuery({
    queryKey: queryKeys.lessons.day(selectedDateKey),
    queryFn: () => fetchDayLessons(selectedDateKey),
    refetchOnMount: 'always',
  })

  const weekLessons = useMemo(() => {
    const map: Record<string, LessonSummary[]> = {}
    weekDates.forEach((date, i) => {
      map[date] = weekQueries[i]?.data ?? []
    })
    return map
  }, [weekDates, weekQueries])

  const lessons = dayQuery.data ?? weekLessons[selectedDateKey] ?? []

  const handleDeleteConfirm = async () => {
    const recordId = deleteTarget?.lesson_record_id
    if (!recordId) return
    setIsDeleting(true)
    try {
      await lessonService.deleteLesson(recordId)
      const cur = useAttendanceSessionStore.getState().active
      if (cur?.lessonRecordId === recordId) setActiveAttendance(null)
      setDeleteTarget(null)
      invalidateLessonLists(queryClient)
      addToast({ variant: 'success', message: '수업 데이터를 삭제했어요.' })
    } catch {
      addToast({ variant: 'error', message: '수업 데이터 삭제에 실패했어요.' })
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    selectedDateKey,
    weekStart,
    lessons,
    weekLessons,
    isLoadingLessons: dayQuery.isFetching && !dayQuery.data,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    handleDeleteConfirm,
  }
}
