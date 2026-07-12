'use client'

import Text from '@/components/common/Text'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import CheckIcon from '@/assets/icons/icon-check.svg'
import { colors } from '@/styles/tokens/colors'
import { useEnrollStudentsModal } from '@/hooks/student/useEnrollStudentsModal'
import {
  titleStyle,
  searchWrapperStyle,
  studentListStyle,
  studentRowStyle,
  studentRowSelectedStyle,
  studentNameStyle,
  studentPhoneStyle,
  actionsStyle,
  emptyStyle,
} from './EnrollStudentsModal.css'

export interface EnrollStudentsModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (studentIds: number[]) => void
  currentStudentIds?: number[]
}

/** 기존 학생을 반에 추가 (등록 폼과 별개) */
export default function EnrollStudentsModal({
  isOpen,
  onClose,
  onConfirm,
  currentStudentIds = [],
}: EnrollStudentsModalProps) {
  const enroll = useEnrollStudentsModal({
    isOpen,
    currentStudentIds,
    onClose,
    onConfirm,
  })

  return (
    <Modal isOpen={isOpen} onClose={enroll.handleClose} size="md">
      <div className={titleStyle}>
        <Text variant="headingLg">학생 추가</Text>
      </div>
      <div className={searchWrapperStyle}>
        <Input
          value={enroll.search}
          onChange={(e) => enroll.setSearch(e.target.value)}
          placeholder="학생 이름 또는 전화번호 검색"
        />
      </div>
      <div className={studentListStyle}>
        {enroll.filtered.length === 0 ? (
          <div className={emptyStyle}>검색 결과가 없어요</div>
        ) : (
          enroll.filtered.map((student) => {
            const isSelected = enroll.selectedIds.includes(student.id)
            return (
              <div
                key={student.id}
                className={`${studentRowStyle}${isSelected ? ` ${studentRowSelectedStyle}` : ''}`}
                onClick={() => enroll.toggleSelect(student.id)}
              >
                <CheckIcon
                  width={16}
                  height={16}
                  style={{ color: isSelected ? colors.primary500 : colors.gray200 }}
                />
                <span className={studentNameStyle}>{student.name}</span>
                <span className={studentPhoneStyle}>{student.phone}</span>
              </div>
            )
          })
        )}
      </div>
      <div className={actionsStyle}>
        <Button variant="ghost" size="lg" fullWidth onClick={enroll.handleClose}>
          취소
        </Button>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!enroll.canSubmit}
          onClick={enroll.handleConfirm}
        >
          추가 {enroll.selectedIds.length > 0 && `(${enroll.selectedIds.length})`}
        </Button>
      </div>
    </Modal>
  )
}
