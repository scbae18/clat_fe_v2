import { useCallback } from 'react'

import { lessonService } from '@/services/lesson'
import useDisclosure from './useDisclosure'
import { useToastStore } from '@/stores/toastStore'
import { useLessonLoad } from './lesson/useLessonLoad'
import { useLessonDirtySave } from './lesson/useLessonDirtySave'
import { useLessonAdhocItems } from './lesson/useLessonAdhocItems'
import { useLessonProgress } from './lesson/useLessonProgress'
import { useLessonAttendanceRefresh } from './lesson/useLessonAttendanceRefresh'

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
  }
}
