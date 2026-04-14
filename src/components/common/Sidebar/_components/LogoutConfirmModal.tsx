import ConfirmModal from '@/components/common/ConfirmModal/ConfirmModal'

interface LogoutConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutConfirmModalProps) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="로그아웃"
      descriptions={["로그아웃 하시겠습니까?"]}
      confirmLabel="로그아웃"
      confirmVariant="danger"
    />
  )
}