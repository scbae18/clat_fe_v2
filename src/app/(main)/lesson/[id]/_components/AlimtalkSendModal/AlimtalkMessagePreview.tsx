'use client'

import Text from '@/components/common/Text'
import LessonAlimtalkFramePreview from '@/components/message/LessonAlimtalkFramePreview'
import { stripParentDashboardPreviewLine } from '@/lib/lessonAlimtalkFrame'
import type { LessonPreviewRow } from '@/services/lesson'
import * as styles from './AlimtalkSendModal.css'

function hasPhone(value: string | null | undefined) {
  return Boolean(value && String(value).replace(/\D/g, '').length >= 8)
}

interface AlimtalkMessagePreviewProps {
  focused: LessonPreviewRow | undefined
  frameHeader: string
  sendToParent: boolean
  sendToStudent: boolean
}

export default function AlimtalkMessagePreview({
  focused,
  frameHeader,
  sendToParent,
  sendToStudent,
}: AlimtalkMessagePreviewProps) {
  if (!focused) {
    return (
      <Text variant="bodyMd" color="gray500">
        왼쪽에서 학생을 선택하면 미리보기가 표시돼요.
      </Text>
    )
  }

  return (
    <div>
      <Text variant="titleMd">메시지 미리보기</Text>
      {sendToStudent ? (
        <div>
          <div className={styles.previewSectionLabel}>학생용</div>
          <div className={styles.previewBox}>
            {hasPhone(focused.phone) ? (
              <LessonAlimtalkFramePreview header={frameHeader} body={focused.message || ''} />
            ) : (
              '학생 연락처가 없어 이 채널로는 발송되지 않아요.'
            )}
          </div>
        </div>
      ) : null}
      {sendToParent ? (
        <div>
          <div className={styles.previewSectionLabel}>학부모용</div>
          <div className={styles.previewBox}>
            {hasPhone(focused.parent_phone) ? (
              <LessonAlimtalkFramePreview
                header={frameHeader}
                body={stripParentDashboardPreviewLine(focused.message_for_parent || '')}
              />
            ) : (
              '학부모 연락처가 없어 이 채널로는 발송되지 않아요.'
            )}
          </div>
        </div>
      ) : null}
      {!sendToParent && !sendToStudent ? (
        <Text variant="bodyMd" color="gray500">
          학부모 또는 학생 중 받을 대상을 골라 주세요.
        </Text>
      ) : null}
    </div>
  )
}
