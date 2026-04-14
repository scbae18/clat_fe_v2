'use client'

import { useState, useEffect } from 'react'
import Text from '@/components/common/Text'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import CheckIcon from '@/assets/icons/icon-check.svg'
import { colors } from '@/styles/tokens/colors'
import useToggleArray from '@/hooks/useToggleArray'
import { studentService } from '@/services/student'
import type { Student } from '@/types/student'
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
} from './AddStudentModal.css'

interface AddStudentModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (studentIds: number[]) => void
  currentStudentIds?: number[]
}

export default function AddStudentModal({
  isOpen,
  onClose,
  onConfirm,
  currentStudentIds = []
}: AddStudentModalProps) {
  const [search, setSearch] = useState('')
  const [candidates, setCandidates] = useState<Student[]>([])
  const { items: selectedIds, toggle: toggleSelect, reset: resetIds } = useToggleArray<number>()

  useEffect(() => {
    if (!isOpen) return
    studentService.getStudents().then((res) => setCandidates(res.data))
  }, [isOpen])

  // filtered 수정 — 이미 소속된 학생 제외
  const filtered = candidates
    .filter((s) => !currentStudentIds.includes(s.id))
    .filter((s) => s.name.includes(search) || s.phone.includes(search))

  const handleClose = () => {
    setSearch('')
    resetIds()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <div className={titleStyle}>
        <Text variant="headingLg">학생 추가</Text>
      </div>
      <div className={searchWrapperStyle}>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="학생 이름 또는 전화번호 검색"
        />
      </div>
      <div className={studentListStyle}>
        {filtered.length === 0 ? (
          <div className={emptyStyle}>검색 결과가 없어요</div>
        ) : (
          filtered.map((student) => {
            const isSelected = selectedIds.includes(student.id)
            return (
              <div
                key={student.id}
                className={`${studentRowStyle}${isSelected ? ` ${studentRowSelectedStyle}` : ''}`}
                onClick={() => toggleSelect(student.id)}
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
        <Button variant="ghost" size="lg" fullWidth onClick={handleClose}>
          취소
        </Button>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={selectedIds.length === 0}
          onClick={() => {
            onConfirm(selectedIds)
            handleClose()
          }}
        >
          추가 {selectedIds.length > 0 && `(${selectedIds.length})`}
        </Button>
      </div>
    </Modal>
  )
}
