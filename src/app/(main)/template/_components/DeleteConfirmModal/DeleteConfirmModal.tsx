import ConfirmModal from '@/components/common/ConfirmModal'
import Button from '@/components/common/Button'
import Text from '@/components/common/Text'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  templateName: string
  classCount: number
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  templateName,
  classCount,
}: DeleteConfirmModalProps) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`'${templateName}'을 삭제할까요?`}
      descriptions={[
        `현재 ${classCount}개의 반에서 사용하고 있어요.`,
        `삭제 후에는 복구할 수 없어요.`,
      ]}
      confirmLabel="삭제"
      confirmVariant="danger"
    />
  )
}
