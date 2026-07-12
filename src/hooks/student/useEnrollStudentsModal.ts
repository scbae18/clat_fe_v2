import { useEffect, useState } from 'react'

import useToggleArray from '@/hooks/useToggleArray'
import { studentService } from '@/services/student'
import type { Student } from '@/types/student'

type UseEnrollStudentsModalParams = {
  isOpen: boolean
  currentStudentIds?: number[]
  onClose: () => void
  onConfirm: (studentIds: number[]) => void
}

export function useEnrollStudentsModal({
  isOpen,
  currentStudentIds = [],
  onClose,
  onConfirm,
}: UseEnrollStudentsModalParams) {
  const [search, setSearch] = useState('')
  const [candidates, setCandidates] = useState<Student[]>([])
  const { items: selectedIds, toggle: toggleSelect, reset: resetIds } = useToggleArray<number>()

  useEffect(() => {
    if (!isOpen) return
    studentService.getStudents().then((res) => setCandidates(res.data))
  }, [isOpen])

  const filtered = candidates
    .filter((s) => !currentStudentIds.includes(s.id))
    .filter((s) => s.name.includes(search) || s.phone.includes(search))
    .sort((a, b) => a.name.localeCompare(b.name, 'ko'))

  const handleClose = () => {
    setSearch('')
    resetIds()
    onClose()
  }

  const handleConfirm = () => {
    onConfirm(selectedIds)
    handleClose()
  }

  return {
    search,
    setSearch,
    filtered,
    selectedIds,
    toggleSelect,
    handleClose,
    handleConfirm,
    canSubmit: selectedIds.length > 0,
  }
}
