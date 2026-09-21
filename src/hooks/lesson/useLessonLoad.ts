import { useState, useEffect, useCallback, useRef } from 'react'

import type { LessonStudent } from '@/types/lessonStudent'
import { lessonService, type LessonDetail } from '@/services/lesson'
import { classService } from '@/services/class'

import {
  buildCommonValuesFromDetail,
  buildStudentsFromDetail,
  mergePolledLessonState,
} from './initializeLessonFromDetail'

export type LessonLoadError = 'TEMPLATE_NOT_FOUND' | null

const POLL_MS = 5000

type DirtySnapshot = { cells: Set<string>; common: Set<string> }

type UseLessonLoadOptions = {
  clearDirty: () => void
  clearAllDebounceTimers: () => void
  getDirtySnapshot?: () => DirtySnapshot
  isBusy?: () => boolean
}

function isUnchangedPoll(
  data: LessonDetail | { unchanged: true; updated_at: string },
): data is { unchanged: true; updated_at: string } {
  return 'unchanged' in data && data.unchanged === true
}

/**
 * Owns lesson detail fetch + initial common/student form state.
 * Clears dirty/debounce via callbacks from useLessonDirtySave.
 */
export function useLessonLoad(lessonId: number, options: UseLessonLoadOptions) {
  const { clearDirty, clearAllDebounceTimers, getDirtySnapshot, isBusy } = options

  const [lesson, setLesson] = useState<LessonDetail | null>(null)
  const [commonValues, setCommonValues] = useState<Record<string, string>>({})
  const [students, setStudents] = useState<LessonStudent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [error, setError] = useState<LessonLoadError>(null)

  const lessonRef = useRef(lesson)
  lessonRef.current = lesson
  const commonRef = useRef(commonValues)
  commonRef.current = commonValues
  const studentsRef = useRef(students)
  studentsRef.current = students

  const refetch = useCallback(() => {
    setError(null)
    clearAllDebounceTimers()
    clearDirty()
    setRefreshKey((k) => k + 1)
  }, [clearAllDebounceTimers, clearDirty])

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
        if (cancelled || isUnchangedPoll(data)) return
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

  useEffect(() => {
    if (!lessonId || isLoading) return
    let cancelled = false

    const poll = async () => {
      if (cancelled) return
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return
      if (isBusy?.()) return
      const current = lessonRef.current
      if (!current) return
      try {
        const data = await lessonService.getLesson(lessonId, {
          updatedAfter: current.updated_at,
        })
        if (cancelled || isUnchangedPoll(data)) return
        const merged = mergePolledLessonState({
          prevLesson: current,
          prevCommon: commonRef.current,
          prevStudents: studentsRef.current,
          nextDetail: data,
          dirty: getDirtySnapshot?.() ?? { cells: new Set(), common: new Set() },
        })
        setLesson(merged.lesson)
        setCommonValues(merged.commonValues)
        setStudents(merged.students)
      } catch {
        // keep current screen on poll failure
      }
    }

    const timer = setInterval(() => {
      void poll()
    }, POLL_MS)
    const onVis = () => {
      if (document.visibilityState === 'visible') void poll()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelled = true
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [getDirtySnapshot, isBusy, isLoading, lessonId])

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
