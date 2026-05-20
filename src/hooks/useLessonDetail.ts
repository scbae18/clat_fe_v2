import { useState, useEffect, useCallback, useRef } from 'react'

import type { LessonStudent } from '@/types/lessonStudent'

import { lessonService, type LessonDetail } from '@/services/lesson'

import { classService } from '@/services/class'

import useDisclosure from './useDisclosure'

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



function clearDirtyFromBody(

  body: NonNullable<ReturnType<typeof buildLessonUpdateBodyForTargets>>,

  clearCommon: (ids: number[]) => void,

  clearCells: (keys: string[]) => void,

) {

  if (body.common_data?.length) {

    clearCommon(body.common_data.map((c) => c.template_item_id))

  }

  if (body.student_data?.length) {

    const keys: string[] = []

    for (const s of body.student_data) {

      for (const item of s.items) {

        keys.push(studentCellKey(s.student_id, item.template_item_id))

      }

    }

    clearCells(keys)

  }

}



export default function useLessonDetail(lessonId: number) {

  const [lesson, setLesson] = useState<LessonDetail | null>(null)

  const [commonValues, setCommonValues] = useState<Record<number, string>>({})

  const [students, setStudents] = useState<LessonStudent[]>([])

  const [isLoading, setIsLoading] = useState(true)

  const [refreshKey, setRefreshKey] = useState(0)

  const [error, setError] = useState<'TEMPLATE_NOT_FOUND' | null>(null)

  const [dirtyCommonIds, setDirtyCommonIds] = useState<Set<number>>(() => new Set())

  const [dirtyStudentCells, setDirtyStudentCells] = useState<Set<string>>(() => new Set())

  const [autoSavingCount, setAutoSavingCount] = useState(0)

  const alimtalkSendModal = useDisclosure()

  const addToast = useToastStore((s) => s.addToast)



  const studentsRef = useRef(students)

  studentsRef.current = students

  const commonValuesRef = useRef(commonValues)

  commonValuesRef.current = commonValues

  const lessonRef = useRef(lesson)

  lessonRef.current = lesson

  const debounceTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())



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



  const markStudentCellsDirty = useCallback((keys: Iterable<string>) => {

    setDirtyStudentCells((prev) => {

      const next = new Set(prev)

      for (const key of keys) next.add(key)

      return next

    })

  }, [])



  const removeDirtyCommon = useCallback((ids: number[]) => {

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



  const persistTargets = useCallback(

    async (options: {

      commonIds?: number[]

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

        status: 'SAVED',

      })



      if (!body) return true



      setAutoSavingCount((c) => c + 1)

      try {

        await lessonService.updateLesson(lessonId, body)

        clearDirtyFromBody(body, removeDirtyCommon, removeDirtyCells)

        return true

      } catch {

        if (!options.silent) {

          addToast({ variant: 'error', message: '저장에 실패했어요.' })

        } else {

          addToast({ variant: 'error', message: '자동 저장에 실패했어요. 저장 버튼을 눌러 주세요.' })

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

        const { templateItemId } = parseStudentCellKey(key)

        const itemType = getLessonItemType(items, templateItemId)



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



  const refetch = () => {

    setError(null)

    clearAllDebounceTimers()

    clearDirty()

    setRefreshKey((k) => k + 1)

  }



  const updateCommonValue = useCallback(

    (id: number, value: string) => {

      setCommonValues((prev) => ({ ...prev, [id]: value }))

      setDirtyCommonIds((prev) => {

        const next = new Set(prev)

        next.add(id)

        return next

      })

      scheduleDebouncedSave(`common:${id}`, () => {

        void persistTargets({ commonIds: [id], silent: true })

      })

    },

    [persistTargets, scheduleDebouncedSave],

  )



  const updateStudents = useCallback(

    (next: LessonStudent[] | ((prev: LessonStudent[]) => LessonStudent[])) => {

      setStudents((prev) => {

        const resolved = typeof next === 'function' ? next(prev) : next

        const attendanceItemId = lessonRef.current?.items.find(

          (i) => i.item_type === 'ATTENDANCE',

        )?.id

        const changedCells = findChangedStudentCells(prev, resolved, attendanceItemId)

        if (changedCells.length > 0) {

          markStudentCellsDirty(changedCells)

          queueMicrotask(() => scheduleAutoSaveStudentCells(changedCells))

        }

        return resolved

      })

    },

    [markStudentCellsDirty, scheduleAutoSaveStudentCells],

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

              sdItems.find((si) => si.template_item_id === attendanceItemId)?.value ?? '',

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



        const values: Record<number, string> = {}

        data.common_data.forEach((item) => {

          values[item.template_item_id] = item.value

        })

        setCommonValues(values)

        clearAllDebounceTimers()

        clearDirty()



        const individualItems = data.items.filter(

          (i) => !i.is_common && i.item_type !== 'ATTENDANCE',

        )

        const attendanceItems = data.items.filter((i) => i.item_type === 'ATTENDANCE')



        const classStudents = await classService.getClassStudents(data.class_id, data.lesson_date)

        const nameMap = new Map(classStudents.map((s) => [s.id, s.name]))

        const apiNameMap = new Map(

          data.student_data.map((sd) => [sd.student_id, sd.student_name ?? '']),

        )



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

    return () => clearAllDebounceTimers()

  }, [clearAllDebounceTimers])



  const saveDirtyChanges = useCallback(async (): Promise<boolean> => {

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

      addToast({ variant: 'success', message: '저장됐어요.' })

      return true

    } catch {

      addToast({ variant: 'error', message: '저장에 실패했어요.' })

      return false

    } finally {

      setAutoSavingCount((c) => Math.max(0, c - 1))

    }

  }, [

    lesson,

    lessonId,

    dirtyCommonIds,

    dirtyStudentCells,

    addToast,

    clearAllDebounceTimers,

    removeDirtyCommon,

    removeDirtyCells,

  ])



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

        message: '엑셀 다운로드에 실패했어요.',

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

    isAutoSaving: autoSavingCount > 0,

    saveDirtyChanges,

    handleExcelDownload,

    refetch,

    refetchAfterAttendanceEnd,

  }

}


