'use client'

import { useState } from 'react'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import Text from '@/components/common/Text'
import { actionsStyle, contentStyle, titleStyle } from '@/components/common/ConfirmModal/ConfirmModal.css'
import { billingService, type GrantNotice } from '@/services/billing'

type GrantNoticeModalProps = {
  notice: GrantNotice | null
  onDone: () => void
}

function limitLine(notice: GrantNotice): string {
  const messages = notice.included_messages.toLocaleString('ko-KR')
  if (notice.student_limit == null) {
    return `알림톡은 한 달에 ${messages}통까지 보낼 수 있습니다.`
  }
  return `학생 ${notice.student_limit}명, 알림톡은 한 달에 ${messages}통까지 쓸 수 있습니다.`
}

export default function GrantNoticeModal({ notice, onDone }: GrantNoticeModalProps) {
  const [saving, setSaving] = useState(false)

  const close = async () => {
    if (!notice || saving) return
    setSaving(true)
    try {
      await billingService.markGrantNoticeSeen()
    } catch {
      // 닫기는 막지 않는다. 다음에 다시 안내한다.
    } finally {
      setSaving(false)
      onDone()
    }
  }

  return (
    <Modal isOpen={notice != null} onClose={() => void close()} size="sm">
      {notice ? (
        <>
          <div className={contentStyle}>
            <Text variant="headingMd" as="h2" className={titleStyle}>
              {notice.plan_name} {notice.months}개월이 부여됐어요
            </Text>
            <Text variant="bodyLg" color="gray500">
              {limitLine(notice)}
            </Text>
          </div>
          <div className={actionsStyle}>
            <Button variant="primary" size="md" fullWidth disabled={saving} onClick={() => void close()}>
              확인
            </Button>
          </div>
        </>
      ) : null}
    </Modal>
  )
}
