'use client'

import Text from '@/components/common/Text'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import {
  useStudentFormModal,
  type StudentFormData,
} from '@/hooks/student/useStudentFormModal'
import {
  fieldGroupStyle,
  fieldStyle,
  labelStyle,
  classChipGroupStyle,
  classChipRecipe,
  headerStyle,
  requiredMarkStyle,
  actionsStyle,
} from './AddStudentFormModal.css'

export type { StudentFormData }

export interface AddStudentFormModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: StudentFormData) => void
  onBulkConfirm?: () => void
  mode?: 'add' | 'edit'
  defaultValues?: Partial<StudentFormData>
}

export default function AddStudentFormModal({
  isOpen,
  onClose,
  onConfirm,
  onBulkConfirm,
  mode = 'add',
  defaultValues,
}: AddStudentFormModalProps) {
  const form = useStudentFormModal({
    isOpen,
    mode,
    defaultValues,
    onClose,
    onConfirm,
    onBulkConfirm,
  })

  return (
    <Modal isOpen={isOpen} onClose={form.handleClose} size="md">
      <div className={headerStyle}>
        <Text variant="headingLg" as="h2">
          {mode === 'add' ? '학생 등록' : '학생 정보 수정'}
        </Text>
        {mode === 'add' && (
          <>
            <input
              ref={form.fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
              onChange={(e) => void form.handleExcelUpload(e)}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => form.fileInputRef.current?.click()}
              disabled={form.isBulkLoading}
            >
              {form.isBulkLoading ? '업로드 중...' : '엑셀로 일괄 등록'}
            </Button>
          </>
        )}
      </div>
      <div className={fieldGroupStyle}>
        <div className={fieldStyle}>
          <span className={labelStyle}>
            학생명 <span className={requiredMarkStyle}>*</span>
          </span>
          <Input variant="gray" value={form.name} onChange={(e) => form.setName(e.target.value)} />
        </div>
        <div className={fieldStyle}>
          <span className={labelStyle}>학생 전화번호</span>
          <Input
            variant="gray"
            value={form.phone}
            placeholder="숫자만 입력"
            onChange={(e) => form.setPhone(e.target.value)}
          />
        </div>
        <div className={fieldStyle}>
          <span className={labelStyle}>학부모 전화번호</span>
          <Input
            variant="gray"
            value={form.parentPhone}
            placeholder="숫자만 입력"
            onChange={(e) => form.setParentPhone(e.target.value)}
          />
        </div>
        <div className={fieldStyle}>
          <span className={labelStyle}>학교명</span>
          <Input
            variant="gray"
            value={form.schoolName}
            onChange={(e) => form.setSchoolName(e.target.value)}
          />
        </div>
        <div className={fieldStyle}>
          <span className={labelStyle}>소속 반</span>
          <div className={classChipGroupStyle}>
            {form.classes.map((cls) => (
              <button
                key={cls.id}
                type="button"
                className={classChipRecipe({ selected: form.selectedClassIds.includes(cls.id) })}
                onClick={() => form.toggleClass(cls.id)}
              >
                {cls.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={actionsStyle}>
        <Button variant="ghost" size="lg" fullWidth onClick={form.handleClose}>
          취소
        </Button>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!form.canSubmit}
          onClick={form.handleConfirm}
        >
          {mode === 'add' ? '등록하기' : '저장'}
        </Button>
      </div>
    </Modal>
  )
}
