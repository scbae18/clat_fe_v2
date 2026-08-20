'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Text from '@/components/common/Text'
import Button from '@/components/common/Button'
import ArrowLeftIcon from '@/assets/icons/icon-arrow-left.svg'
import DownloadIcon from '@/assets/icons/icon-download.svg'
import SaveIcon from '@/assets/icons/icon-save.svg'
import ChevronDownIcon from '@/assets/icons/icon-chevron-down.svg'
import MessageIcon from '@/assets/icons/icon-message.svg'
import LessonTable from './_components/LessonTableSection/LessonTableSection'
import CommonContent from './_components/CommonContent/CommonContent'
import ProgressBar from './_components/ProgressBar/ProgressBar'
import AlimtalkSendModal from './_components/AlimtalkSendModal/AlimtalkSendModal'
import ConfirmModal from '@/components/common/ConfirmModal'
import TemplateSelectModal from '../_components/TemplateSelectModal/TemplateSelectModal'
import {
  pageStyle,
  headerStyle,
  footerStyle,
  sectionStyle,
  backButtonStyle,
  headerLeftStyle,
  headerButtonGroupStyle,
  autoSaveHintStyle,
  templateChipButtonStyle,
} from './lessonDetail.css'
import useLessonDetail from '@/hooks/useLessonDetail'
import useDisclosure from '@/hooks/useDisclosure'
import { lessonService } from '@/services/lesson'
import { useToastStore } from '@/stores/toastStore'
import AttendanceStartModal from '@/components/attendance/AttendanceStartModal'
import type { LessonItemDetail } from '@/services/lesson'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useQueryClient } from '@tanstack/react-query'
import { invalidateLessonLists } from '@/lib/queryKeys'
import { useLessonAttendanceOnDetail } from '@/hooks/lesson/useLessonAttendanceOnDetail'

export default function LessonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const lessonId = Number(id)
  const router = useRouter()
  const queryClient = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)

  const {
    lesson,
    error,
    commonValues,
    updateCommonValue,
    students,
    updateStudents,
    flushPendingStudentCellSave,
    alimtalkSendModal,
    openAlimtalkSendModal,
    inputCount,
    isLoading,
    isAutoSaving,
    hasUnsavedChanges,
    saveDirtyChanges,
    handleExcelDownload,
    refetch,
    refetchAfterAttendanceEnd,
    addAdhocItem,
    removeAdhocItem,
    excludeTemplateItem,
    updateLessonItemOrder,
    setItemPartial,
  } = useLessonDetail(lessonId)

  const templateModal = useDisclosure()
  const templateConfirmModal = useDisclosure()
  const removeItemConfirmModal = useDisclosure()
  const [pendingTemplateId, setPendingTemplateId] = useState<number | null>(null)
  const [removeTarget, setRemoveTarget] = useState<LessonItemDetail | null>(null)

  const {
    hasAttendanceItem,
    attendanceStartModal,
    handleAttendanceButtonClick,
    attendanceButtonLabel,
    attendanceButtonVariant,
  } = useLessonAttendanceOnDetail({
    lessonId,
    lesson,
    error,
    students,
    refetchAfterAttendanceEnd,
  })

  const handleTemplateSelect = (templateId: number) => {
    setPendingTemplateId(templateId)
    templateModal.close()
    templateConfirmModal.open()
  }

  const handleTemplateChange = async (templateId?: number) => {
    const targetId = templateId ?? pendingTemplateId
    if (!lesson || !targetId) return
    templateConfirmModal.close()
    templateModal.close()
    try {
      await lessonService.updateLesson(lessonId, {
        template_id: targetId,
        status: 'SAVED',
        common_data: [],
        student_data: students.map((s) => ({ student_id: s.id, items: [] })),
      })
      refetch()
    } catch {
      addToast({ variant: 'error', message: '템플릿 변경에 실패했어요.' })
    } finally {
      setPendingTemplateId(null)
    }
  }

  if (isLoading || !lesson) return null

  if (error === 'TEMPLATE_NOT_FOUND') {
    return (
      <div className={pageStyle}>
        <div className={headerStyle}>
          <div className={headerLeftStyle}>
            <button
              onClick={() => {
                invalidateLessonLists(queryClient)
                router.push('/lesson')
              }}
              className={backButtonStyle}
            >
              <ArrowLeftIcon width={24} height={24} />
            </button>
            <Text variant="display" as="h1">
              {format(new Date(lesson.lesson_date), 'M월 d일(E)', { locale: ko })}{' '}
              {lesson.class_name}
            </Text>
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            minHeight: 'calc(100vh - 300px)',
          }}
        >
          <Text variant="headingMd">템플릿이 삭제됐어요</Text>
          <Text variant="bodyLg" color="gray500">
            다른 템플릿을 선택해주세요
          </Text>
          <Button variant="primary" size="md" onClick={templateModal.open}>
            템플릿 선택
          </Button>
        </div>
        <TemplateSelectModal
          isOpen={templateModal.isOpen}
          onClose={templateModal.close}
          onConfirm={handleTemplateChange}
          title="템플릿 선택"
          confirmLabel="선택"
        />
      </div>
    )
  }

  const commonItems = lesson.items
    .filter((i) => i.is_common && i.item_type === 'TEXT')
    .map((i) => ({
      id: i.id,
      source: i.source ?? 'template',
      label: i.name,
    }))

  const handleRemoveItem = (item: LessonItemDetail) => {
    setRemoveTarget(item)
    removeItemConfirmModal.open()
  }

  const confirmRemoveItem = async () => {
    if (!removeTarget) return
    removeItemConfirmModal.close()
    try {
      if (removeTarget.source === 'adhoc') {
        await removeAdhocItem(removeTarget.id)
      } else {
        await excludeTemplateItem(removeTarget.id)
      }
    } catch {
      addToast({ variant: 'error', message: '항목 제거에 실패했어요.' })
    } finally {
      setRemoveTarget(null)
    }
  }

  return (
    <div className={pageStyle}>
      <div className={headerStyle}>
        <div className={headerLeftStyle}>
          <button
            onClick={() => {
              invalidateLessonLists(queryClient)
              router.push('/lesson')
            }}
            className={backButtonStyle}
          >
            <ArrowLeftIcon width={24} height={24} />
          </button>
          <Text variant="display" as="h1">
            {format(new Date(lesson.lesson_date), 'M월 d일(E)', { locale: ko })} {lesson.class_name}
          </Text>
          <Button
            variant="ghost"
            size="sm"
            rightIcon={<ChevronDownIcon width={20} height={20} />}
            onClick={templateModal.open}
            className={templateChipButtonStyle}
          >
            {lesson.template_name}
          </Button>
        </div>
        <div className={headerButtonGroupStyle}>
          {hasAttendanceItem && (
            <Button
              variant={attendanceButtonVariant}
              size="sm"
              onClick={handleAttendanceButtonClick}
            >
              {attendanceButtonLabel}
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<DownloadIcon width={20} height={20} />}
            onClick={handleExcelDownload}
          >
            엑셀 다운로드
          </Button>
          {(isAutoSaving || hasUnsavedChanges) && (
            <span className={autoSaveHintStyle}>
              {isAutoSaving ? '저장 중…' : '저장 대기'}
            </span>
          )}
          <Button
            variant="primary"
            size="sm"
            leftIcon={<SaveIcon width={20} height={20} />}
            onClick={() => void saveDirtyChanges()}
          >
            저장
          </Button>
        </div>
      </div>

      <div className={sectionStyle}>
        <Text variant="headingMd">공통 내용</Text>
        <CommonContent
          lessonId={lessonId}
          items={commonItems}
          values={commonValues}
          onChange={updateCommonValue}
          onAddCommon={(name) => addAdhocItem({ name, is_common: true })}
          onRemoveItem={(item) =>
            handleRemoveItem({
              id: item.id,
              source: item.source,
              name: item.label,
              item_type: 'TEXT',
              is_common: true,
              include_in_message: false,
              sort_order: 0,
            })
          }
        />
      </div>

      <div className={sectionStyle}>
        <Text variant="headingMd">개별 내용</Text>
        <LessonTable
          students={students}
          templateItems={lesson.items}
          onChange={updateStudents}
          onCellBlur={flushPendingStudentCellSave}
          onAddItem={addAdhocItem}
          onRemoveColumn={handleRemoveItem}
          onTogglePartial={(item, isPartial) => void setItemPartial(item, isPartial)}
        />
      </div>

      <div className={footerStyle}>
        <ProgressBar current={inputCount} total={students.length} />
        <Button
          variant="primary"
          size="sm"
          leftIcon={<MessageIcon width={20} height={20} />}
          onClick={() => void openAlimtalkSendModal()}
        >
          알림톡 전송하기
        </Button>
      </div>

      <TemplateSelectModal
        isOpen={templateModal.isOpen}
        onClose={templateModal.close}
        onConfirm={handleTemplateSelect}
        currentTemplateId={lesson.template_id}
        title="템플릿 변경"
        confirmLabel="확인"
      />

      <ConfirmModal
        isOpen={templateConfirmModal.isOpen}
        onClose={() => {
          templateConfirmModal.close()
          setPendingTemplateId(null)
        }}
        onConfirm={() => handleTemplateChange()}
        title="템플릿을 변경할까요?"
        descriptions={['템플릿을 변경하면 입력한 내용이 모두 사라져요.']}
        confirmLabel="변경"
        confirmVariant="danger"
      />

      <AlimtalkSendModal
        isOpen={alimtalkSendModal.isOpen}
        onClose={alimtalkSendModal.close}
        lessonId={lessonId}
        lesson={lesson}
        commonValues={commonValues}
        students={students}
        onSaveMessageOrder={updateLessonItemOrder}
      />

      <AttendanceStartModal
        isOpen={attendanceStartModal.isOpen}
        onClose={attendanceStartModal.close}
        lessonRecordId={lessonId}
        className={lesson.class_name}
        studentCount={students.length}
        students={students.map((s) => ({ id: s.id, name: s.name }))}
      />

      <ConfirmModal
        isOpen={removeItemConfirmModal.isOpen}
        onClose={() => {
          removeItemConfirmModal.close()
          setRemoveTarget(null)
        }}
        onConfirm={() => void confirmRemoveItem()}
        title="이 수업에서 항목을 제거할까요?"
        descriptions={[
          removeTarget?.source === 'adhoc'
            ? '추가한 항목과 입력값이 삭제돼요.'
            : '템플릿은 그대로이고, 이 수업 화면에서만 숨겨져요.',
        ]}
        confirmLabel="제거"
        confirmVariant="danger"
      />
    </div>
  )
}
