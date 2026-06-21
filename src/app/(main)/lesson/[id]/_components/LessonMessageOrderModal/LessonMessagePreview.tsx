'use client'

import Text from '@/components/common/Text'
import type { TemplateItem } from '@/app/(main)/template/_types/template'
import { useUserStore } from '@/stores/userStore'
import type { LessonStudent } from '@/types/lessonStudent'
import { parseItemRef, matchesLessonItem } from '@/lib/lessonItemRef'
import type { LessonItemDetail } from '@/services/lesson'
import {
  sectionHeaderStyle,
  messageContainerStyle,
  emptyStyle,
  lineStyle,
  chipStyle,
  valueChipStyle,
  dividerStyle,
  itemListStyle,
  bulletLineStyle,
} from '@/app/(main)/template/_components/MessagePreview/MessagePreview.css'

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
    return studentItem?.value?.trim() || '입력 필요'
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
    .filter((item): item is TemplateItem => !!item && item.isActive && item.isInMessage)

  const user = useUserStore((s) => s.user)
  const teacherName = user?.name ?? '강사명'
  const sampleStudent = students[0]

  return (
    <div>
      <div className={sectionHeaderStyle}>
        <Text variant="headingMd">문자 미리보기</Text>
        <Text variant="bodyMd" color="gray500">
          실제 발송될 문자 형태예요
        </Text>
      </div>

      {activeItems.length === 0 ? (
        <div className={emptyStyle}>문자에 포함된 항목이 없어요</div>
      ) : (
        <div className={messageContainerStyle}>
          <div className={lineStyle}>
            <span>안녕하세요,</span>
            <span className={chipStyle}>{academyName ?? '학원명'}</span>
            <span className={chipStyle}>{teacherName}</span>
            <span>강사입니다.</span>
          </div>

          <div className={lineStyle}>
            <span className={chipStyle}>{className}</span>
            <span className={chipStyle}>{formatLessonDate(lessonDate)}</span>
            <span>수업 결과를 안내드립니다.</span>
          </div>

          <div className={dividerStyle} />

          <div className={itemListStyle}>
            {activeItems.map((item) => (
              <div key={item.id} className={bulletLineStyle}>
                <span>•</span>
                <span>{item.label.replace(' *', '')}:</span>
                <span className={valueChipStyle}>
                  {resolvePreviewValue(item, commonValues, sampleStudent, lessonItems)}
                </span>
              </div>
            ))}
          </div>

          <div className={dividerStyle} />

          <span>감사합니다.</span>
        </div>
      )}
    </div>
  )
}
