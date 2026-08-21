import { useCallback } from 'react'

import { lessonService } from '@/services/lesson'
import useDisclosure from './useDisclosure'
import { useToastStore } from '@/stores/toastStore'
import { useLessonLoad } from './lesson/useLessonLoad'
import { useLessonDirtySave } from './lesson/useLessonDirtySave'
import { useLessonAdhocItems } from './lesson/useLessonAdhocItems'
import { useLessonProgress } from './lesson/useLessonProgress'
import { useLessonAttendanceRefresh } from './lesson/useLessonAttendanceRefresh'
import { createEmptyLessonStudent } from './lesson/initializeLessonFromDetail'

export default function useLessonDetail(lessonId: number) {
  const alimtalkSendModal = useDisclosure()
  const addToast = useToastStore((s) => s.addToast)

  const {
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
    isAutoSaving,
  } = useLessonDirtySave(lessonId)

  const {
    lesson,
    setLesson,
    commonValues,
    setCommonValues,
    students,
    setStudents,
    isLoading,
    error,
    refetch,
    triggerReload,
  } = useLessonLoad(lessonId, {
    clearDirty,
    clearAllDebounceTimers,
  })

  bindFormState({
    lesson,
    setLesson,
    commonValues,
    setCommonValues,
    students,
    setStudents,
  })

  const refetchAfterAttendanceEnd = useLessonAttendanceRefresh({
    lessonId,
    setLesson,
    setStudents,
    triggerReload,
  })

  const { inputCount } = useLessonProgress(students, lesson?.items)

  const {
    addAdhocItem,
    removeAdhocItem,
    excludeTemplateItem,
    updateLessonItemOrder,
    setItemPartial,
  } = useLessonAdhocItems({
    lessonId,
    setLesson,
    setCommonValues,
    setStudents,
    forgetDirtyItem,
  })

  const addStudentsToLesson = useCallback(
    async (studentIds: number[]) => {
      if (!lesson) return
      try {
        const result = await lessonService.addLessonStudents(lessonId, studentIds)
        if (result.students.length === 0) {
          addToast({ variant: 'success', message: '이미 이 수업에 있는 학생이에요.' })
          return
        }
        setStudents((prev) => {
          const existing = new Set(prev.map((s) => s.id))
          const added = result.students
            .filter((s) => !existing.has(s.student_id))
            .map((s) => createEmptyLessonStudent(s.student_id, s.student_name, lesson.items))
          return [...prev, ...added].sort((a, b) => a.name.localeCompare(b.name, 'ko'))
        })
        setLesson((prev) => {
          if (!prev) return prev
          const existingGuest = new Set((prev.guest_students ?? []).map((g) => g.student_id))
          const newGuests = result.students.filter((s) => !existingGuest.has(s.student_id))
          return {
            ...prev,
            guest_students: [...(prev.guest_students ?? []), ...newGuests],
          }
        })
        addToast({
          variant: 'success',
          message:
            result.added_count === 1
              ? '학생이 이 수업 입력에 추가됐어요.'
              : `학생 ${result.added_count}명이 이 수업 입력에 추가됐어요.`,
        })
      } catch {
        addToast({ variant: 'error', message: '학생 추가에 실패했어요.' })
      }
    },
    [addToast, lesson, lessonId, setLesson, setStudents],
  )

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

  const openAlimtalkSendModal = useCallback(async () => {
    const ok = await ensureSavedForAlimtalk()
    if (ok) alimtalkSendModal.open()
  }, [ensureSavedForAlimtalk, alimtalkSendModal])

  return {
    lesson,
    setLesson,
    error,
    commonValues,
    updateCommonValue,
    students,
    updateStudents,
    flushPendingStudentCellSave,
    alimtalkSendModal,
    openAlimtalkSendModal,
    inputCount,
    isLoading,
    hasUnsavedChanges,
    isAutoSaving,
    saveDirtyChanges,
    ensureSavedForAlimtalk,
    handleExcelDownload,
    refetch,
    refetchAfterAttendanceEnd,
    addAdhocItem,
    removeAdhocItem,
    excludeTemplateItem,
    updateLessonItemOrder,
    setItemPartial,
    addStudentsToLesson,
  }
}
