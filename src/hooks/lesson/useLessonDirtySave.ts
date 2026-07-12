import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type Dispatch,
  type SetStateAction,
} from 'react'

import type { LessonStudent } from '@/types/lessonStudent'
import { lessonService, type LessonDetail } from '@/services/lesson'
import { useToastStore } from '@/stores/toastStore'
import {
  getLessonItemType,
  isImmediateSaveItemType,
  TEXT_INPUT_DEBOUNCE_MS,
} from '@/lib/lessonAutoSave'
import {
  buildLessonUpdateBodyForTargets,
  buildPartialLessonUpdateBody,
  findChangedStudentCells,
  parseStudentCellKey,
  studentCellKey,
} from '@/lib/lessonPartialSave'
import { itemRef } from '@/lib/lessonItemRef'

type SetState<T> = Dispatch<SetStateAction<T>>

export type LessonDirtyFormBinding = {
  lesson: LessonDetail | null
  setLesson: SetState<LessonDetail | null>
  commonValues: Record<string, string>
  setCommonValues: SetState<Record<string, string>>
  students: LessonStudent[]
  setStudents: SetState<LessonStudent[]>
}

function clearDirtyFromBody(
  body: NonNullable<ReturnType<typeof buildLessonUpdateBodyForTargets>>,
  clearCommon: (ids: string[]) => void,
  clearCells: (keys: string[]) => void,
) {
  if (body.common_data?.length) {
    clearCommon(
      body.common_data.map((c) => {
        if (c.adhoc_item_id != null) return itemRef('adhoc', c.adhoc_item_id)
        return itemRef('template', c.template_item_id!)
      }),
    )
  }
  if (body.student_data?.length) {
    const keys: string[] = []
    for (const s of body.student_data) {
      for (const item of s.items) {
        const source = item.source ?? (item.adhoc_item_id != null ? 'adhoc' : 'template')
        const id = item.adhoc_item_id ?? item.template_item_id!
        keys.push(studentCellKey(s.student_id, source, id))
      }
    }
    clearCells(keys)
  }
}

/**
 * Dirty tracking, debounced autosave, and explicit save for lesson detail.
 * Call bindFormState(...) each render after useLessonLoad.
 */
export function useLessonDirtySave(lessonId: number) {
  const [dirtyCommonIds, setDirtyCommonIds] = useState<Set<string>>(() => new Set())
  const [dirtyStudentCells, setDirtyStudentCells] = useState<Set<string>>(() => new Set())
  const [autoSavingCount, setAutoSavingCount] = useState(0)
  const addToast = useToastStore((s) => s.addToast)

  const debounceTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  const dirtyStudentCellsRef = useRef(dirtyStudentCells)
  dirtyStudentCellsRef.current = dirtyStudentCells

  const lessonRef = useRef<LessonDetail | null>(null)
  const commonValuesRef = useRef<Record<string, string>>({})
  const studentsRef = useRef<LessonStudent[]>([])
  const setLessonRef = useRef<SetState<LessonDetail | null>>(() => {})
  const setCommonValuesRef = useRef<SetState<Record<string, string>>>(() => {})
  const setStudentsRef = useRef<SetState<LessonStudent[]>>(() => {})

  const bindFormState = (form: LessonDirtyFormBinding) => {
    lessonRef.current = form.lesson
    commonValuesRef.current = form.commonValues
    studentsRef.current = form.students
    setLessonRef.current = form.setLesson
    setCommonValuesRef.current = form.setCommonValues
    setStudentsRef.current = form.setStudents
  }

  const clearDirty = useCallback(() => {
    setDirtyCommonIds(new Set())
    setDirtyStudentCells(new Set())
  }, [])

  const clearDebounceTimer = useCallback((timerKey: string) => {
    const existing = debounceTimersRef.current.get(timerKey)
    if (existing) {
      clearTimeout(existing)
      debounceTimersRef.current.delete(timerKey)
    }
  }, [])

  const clearAllDebounceTimers = useCallback(() => {
    for (const timer of debounceTimersRef.current.values()) {
      clearTimeout(timer)
    }
    debounceTimersRef.current.clear()
  }, [])

  useEffect(() => {
    return () => clearAllDebounceTimers()
  }, [clearAllDebounceTimers])

  const markStudentCellsDirty = useCallback((keys: Iterable<string>) => {
    setDirtyStudentCells((prev) => {
      const next = new Set(prev)
      for (const key of keys) next.add(key)
      return next
    })
  }, [])

  const removeDirtyCommon = useCallback((ids: string[]) => {
    setDirtyCommonIds((prev) => {
      const next = new Set(prev)
      for (const id of ids) next.delete(id)
      return next
    })
  }, [])

  const removeDirtyCells = useCallback((keys: string[]) => {
    setDirtyStudentCells((prev) => {
      const next = new Set(prev)
      for (const key of keys) next.delete(key)
      return next
    })
  }, [])

  const forgetDirtyItem = useCallback((source: 'template' | 'adhoc', itemId: number) => {
    const ref = itemRef(source, itemId)
    setDirtyCommonIds((prev) => {
      const next = new Set(prev)
      next.delete(ref)
      return next
    })
    setDirtyStudentCells((prev) => {
      const next = new Set(prev)
      for (const key of prev) {
        const parsed = parseStudentCellKey(key)
        if (parsed.source === source && parsed.itemId === itemId) next.delete(key)
      }
      return next
    })
  }, [])

  const persistTargets = useCallback(
    async (options: {
      commonIds?: string[]
      studentCells?: string[]
      silent?: boolean
    }): Promise<boolean> => {
      const currentLesson = lessonRef.current
      if (!currentLesson) return false

      const commonIds = options.commonIds ?? []
      const studentCells = options.studentCells ?? []
      if (commonIds.length === 0 && studentCells.length === 0) return true

      const body = buildLessonUpdateBodyForTargets({
        commonIds,
        studentCells,
        commonValues: commonValuesRef.current,
        students: studentsRef.current,
        lessonItems: currentLesson.items,
      })

      if (!body) return false

      setAutoSavingCount((c) => c + 1)
      try {
        await lessonService.updateLesson(lessonId, body)
        clearDirtyFromBody(body, removeDirtyCommon, removeDirtyCells)
        return true
      } catch {
        if (!options.silent) {
          addToast({ variant: 'error', message: '저장에 실패했어요.' })
        } else {
          addToast({
            variant: 'error',
            message: '자동 저장에 실패했어요. 저장 버튼을 눌러 주세요.',
          })
        }
        return false
      } finally {
        setAutoSavingCount((c) => Math.max(0, c - 1))
      }
    },
    [lessonId, addToast, removeDirtyCommon, removeDirtyCells],
  )

  const scheduleDebouncedSave = useCallback(
    (timerKey: string, run: () => void) => {
      clearDebounceTimer(timerKey)
      const timer = setTimeout(() => {
        debounceTimersRef.current.delete(timerKey)
        run()
      }, TEXT_INPUT_DEBOUNCE_MS)
      debounceTimersRef.current.set(timerKey, timer)
    },
    [clearDebounceTimer],
  )

  const scheduleAutoSaveStudentCells = useCallback(
    (cellKeys: string[]) => {
      const items = lessonRef.current?.items ?? []
      for (const key of cellKeys) {
        const { source, itemId } = parseStudentCellKey(key)
        const itemType = getLessonItemType(items, source, itemId)

        if (isImmediateSaveItemType(itemType)) {
          clearDebounceTimer(`cell:${key}`)
          void persistTargets({ studentCells: [key], silent: true })
        } else {
          scheduleDebouncedSave(`cell:${key}`, () => {
            void persistTargets({ studentCells: [key], silent: true })
          })
        }
      }
    },
    [clearDebounceTimer, persistTargets, scheduleDebouncedSave],
  )

  const updateCommonValue = useCallback(
    (ref: string, value: string) => {
      setCommonValuesRef.current((prev) => ({ ...prev, [ref]: value }))
      setDirtyCommonIds((prev) => {
        const next = new Set(prev)
        next.add(ref)
        return next
      })
      scheduleDebouncedSave(`common:${ref}`, () => {
        void persistTargets({ commonIds: [ref], silent: true })
      })
    },
    [persistTargets, scheduleDebouncedSave],
  )

  const updateStudents = useCallback(
    (next: LessonStudent[] | ((prev: LessonStudent[]) => LessonStudent[])) => {
      setStudentsRef.current((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next
        const attendanceItem = lessonRef.current?.items.find((i) => i.item_type === 'ATTENDANCE')
        const changedCells = findChangedStudentCells(prev, resolved, attendanceItem)
        if (changedCells.length > 0) {
          markStudentCellsDirty(changedCells)
          queueMicrotask(() => scheduleAutoSaveStudentCells(changedCells))
        }
        return resolved
      })
    },
    [markStudentCellsDirty, scheduleAutoSaveStudentCells],
  )

  const flushPendingStudentCellSave = useCallback(
    (studentId: number, source: 'template' | 'adhoc', itemId: number) => {
      const key = studentCellKey(studentId, source, itemId)
      clearDebounceTimer(`cell:${key}`)
      if (!dirtyStudentCellsRef.current.has(key)) return
      void persistTargets({ studentCells: [key], silent: true })
    },
    [clearDebounceTimer, persistTargets],
  )

  const saveDirtyChanges = useCallback(async (): Promise<boolean> => {
    const lesson = lessonRef.current
    if (!lesson) return false

    clearAllDebounceTimers()

    const body = buildPartialLessonUpdateBody({
      dirtyCommonIds,
      dirtyStudentCells,
      commonValues: commonValuesRef.current,
      students: studentsRef.current,
      lessonItems: lesson.items,
      status: 'SAVED',
    })

    if (!body) {
      addToast({ variant: 'warning', message: '저장할 변경 내용이 없어요.' })
      return true
    }

    setAutoSavingCount((c) => c + 1)
    try {
      await lessonService.updateLesson(lessonId, body)
      clearDirtyFromBody(body, removeDirtyCommon, removeDirtyCells)
      setLessonRef.current((prev) => (prev ? { ...prev, status: 'SAVED' } : prev))
      addToast({ variant: 'success', message: '저장됐어요.' })
      return true
    } catch {
      addToast({ variant: 'error', message: '저장에 실패했어요.' })
      return false
    } finally {
      setAutoSavingCount((c) => Math.max(0, c - 1))
    }
  }, [
    lessonId,
    dirtyCommonIds,
    dirtyStudentCells,
    addToast,
    clearAllDebounceTimers,
    removeDirtyCommon,
    removeDirtyCells,
  ])

  /** 알림톡 발송 전: 미저장 변경 반영 + DRAFT면 SAVED로 전환 */
  const ensureSavedForAlimtalk = useCallback(async (): Promise<boolean> => {
    const lesson = lessonRef.current
    if (!lesson) return false

    clearAllDebounceTimers()

    const body = buildPartialLessonUpdateBody({
      dirtyCommonIds,
      dirtyStudentCells,
      commonValues: commonValuesRef.current,
      students: studentsRef.current,
      lessonItems: lesson.items,
      status: 'SAVED',
    })

    setAutoSavingCount((c) => c + 1)
    try {
      if (body) {
        await lessonService.updateLesson(lessonId, body)
        clearDirtyFromBody(body, removeDirtyCommon, removeDirtyCells)
      } else if (lesson.status === 'DRAFT') {
        await lessonService.saveLesson(lessonId)
      }
      setLessonRef.current((prev) => (prev ? { ...prev, status: 'SAVED' } : prev))
      return true
    } catch {
      addToast({
        variant: 'error',
        message: '수업 저장에 실패했어요. 저장 후 알림톡을 보내 주세요.',
      })
      return false
    } finally {
      setAutoSavingCount((c) => Math.max(0, c - 1))
    }
  }, [
    lessonId,
    dirtyCommonIds,
    dirtyStudentCells,
    addToast,
    clearAllDebounceTimers,
    removeDirtyCommon,
    removeDirtyCells,
  ])

  const hasUnsavedChanges = dirtyCommonIds.size > 0 || dirtyStudentCells.size > 0

  return {
    bindFormState,
    clearDirty,
    clearAllDebounceTimers,
    forgetDirtyItem,
    updateCommonValue,
    updateStudents,
    flushPendingStudentCellSave,
    saveDirtyChanges,
    ensureSavedForAlimtalk,
    hasUnsavedChanges,
    isAutoSaving: autoSavingCount > 0,
  }
}
