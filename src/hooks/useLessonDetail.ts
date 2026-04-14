import { useState, useEffect } from 'react'
import type { LessonStudent } from '@/types/lessonStudent'
import { lessonService, type LessonDetail } from '@/services/lesson'
import { classService } from '@/services/class'
import useDisclosure from './useDisclosure'
import { useToastStore } from '@/stores/toastStore'

export default function useLessonDetail(lessonId: number) {
  const [lesson, setLesson] = useState<LessonDetail | null>(null)
  const [commonValues, setCommonValues] = useState<Record<number, string>>({})
  const [students, setStudents] = useState<LessonStudent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [error, setError] = useState<'TEMPLATE_NOT_FOUND' | null>(null)
  const alimtalkSendModal = useDisclosure()
  const addToast = useToastStore((s) => s.addToast)

  const refetch = () => {
    setError(null)
    setRefreshKey((k) => k + 1)
  }

  useEffect(() => {
    if (!lessonId) return
    setIsLoading(true)
    let cancelled = false

    lessonService
      .getLesson(lessonId)
      .then(async (data) => {
        if (cancelled) return
        setLesson(data)

        // 공통 값 매핑
        const values: Record<number, string> = {}
        data.common_data.forEach((item) => {
          values[item.template_item_id] = item.value
        })
        setCommonValues(values)

        const individualItems = data.items.filter(
          (i) => !i.is_common && i.item_type !== 'ATTENDANCE'
        )
        const attendanceItems = data.items.filter((i) => i.item_type === 'ATTENDANCE')

        // 이름만 classStudents에서 가져오기
        const classStudents = await classService.getClassStudents(data.class_id, data.lesson_date)
        const nameMap = new Map(classStudents.map((s) => [s.id, s.name]))

        const baseStudentIds =
          data.student_data.length > 0
            ? data.student_data.map((sd) => sd.student_id)
            : classStudents.map((s) => s.id)

        const initialized: LessonStudent[] = baseStudentIds.map((studentId) => {
          const sd = data.student_data.find((s) => s.student_id === studentId)
          const sdItems = sd?.items ?? []

          const attendanceItem =
            attendanceItems.find((ai) => sdItems.some((si) => si.template_item_id === ai.id)) ??
            attendanceItems[0]

          const attendanceRaw = attendanceItem
            ? (sdItems.find((si) => si.template_item_id === attendanceItem.id)?.value ?? null)
            : null
          const attendance: LessonStudent['attendance'] =
            attendanceRaw === '출석' || attendanceRaw === '지각' || attendanceRaw === '결석'
              ? attendanceRaw
              : null

          return {
            id: studentId,
            name: nameMap.get(studentId) ?? '',
            attendance,
            items: individualItems.map((item) => {
              const existing = sdItems.find((si) => si.template_item_id === item.id)
              return {
                template_item_id: item.id,
                value: existing?.value ?? '',
                is_completed:
                  typeof existing?.is_completed === 'boolean' ? existing.is_completed : null,
              }
            }),
          }
        })

        setStudents(initialized)
      })
      .catch((err: any) => {
        if (cancelled) return
        if (err?.response?.data?.error?.code === 'TEMPLATE_NOT_FOUND') {
          setError('TEMPLATE_NOT_FOUND')
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [lessonId, refreshKey])

  const inputCount = students.filter((s) => {
    if (s.attendance === null) return false
    return s.items.every((item) => {
      if (item.is_completed !== null) return item.is_completed !== null
      return item.value.trim() !== ''
    })
  }).length

  const handleExcelDownload = async () => {
    if (!lesson) return
    try {
      const blob = await lessonService.exportLesson(lesson.id)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `lesson-message-${lesson.id}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      addToast({
        variant: 'error',
        message: '\uC5D1\uC140 \uB2E4\uC6B4\uB85C\uB4DC\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694.',
      })
    }
  }

  return {
    lesson,
    setLesson,
    error,
    commonValues,
    setCommonValues,
    students,
    setStudents,
    alimtalkSendModal,
    inputCount,
    isLoading,
    handleExcelDownload,
    refetch,
  }
}
