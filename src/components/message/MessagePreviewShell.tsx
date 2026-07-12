'use client'

import Text from '@/components/common/Text'
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
} from './MessagePreviewShell.css'

export type MessagePreviewLineItem = {
  id: string
  label: string
  value: string
}

export type MessagePreviewShellProps = {
  academyName: string
  teacherName: string
  className: string
  dateLabel: string
  emptyMessage: string
  items: MessagePreviewLineItem[]
}

export default function MessagePreviewShell({
  academyName,
  teacherName,
  className,
  dateLabel,
  emptyMessage,
  items,
}: MessagePreviewShellProps) {
  return (
    <div>
      <div className={sectionHeaderStyle}>
        <Text variant="headingMd">문자 미리보기</Text>
        <Text variant="bodyMd" color="gray500">
          실제 발송될 문자 형태예요
        </Text>
      </div>

      {items.length === 0 ? (
        <div className={emptyStyle}>{emptyMessage}</div>
      ) : (
        <div className={messageContainerStyle}>
          <div className={lineStyle}>
            <span>안녕하세요,</span>
            <span className={chipStyle}>{academyName}</span>
            <span className={chipStyle}>{teacherName}</span>
            <span>강사입니다.</span>
          </div>

          <div className={lineStyle}>
            <span className={chipStyle}>{className}</span>
            <span className={chipStyle}>{dateLabel}</span>
            <span>수업 결과를 안내드립니다.</span>
          </div>

          <div className={dividerStyle} />

          <div className={itemListStyle}>
            {items.map((item) => (
              <div key={item.id} className={bulletLineStyle}>
                <span>•</span>
                <span>{item.label.replace(' *', '')}:</span>
                <span className={valueChipStyle}>{item.value}</span>
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
