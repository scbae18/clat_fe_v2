import { useCallback, type Dispatch, type SetStateAction } from 'react'

import type { LessonStudent } from '@/types/lessonStudent'
import { lessonService, type CreateLessonAdhocItemBody, type LessonDetail } from '@/services/lesson'
import { useToastStore } from '@/stores/toastStore'
import { itemRef } from '@/lib/lessonItemRef'

type SetState<T> = Dispatch<SetStateAction<T>>

type UseLessonAdhocItemsParams = {
  lessonId: number
  setLesson: SetState<LessonDetail | null>
  setCommonValues: SetState<Record<string, string>>
  setStudents: SetState<LessonStudent[]>
  forgetDirtyItem: (source: 'template' | 'adhoc', itemId: number) => void
}

/** Adhoc/template item mutations on a lesson record (add / remove / hide / reorder). */
export function useLessonAdhocItems({
  lessonId,
  setLesson,
  setCommonValues,
  setStudents,
  forgetDirtyItem,
}: UseLessonAdhocItemsParams) {
  const addToast = useToastStore((s) => s.addToast)

  const addAdhocItem = useCallback(
    async (body: CreateLessonAdhocItemBody) => {
      try {
        const created = await lessonService.addLessonItem(lessonId, body)
        const refreshed = await lessonService.getLesson(lessonId)
        setLesson((prev) => (prev ? { ...prev, items: refreshed.items } : prev))
        if (body.is_common) {
          const ref = itemRef('adhoc', created.id)
          setCommonValues((prev) => ({ ...prev, [ref]: prev[ref] ?? '' }))
        } else {
          setStudents((prev) =>
            prev.map((s) => {
              if (s.items.some((i) => i.source === 'adhoc' && i.item_id === created.id)) {
                return s
              }
              return {
                ...s,
                items: [
                  ...s.items,
                  {
                    item_id: created.id,
                    source: 'adhoc' as const,
                    value: '',
                    is_completed: null,
                  },
                ],
              }
            }),
          )
        }
        addToast({ variant: 'success', message: '항목이 추가됐어요.' })
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data
            ?.error?.message ?? '항목 추가에 실패했어요.'
        addToast({ variant: 'error', message: msg })
        throw err
      }
    },
    [lessonId, addToast, setLesson, setCommonValues, setStudents],
  )

  const removeAdhocItem = useCallback(
    async (itemId: number) => {
      await lessonService.removeLessonItem(lessonId, itemId)
      const ref = itemRef('adhoc', itemId)
      setLesson((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.filter((i) => !(i.source === 'adhoc' && i.id === itemId)),
            }
          : prev,
      )
      setCommonValues((prev) => {
        const next = { ...prev }
        delete next[ref]
        return next
      })
      forgetDirtyItem('adhoc', itemId)
      setStudents((prev) =>
        prev.map((s) => ({
          ...s,
          items: s.items.filter((i) => !(i.source === 'adhoc' && i.item_id === itemId)),
        })),
      )
      addToast({ variant: 'success', message: '항목을 삭제했어요.' })
    },
    [lessonId, addToast, setLesson, setCommonValues, setStudents, forgetDirtyItem],
  )

  const excludeTemplateItem = useCallback(
    async (templateItemId: number) => {
      await lessonService.excludeTemplateItem(lessonId, templateItemId)
      const ref = itemRef('template', templateItemId)
      setLesson((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.filter(
                (i) => !((i.source ?? 'template') === 'template' && i.id === templateItemId),
              ),
            }
          : prev,
      )
      setCommonValues((prev) => {
        const next = { ...prev }
        delete next[ref]
        return next
      })
      forgetDirtyItem('template', templateItemId)
      setStudents((prev) =>
        prev.map((s) => ({
          ...s,
          items: s.items.filter(
            (i) => !(i.source === 'template' && i.item_id === templateItemId),
          ),
        })),
      )
      addToast({ variant: 'success', message: '이 수업에서 항목을 숨겼어요.' })
    },
    [lessonId, addToast, setLesson, setCommonValues, setStudents, forgetDirtyItem],
  )

  const updateLessonItemOrder = useCallback(
    async (items: Array<{ source: 'template' | 'adhoc'; id: number }>) => {
      const updated = await lessonService.updateItemOrder(lessonId, { items })
      setLesson((prev) => (prev ? { ...prev, items: updated } : prev))
    },
    [lessonId, setLesson],
  )

  return {
    addAdhocItem,
    removeAdhocItem,
    excludeTemplateItem,
    updateLessonItemOrder,
  }
}
