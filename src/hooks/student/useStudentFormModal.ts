import { useEffect, useRef, useState } from 'react'

import useToggleArray from '@/hooks/useToggleArray'
import { classService, type Class } from '@/services/class'
import { studentService } from '@/services/student'
import { useToastStore } from '@/stores/toastStore'

export type StudentFormData = {
  name: string
  phone: string
  parent_phone: string
  school_name: string
  class_ids: number[]
}

type UseStudentFormModalParams = {
  isOpen: boolean
  mode?: 'add' | 'edit'
  defaultValues?: Partial<StudentFormData>
  onClose: () => void
  onConfirm: (data: StudentFormData) => void
  onBulkConfirm?: () => void
}

export function useStudentFormModal({
  isOpen,
  mode = 'add',
  defaultValues,
  onClose,
  onConfirm,
  onBulkConfirm,
}: UseStudentFormModalParams) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [classes, setClasses] = useState<Class[]>([])
  const [isBulkLoading, setIsBulkLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const addToast = useToastStore((s) => s.addToast)

  const {
    items: selectedClassIds,
    toggle: toggleClass,
    reset: resetClasses,
    set: setSelectedClassIds,
  } = useToggleArray<number>()

  useEffect(() => {
    if (!isOpen) return
    classService
      .getClasses({ status: 'active' })
      .then((res) => {
        setClasses(res.data)
        if (defaultValues) {
          setName(defaultValues.name ?? '')
          setPhone(defaultValues.phone ?? '')
          setParentPhone(defaultValues.parent_phone ?? '')
          setSchoolName(defaultValues.school_name ?? '')
          setSelectedClassIds(defaultValues.class_ids ?? [])
        }
      })
      .catch((err) => console.error('반 목록 조회 실패', err))
  }, [isOpen])

  const handleClose = () => {
    setName('')
    setPhone('')
    setParentPhone('')
    setSchoolName('')
    resetClasses()
    onClose()
  }

  const handleConfirm = () => {
    if (!name.trim()) return
    onConfirm({
      name,
      phone,
      parent_phone: parentPhone,
      school_name: schoolName,
      class_ids: selectedClassIds,
    })
    handleClose()
  }

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length < 4) return digits
    if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mode !== 'add') return
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setIsBulkLoading(true)
      const bulkRes = await studentService.bulkCreateStudents(file)
      addToast({
        variant: 'success',
        message:
          bulkRes.fail_count > 0
            ? `${bulkRes.success_count} ok, ${bulkRes.fail_count} failed`
            : `${bulkRes.success_count} students added`,
      })
      onBulkConfirm?.()
      handleClose()
    } catch {
      addToast({ variant: 'error', message: '엑셀 업로드에 실패했어요.' })
    } finally {
      setIsBulkLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return {
    name,
    setName,
    phone,
    setPhone: (v: string) => setPhone(formatPhone(v)),
    parentPhone,
    setParentPhone: (v: string) => setParentPhone(formatPhone(v)),
    schoolName,
    setSchoolName,
    classes,
    selectedClassIds,
    toggleClass,
    isBulkLoading,
    fileInputRef,
    handleClose,
    handleConfirm,
    handleExcelUpload,
    canSubmit: Boolean(name.trim()),
  }
}
