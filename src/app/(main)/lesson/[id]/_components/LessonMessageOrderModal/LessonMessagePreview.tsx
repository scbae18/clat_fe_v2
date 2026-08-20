'use client'

import MessagePreviewShell from '@/components/message/MessagePreviewShell'
import type { TemplateItem } from '@/app/(main)/template/_types/template'
import { useUserStore } from '@/stores/userStore'
import type { LessonStudent } from '@/types/lessonStudent'
import { parseItemRef, matchesLessonItem } from '@/lib/lessonItemRef'
import type { LessonItemDetail } from '@/services/lesson'

interface LessonMessagePreviewProps {
  messageOrder: string[]
  allItemsMap: Map<string, TemplateItem>
  className: string
  academyName?: string
  lessonDate: string
  commonValues: Record<string, string>
  students: LessonStudent[]
  lessonItems: LessonItemDetail[]
}

function formatLessonDate(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00')
  return `${d.getMonth() + 1}월 ${d.getDate()}일`
}

function resolvePreviewValue(
  item: TemplateItem,
  commonValues: Record<string, string>,
  sampleStudent: LessonStudent | undefined,
  lessonItems: LessonItemDetail[],
): string {
  if (item.itemType === 'attendance') {
    return sampleStudent?.attendance ?? '입력 필요'
  }

  const { source, id } = parseItemRef(item.id)
  const refKey = item.id
  const lessonItem = lessonItems.find(
    (li) => (li.source ?? 'template') === source && li.id === id,
  )

  if (item.category === 'common') {
    const value = commonValues[refKey]?.trim()
    return value || '입력 필요'
  }

  if (!sampleStudent || !lessonItem) return '입력 필요'

  const studentItem = sampleStudent.items.find((row) => matchesLessonItem(row, lessonItem))

  if (item.itemType === 'completion') {
    if (studentItem?.is_completed === true) return '완료'
    if (studentItem?.is_completed === false) return '미완료'
    return '입력 필요'
  }

  const value = studentItem?.value?.trim()
  if (value) return value
  if (item.itemType === 'choice') return item.choices?.[0] ?? '입력 필요'
  return '입력 필요'
}

export default function LessonMessagePreview({
  messageOrder,
  allItemsMap,
  className,
  academyName,
  lessonDate,
  commonValues,
  students,
  lessonItems,
}: LessonMessagePreviewProps) {
  const activeItems = messageOrder
    .map((id) => allItemsMap.get(id))
    .filter(
      (item): item is TemplateItem =>
        !!item && item.isActive && item.isInMessage && (item.sendToParent || item.sendToStudent),
    )

  const user = useUserStore((s) => s.user)
  const teacherName = user?.name ?? '강사명'
  const sampleStudent = students[0]

  return (
    <MessagePreviewShell
      academyName={academyName ?? '학원명'}
      teacherName={teacherName}
      className={className}
      dateLabel={formatLessonDate(lessonDate)}
      emptyMessage="문자에 포함된 항목이 없어요"
      items={activeItems.map((item) => ({
        id: item.id,
        label: item.label,
        value: resolvePreviewValue(item, commonValues, sampleStudent, lessonItems),
      }))}
    />
  )
}
