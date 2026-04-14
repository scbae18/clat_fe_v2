import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreateTemplateItemDto, templateService } from '@/services/template'
import type { TemplateItem } from '@/app/(main)/template/_types/template'
import { INITIAL_COMMON_ITEMS, INITIAL_INDIVIDUAL_ITEMS } from '@/mocks/template'
import { useToastStore } from '@/stores/toastStore'

interface InitialData {
  name?: string
  commonItems?: TemplateItem[]
  individualItems?: TemplateItem[]
  attendanceItemIds?: number[]
  messageOrder?: string[]
}

export default function useTemplateEditor(initial: InitialData = {}) {
  const router = useRouter()
  const addToast = useToastStore((s) => s.addToast)
  const [isSaving, setIsSaving] = useState(false)
  const [hasNameError, setHasNameError] = useState(false)

  const initCommon = initial.commonItems ?? INITIAL_COMMON_ITEMS
  const initIndividual = initial.individualItems ?? INITIAL_INDIVIDUAL_ITEMS

  const [templateName, setTemplateName] = useState(initial.name ?? '')
  const [commonItems, setCommonItems] = useState<TemplateItem[]>(initCommon)
  const [individualItems, setIndividualItems] = useState<TemplateItem[]>(initIndividual)
  const [deletedItemIds, setDeletedItemIds] = useState<number[]>([])
  const [messageOrder, setMessageOrder] = useState<string[]>(
    initial.messageOrder ?? [
      ...initCommon.map((i) => i.id),
      '__attendance__',
      ...initIndividual.map((i) => i.id),
    ]
  )

  const allItemsMap = useMemo(() => {
    const map = new Map<string, TemplateItem>()
    map.set('__attendance__', {
      id: '__attendance__',
      label: '출결',
      isActive: true,
      isInMessage: true,
      locked: true,
      category: 'individual',
      itemType: 'attendance',
    })
    for (const item of commonItems) map.set(item.id, item)
    for (const item of individualItems) map.set(item.id, item)
    return map
  }, [commonItems, individualItems])

  const ITEM_TYPE_MAP: Record<TemplateItem['itemType'], string> = {
    number: 'NUMBER',
    text: 'TEXT',
    choice: 'SELECT',
    completion: 'COMPLETE',
    inline: 'TEXT',
    attendance: 'ATTENDANCE',
  }

  const buildItems = (items: TemplateItem[]): CreateTemplateItemDto[] =>
    items
      .filter((item) => item.label.trim() !== '' && item.itemType !== 'attendance')
      .map((item) => {
        const numericId = Number(item.id)
        const sortOrder = messageOrder.indexOf(item.id)
        return {
          ...(numericId > 0 ? { id: numericId } : {}),
          name: item.label,
          item_type: ITEM_TYPE_MAP[item.itemType],
          is_common: item.category === 'common',
          include_in_message: item.isInMessage,
          sort_order: sortOrder >= 0 ? sortOrder : 999,
          options: item.choices ?? [],
        }
      })

  const handleTemplateNameChange = (value: string) => {
    setTemplateName(value)
    if (hasNameError && value.trim()) setHasNameError(false)
  }

  const handleSave = async () => {
    if (!templateName.trim()) {
      addToast({ variant: 'warning', message: '템플릿 이름을 입력해주세요.' })
      setHasNameError(true)
      return
    }
    setHasNameError(false)
    setIsSaving(true)
    const attendanceSortOrder = messageOrder.indexOf('__attendance__')
    const ATTENDANCE_ITEM: CreateTemplateItemDto = {
      name: '출결',
      item_type: 'ATTENDANCE',
      is_common: false,
      include_in_message: true,
      sort_order: attendanceSortOrder >= 0 ? attendanceSortOrder : 0,
      options: [],
    }
    try {
      await templateService.createTemplate({
        name: templateName,
        items: [ATTENDANCE_ITEM, ...buildItems([...commonItems, ...individualItems])],
      })
      addToast({ variant: 'success', message: '템플릿이 저장됐어요.' })
      router.push('/template')
    } catch (err) {
      console.error('템플릿 저장 실패', err)
      addToast({ variant: 'error', message: '템플릿 저장에 실패했어요.' })
      router.push('/template')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdate = async (templateId: number) => {
    if (!templateName.trim()) {
      addToast({ variant: 'warning', message: '템플릿 이름을 입력해주세요.' })
      setHasNameError(true)
      return
    }
    setHasNameError(false)
    setIsSaving(true)
    const attendanceSortOrder = messageOrder.indexOf('__attendance__')
    const ATTENDANCE_ITEM: CreateTemplateItemDto = {
      name: '출결',
      item_type: 'ATTENDANCE',
      is_common: false,
      include_in_message: true,
      sort_order: attendanceSortOrder >= 0 ? attendanceSortOrder : 0,
      options: [],
    }
    try {
      await templateService.updateTemplate(templateId, {
        name: templateName,
        items: [ATTENDANCE_ITEM, ...buildItems([...commonItems, ...individualItems])],
        deleted_item_ids: deletedItemIds,
      })
      addToast({ variant: 'success', message: '템플릿이 수정됐어요.' })
      router.push('/template')
    } catch (err) {
      console.error('템플릿 수정 실패', err)
      addToast({ variant: 'error', message: '템플릿 수정에 실패했어요.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleCommonItem = (id: string) => {
    setCommonItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item))
    )
  }

  const handleDeleteCommonItem = (id: string) => {
    const numericId = Number(id)
    if (numericId > 0) setDeletedItemIds((prev) => [...prev, numericId])
    setCommonItems((prev) => prev.filter((item) => item.id !== id))
    setMessageOrder((prev) => prev.filter((orderId) => orderId !== id))
  }

  const handleAddCommonItem = (): string => {
    const newId = 'c-' + Date.now()
    setCommonItems((prev) => [
      ...prev,
      {
        id: newId,
        label: '',
        isActive: true,
        isInMessage: true,
        category: 'common',
        itemType: 'inline',
      },
    ])
    setMessageOrder((prev) => [...prev, newId])
    return newId
  }

  const handleUpdateCommonItem = (id: string, label: string) => {
    setCommonItems((prev) => prev.map((item) => (item.id === id ? { ...item, label } : item)))
  }

  const handleToggleIndividualItem = (id: string) => {
    setIndividualItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item))
    )
  }

  const handleDeleteIndividualItem = (id: string) => {
    const numericId = Number(id)
    if (numericId > 0) setDeletedItemIds((prev) => [...prev, numericId])
    setIndividualItems((prev) => prev.filter((item) => item.id !== id))
    setMessageOrder((prev) => prev.filter((orderId) => orderId !== id))
  }

  const handleAddIndividualItem = (label: string, type: string, choices?: string[]) => {
    const newId = 'i-' + Date.now()
    setIndividualItems((prev) => [
      ...prev,
      {
        id: newId,
        label,
        isActive: true,
        isInMessage: true,
        category: 'individual',
        itemType: type as TemplateItem['itemType'],
        choices,
      },
    ])
    setMessageOrder((prev) => [...prev, newId])
  }

  const handleMessagePreviewToggle = (id: string) => {
    const toggle = (prev: TemplateItem[]) =>
      prev.map((item) => (item.id === id ? { ...item, isInMessage: !item.isInMessage } : item))
    setCommonItems(toggle)
    setIndividualItems(toggle)
  }

  const handleMessageReorder = (newOrder: string[]) => setMessageOrder(newOrder)

  return {
    templateName,
    setTemplateName,
    hasNameError,
    handleTemplateNameChange,
    commonItems,
    individualItems,
    messageOrder,
    allItemsMap,
    isSaving,
    handleSave,
    handleUpdate,
    handleToggleCommonItem,
    handleDeleteCommonItem,
    handleAddCommonItem,
    handleUpdateCommonItem,
    handleToggleIndividualItem,
    handleDeleteIndividualItem,
    handleAddIndividualItem,
    handleMessagePreviewToggle,
    handleMessageReorder,
  }
}