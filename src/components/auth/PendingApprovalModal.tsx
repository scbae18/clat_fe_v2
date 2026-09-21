'use client'

import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button/Button'
import Text from '@/components/common/Text/Text'

export const SIGNUP_APPROVAL_PHONE = '010-7324-7708'
export const SIGNUP_APPROVAL_INSTAGRAM = '@clat.official'

export const ACCOUNT_PENDING_MESSAGE =
  `관리자 승인 후 로그인할 수 있어요.\n전화 ${SIGNUP_APPROVAL_PHONE} 또는 인스타 ${SIGNUP_APPROVAL_INSTAGRAM} 로 승인을 요청해 주세요.`

type PendingApprovalModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function PendingApprovalModal({ isOpen, onClose }: PendingApprovalModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <Text variant="headingMd" as="h2">
        가입 신청이 완료됐어요
      </Text>
      <div style={{ marginTop: 12, whiteSpace: 'pre-line' }}>
        <Text variant="bodyMd" color="gray600">
          {ACCOUNT_PENDING_MESSAGE}
        </Text>
      </div>
      <div style={{ marginTop: 24 }}>
        <Button variant="primary" size="lg" fullWidth onClick={onClose}>
          확인
        </Button>
      </div>
    </Modal>
  )
}
