import { useState, useEffect, useCallback, useRef } from 'react'
import type { LessonStudent } from '@/types/lessonStudent'
import { lessonService, type LessonDetail } from '@/services/lesson'
import { classService } from '@/services/class'
import useDisclosure from './useDisclosure'
import { useToastStore } from '@/stores/toastStore'
import {
  buildPartialLessonUpdateBody,
  findChangedStudentCells,
  studentCellKey,
} from '@/lib/lessonPartialSave'

export default function useLessonDetail(lessonId: number) {
  const [lesson, setLesson] = useState<LessonDetail | null>(null)
  const [commonValues, setCommonValues] = useState<Record<number, string>>({})
  const [students, setStudents] = useState<LessonStudent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [error, setError] = useState<'TEMPLATE_NOT_FOUND' | null>(null)
  const [dirtyCommonIds, setDirtyCommonIds] = useState<Set<number>>(() => new Set())
  const [dirtyStudentCells, setDirtyStudentCells] = useState<Set<string>>(() => new Set())
  const alimtalkSendModal = useDisclosure()
  const addToast = useToastStore((s) => s.addToast)
  const studentsRef = useRef(students)
  studentsRef.current = students
  const lessonRef = useRef(lesson)
  lessonRef.current = lesson

  const clearDirty = useCallback(() => {
    setDirtyCommonIds(new Set())
    setDirtyStudentCells(new Set())
  }, [])

  const markStudentCellsDirty = useCallback((keys: Iterable<string>) => {
    setDirtyStudentCells((prev) => {
      const next = new Set(prev)
      for (const key of keys) next.add(key)
      return next
    })
  }, [])

  const refetch = () => {
    setError(null)
    clearDirty()
    setRefreshKey((k) => k + 1)
  }

  const updateCommonValue = useCallback((id: number, value: string) => {
    setCommonValues((prev) => ({ ...prev, [id]: value }))
    setDirtyCommonIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const updateStudents = useCallback(
    (next: LessonStudent[] | ((prev: LessonStudent[]) => LessonStudent[])) => {
      setStudents((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next
        const attendanceItemId = lessonRef.current?.items.find(
          (i) => i.item_type === 'ATTENDANCE',
        )?.id
        const changedCells = findChangedStudentCells(prev, resolved, attendanceItemId)
        if (changedCells.length > 0) markStudentCellsDirty(changedCells)
        return resolved
      })
    },
    [markStudentCellsDirty],
  )

  /** 출결 종료 후 서버 출결·잠금만 반영하고, 저장 전에 입력한 공통/개별 값은 유지 */
  const refetchAfterAttendanceEnd = useCallback(async () => {
    if (!lessonId) return
    try {
      const data = await lessonService.getLesson(lessonId)
      setLesson(data)

      setStudents((prev) => {
        if (prev.length === 0) {
          return prev
        }

        const attendanceItems = data.items.filter((i) => i.item_type === 'ATTENDANCE')
        const attendanceItemId = attendanceItems[0]?.id

        return prev.map((student) => {
          const sd = data.student_data.find((s) => s.student_id === student.id)
          const sdItems = sd?.items ?? []

          let attendance: LessonStudent['attendance'] = student.attendance
          let attendanceValue = ''
          if (attendanceItemId) {
            attendanceValue = String(
              sdItems.find((si) => si.template_item_id === attendanceItemId)?.value ?? ''
            )
            if (
              attendanceValue === '출석' ||
              attendanceValue === '지각' ||
              attendanceValue === '결석'
            ) {
              attendance = attendanceValue
            }
          }

          const mergedItems = student.items.map((item) => {
            if (attendanceItemId && item.template_item_id === attendanceItemId) {
              return {
                ...item,
                value: attendanceValue !== '' ? attendanceValue : item.value,
              }
            }
            return item
          })

          return {
            ...student,
            attendance,
            items: mergedItems,
          }
        })
      })
    } catch {
      setError(null)
      setRefreshKey((k) => k + 1)
    }
  }, [lessonId])

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
        clearDirty()

        const individualItems = data.items.filter(
          (i) => !i.is_common && i.item_type !== 'ATTENDANCE'
        )
        const attendanceItems = data.items.filter((i) => i.item_type === 'ATTENDANCE')

        // 이름만 classStudents에서 가져오기
        const classStudents = await classService.getClassStudents(data.class_id, data.lesson_date)
        const nameMap = new Map(classStudents.map((s) => [s.id, s.name]))
        const apiNameMap = new Map(
          data.student_data.map((sd) => [sd.student_id, sd.student_name ?? '']),
        )

        // 수업일 기준 반 명단만 행으로 쓴다. 제외된 학생은 서버에서 student_data에서 빠지므로
        // 예전처럼 student_data 순서로만 그리면 이름 없는 빈 행이 생기지 않는다.
        const baseStudentIds = classStudents.map((s) => s.id)

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
            name: nameMap.get(studentId) ?? apiNameMap.get(studentId) ?? '',
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

        initialized.sort((a, b) => a.name.localeCompare(b.name, 'ko'))

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
  }, [lessonId, refreshKey, clearDirty])

  const saveDirtyChanges = useCallback(async (): Promise<boolean> => {
    if (!lesson) return false

    const body = buildPartialLessonUpdateBody({
      dirtyCommonIds,
      dirtyStudentCells,
      commonValues,
      students: studentsRef.current,
      lessonItems: lesson.items,
      status: 'SAVED',
    })

    if (!body) {
      addToast({ variant: 'warning', message: '저장할 변경 내용이 없어요.' })
      return true
    }

    try {
      await lessonService.updateLesson(lessonId, body)
      setDirtyCommonIds((prev) => {
        const next = new Set(prev)
        body.common_data?.forEach((c) => next.delete(c.template_item_id))
        return next
      })
      setDirtyStudentCells((prev) => {
        const next = new Set(prev)
        body.student_data?.forEach((s) => {
          s.items.forEach((item) => next.delete(studentCellKey(s.student_id, item.template_item_id)))
        })
        return next
      })
      addToast({ variant: 'success', message: '저장됐어요.' })
      return true
    } catch {
      addToast({ variant: 'error', message: '저장에 실패했어요.' })
      return false
    }
  }, [lesson, lessonId, dirtyCommonIds, dirtyStudentCells, commonValues, addToast])

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

  const hasUnsavedChanges = dirtyCommonIds.size > 0 || dirtyStudentCells.size > 0

  return {
    lesson,
    setLesson,
    error,
    commonValues,
    updateCommonValue,
    students,
    updateStudents,
    alimtalkSendModal,
    inputCount,
    isLoading,
    hasUnsavedChanges,
    saveDirtyChanges,
    handleExcelDownload,
    refetch,
    refetchAfterAttendanceEnd,
  }
}
