'use client'

import Text from '@/components/common/Text'
import type { TemplateItem } from '../../_types/template'
import { useUserStore } from '@/stores/userStore'
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
} from './MessagePreview.css'

// 추후 온보딩 데이터로 교체
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
    <div>
      <div className={sectionHeaderStyle}>
        <Text variant="headingMd">문자 미리보기</Text>
        <Text variant="bodyMd" color="gray500">
          실제 발송될 문자 형태예요
        </Text>
      </div>

      {activeItems.length === 0 ? (
        <div className={emptyStyle}>활성화된 항목이 없어요</div>
      ) : (
        <div className={messageContainerStyle}>
          {/* 인사말 */}
          <div className={lineStyle}>
            <span>안녕하세요,</span>
            <span className={chipStyle}>{DUMMY_ACADEMY}</span>
            <span className={chipStyle}>{teacherName}</span>
            <span>강사입니다.</span>
          </div>

          {/* 반/날짜 */}
          <div className={lineStyle}>
            <span className={chipStyle}>{DUMMY_CLASS}</span>
            <span className={chipStyle}>{today}</span>
            <span>수업 결과를 안내드립니다.</span>
          </div>

          <div className={dividerStyle} />

          {/* 항목 목록 */}
          <div className={itemListStyle}>
            {activeItems.map((item) => (
              <div key={item.id} className={bulletLineStyle}>
                <span>•</span>
                <span>{item.label.replace(' *', '')}:</span>
                <span className={valueChipStyle}>{getDummyValue(item)}</span>
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
