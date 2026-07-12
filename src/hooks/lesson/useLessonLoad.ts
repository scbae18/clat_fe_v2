import { useState, useEffect, useCallback } from 'react'

import type { LessonStudent } from '@/types/lessonStudent'
import { lessonService, type LessonDetail } from '@/services/lesson'
import { classService } from '@/services/class'

import {
  buildCommonValuesFromDetail,
  buildStudentsFromDetail,
} from './initializeLessonFromDetail'

export type LessonLoadError = 'TEMPLATE_NOT_FOUND' | null

type UseLessonLoadOptions = {
  clearDirty: () => void
  clearAllDebounceTimers: () => void
}

/**
 * Owns lesson detail fetch + initial common/student form state.
 * Clears dirty/debounce via callbacks from useLessonDirtySave.
 */
export function useLessonLoad(lessonId: number, options: UseLessonLoadOptions) {
  const { clearDirty, clearAllDebounceTimers } = options

  const [lesson, setLesson] = useState<LessonDetail | null>(null)
  const [commonValues, setCommonValues] = useState<Record<string, string>>({})
  const [students, setStudents] = useState<LessonStudent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [error, setError] = useState<LessonLoadError>(null)

  const refetch = useCallback(() => {
    setError(null)
    clearAllDebounceTimers()
    clearDirty()
    setRefreshKey((k) => k + 1)
  }, [clearAllDebounceTimers, clearDirty])

  /** Bump reload without clearing dirty first (attendance-end fallback). */
  const triggerReload = useCallback(() => {
    setError(null)
    setRefreshKey((k) => k + 1)
  }, [])

  useEffect(() => {
    if (!lessonId) return
    setIsLoading(true)
    let cancelled = false

    lessonService
      .getLesson(lessonId)
      .then(async (data) => {
        if (cancelled) return
        setLesson(data)

        setCommonValues(buildCommonValuesFromDetail(data))
        clearAllDebounceTimers()
        clearDirty()

        const classStudents = await classService.getClassStudents(data.class_id, data.lesson_date)
        if (cancelled) return

        setStudents(buildStudentsFromDetail(data, classStudents))
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const code = (err as { response?: { data?: { error?: { code?: string } } } })?.response
          ?.data?.error?.code
        if (code === 'TEMPLATE_NOT_FOUND') {
          setError('TEMPLATE_NOT_FOUND')
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [lessonId, refreshKey, clearDirty, clearAllDebounceTimers])

  return {
    lesson,
    setLesson,
    commonValues,
    setCommonValues,
    students,
    setStudents,
    isLoading,
    error,
    setError,
    refetch,
    triggerReload,
  }
}
