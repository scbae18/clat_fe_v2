'use client'

import MessagePreviewShell from '@/components/message/MessagePreviewShell'
import type { TemplateItem } from '../../_types/template'
import { useUserStore } from '@/stores/userStore'

const DUMMY_ACADEMY = '엘리에듀학원'
const DUMMY_CLASS = '미적분 A반'

function getDummyValue(item: TemplateItem): string {
  if (item.itemType === 'attendance') return '출석'
  if (item.category === 'common') return '입력 필요'
  switch (item.itemType) {
    case 'number':
      return '87'
    case 'text':
      return '입력 필요'
    case 'choice':
      return item.choices?.[0] ?? '입력 필요'
    case 'completion':
      return '완료'
    default:
      return '입력 필요'
  }
}

function formatDate(date: Date): string {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}

interface MessagePreviewProps {
  messageOrder: string[]
  allItemsMap: Map<string, TemplateItem>
}

export default function MessagePreview({ messageOrder, allItemsMap }: MessagePreviewProps) {
  const activeItems = messageOrder
    .map((id) => allItemsMap.get(id))
    .filter((item): item is TemplateItem => !!item && item.isActive && item.isInMessage)

  const today = formatDate(new Date())
  const user = useUserStore((s) => s.user)
  const teacherName = user?.name ?? '강사명'

  return (
    <MessagePreviewShell
      academyName={DUMMY_ACADEMY}
      teacherName={teacherName}
      className={DUMMY_CLASS}
      dateLabel={today}
      emptyMessage="활성화된 항목이 없어요"
      items={activeItems.map((item) => ({
        id: item.id,
        label: item.label,
        value: getDummyValue(item),
      }))}
    />
  )
}
