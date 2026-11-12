import { useEffect, useRef, useState } from 'react'

import useToggleArray from '@/hooks/useToggleArray'
import { classService, type Class } from '@/services/class'
import { studentService } from '@/services/student'
import { formatPhoneInput } from '@/lib/phone'
import { apiErrorMessage } from '@/lib/api/http'
import { useToastStore } from '@/stores/toastStore'

export type StudentFormData = {
  name: string
  phone: string
  parent_phone: string
  parent_phone_2: string
  school_name: string
  grade: string
  class_ids: number[]
}

type UseStudentFormModalParams = {
  isOpen: boolean
  mode?: 'add' | 'edit'
  defaultValues?: Partial<StudentFormData>
  onClose: () => void
  onConfirm: (data: StudentFormData) => void | Promise<void>
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
  const [parentPhone2, setParentPhone2] = useState('')
  const [showSecondParent, setShowSecondParent] = useState(false)
  const [schoolName, setSchoolName] = useState('')
  const [grade, setGrade] = useState('')
  const [classes, setClasses] = useState<Class[]>([])
  const [isBulkLoading, setIsBulkLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
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
    if (defaultValues) {
      setName(defaultValues.name ?? '')
      setPhone(defaultValues.phone ?? '')
      setParentPhone(defaultValues.parent_phone ?? '')
      setParentPhone2(defaultValues.parent_phone_2 ?? '')
      setShowSecondParent(Boolean((defaultValues.parent_phone_2 ?? '').trim()))
      setSchoolName(defaultValues.school_name ?? '')
      setGrade(defaultValues.grade ?? '')
      setSelectedClassIds(defaultValues.class_ids ?? [])
    }
    let cancelled = false
    classService
      .getClasses({ status: 'active' })
      .then((res) => {
        if (!cancelled) setClasses(res.data)
      })
      .catch((err) => console.error('반 목록 조회 실패', err))
    return () => {
      cancelled = true
    }
  }, [isOpen])

  const handleClose = () => {
    setName('')
    setPhone('')
    setParentPhone('')
    setParentPhone2('')
    setShowSecondParent(false)
    setSchoolName('')
    setGrade('')
    resetClasses()
    onClose()
  }

  const handleConfirm = async () => {
    if (!name.trim() || submitting) return
    setSubmitting(true)
    try {
      await onConfirm({
        name,
        phone,
        parent_phone: parentPhone,
        parent_phone_2: showSecondParent ? parentPhone2 : '',
        school_name: schoolName,
        grade,
        class_ids: selectedClassIds,
      })
      handleClose()
    } catch (err) {
      addToast({
        variant: 'error',
        message: apiErrorMessage(
          err,
          mode === 'add' ? '학생 등록에 실패했어요.' : '학생 정보 수정에 실패했어요.',
        ),
      })
    } finally {
      setSubmitting(false)
    }
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
          (bulkRes.limit_skipped_count ?? 0) > 0
            ? `${bulkRes.success_count + (bulkRes.limit_skipped_count ?? 0)}명 중 ${bulkRes.success_count}명을 등록했어요. ${bulkRes.limit_skipped_count}명은 학생 수 한도 때문에 등록하지 못했어요.`
            : bulkRes.fail_count > 0
              ? `${bulkRes.success_count} ok, ${bulkRes.fail_count} failed`
              : `${bulkRes.success_count} students added`,
      })
      onBulkConfirm?.()
      handleClose()
    } catch (err) {
      addToast({
        variant: 'error',
        message: apiErrorMessage(err, '엑셀 업로드에 실패했어요.'),
      })
    } finally {
      setIsBulkLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return {
    name,
    setName,
    phone,
    setPhone: (v: string) => setPhone(formatPhoneInput(v)),
    parentPhone,
    setParentPhone: (v: string) => setParentPhone(formatPhoneInput(v)),
    parentPhone2,
    setParentPhone2: (v: string) => setParentPhone2(formatPhoneInput(v)),
    showSecondParent,
    openSecondParent: () => setShowSecondParent(true),
    schoolName,
    setSchoolName,
    grade,
    setGrade,
    classes,
    selectedClassIds,
    toggleClass,
    isBulkLoading,
    fileInputRef,
    handleClose,
    handleConfirm,
    handleExcelUpload,
    submitting,
    canSubmit: Boolean(name.trim()) && !submitting,
  }
}
