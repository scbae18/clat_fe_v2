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
import MessagePreview from './_components/MessagePreview/MessagePreview'
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
  templateChipButtonStyle,
} from './lessonDetail.css'
import useLessonDetail from '@/hooks/useLessonDetail'
import useDisclosure from '@/hooks/useDisclosure'
import { lessonService } from '@/services/lesson'
import { useToastStore } from '@/stores/toastStore'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

export default function LessonDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const lessonId = Number(id)
  const router = useRouter()
  const addToast = useToastStore((s) => s.addToast)

  const {
    lesson,
    error,
    commonValues,
    setCommonValues,
    students,
    setStudents,
    messagePreview,
    inputCount,
    isLoading,
    handleExcelDownload,
    refetch,
  } = useLessonDetail(lessonId)

  const templateModal = useDisclosure()
  const confirmModal = useDisclosure()
  const [pendingTemplateId, setPendingTemplateId] = useState<number | null>(null)

  const handleSave = async () => {
    if (!lesson) return
    try {
      const attendanceItem = lesson.items.find((i) => i.item_type === 'ATTENDANCE')
      await lessonService.updateLesson({
        lesson_id: lessonId,
        class_id: lesson.class_id,
        lesson_date: lesson.lesson_date,
        template_id: lesson.template_id,
        status: 'SAVED',
        common_data: Object.entries(commonValues).map(([id, value]) => ({
          template_item_id: Number(id),
          value,
        })),
        student_data: students.map((s) => ({
          student_id: s.id,
          items: [
            ...(attendanceItem
              ? [
                  {
                    template_item_id: attendanceItem.id,
                    value: s.attendance ?? '',
                    is_completed: false,
                  },
                ]
              : []),
            ...s.items.map((item) => ({
              template_item_id: item.template_item_id,
              value: item.value,
              // Fix #2: null(미선택)은 null 그대로 전송, ?? false 제거
              is_completed: item.is_completed ?? undefined,
            })),
          ],
        })),
      })
      addToast({ variant: 'success', message: '저장됐어요.' })
    } catch {
      addToast({ variant: 'error', message: '저장에 실패했어요.' })
    }
  }

  const handleTemplateSelect = (templateId: number) => {
    setPendingTemplateId(templateId)
    templateModal.close()
    confirmModal.open()
  }

  const handleTemplateChange = async (templateId?: number) => {
    const targetId = templateId ?? pendingTemplateId
    if (!lesson || !targetId) return
    confirmModal.close()
    templateModal.close()
    try {
      await lessonService.updateLesson({
        lesson_id: lessonId,
        class_id: lesson.class_id,
        lesson_date: lesson.lesson_date,
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

  // 템플릿 삭제된 경우
  if (error === 'TEMPLATE_NOT_FOUND') {
    return (
      <div className={pageStyle}>
        <div className={headerStyle}>
          <div className={headerLeftStyle}>
            <button onClick={() => router.push('/lesson')} className={backButtonStyle}>
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
    .filter((i) => i.is_common)
    .map((i) => ({ id: i.id, label: i.name }))

  return (
    <div className={pageStyle}>
      {/* 헤더 */}
      <div className={headerStyle}>
        <div className={headerLeftStyle}>
          <button onClick={() => router.push('/lesson')} className={backButtonStyle}>
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
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<DownloadIcon width={20} height={20} />}
            onClick={handleExcelDownload}
          >
            엑셀 다운로드
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<SaveIcon width={20} height={20} />}
            onClick={handleSave}
          >
            저장
          </Button>
        </div>
      </div>

      {/* 공통 내용 */}
      {commonItems.length > 0 && (
        <div className={sectionStyle}>
          <Text variant="headingMd">공통 내용</Text>
          <CommonContent
            items={commonItems}
            values={commonValues}
            onChange={(id, value) => setCommonValues((prev) => ({ ...prev, [id]: value }))}
          />
        </div>
      )}

      {/* 개별 내용 */}
      <div className={sectionStyle}>
        <Text variant="headingMd">개별 내용</Text>
        <LessonTable students={students} templateItems={lesson.items} onChange={setStudents} />
      </div>

      {/* 하단 진행도 */}
      <div className={footerStyle}>
        <ProgressBar current={inputCount} total={students.length} />
        <Button
          variant="primary"
          size="sm"
          leftIcon={<MessageIcon width={20} height={20} />}
          onClick={async () => {
            await handleSave()
            messagePreview.open()
          }}
        >
          문자 미리보기
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
        isOpen={confirmModal.isOpen}
        onClose={() => {
          confirmModal.close()
          setPendingTemplateId(null)
        }}
        onConfirm={() => handleTemplateChange()}
        title="템플릿을 변경할까요?"
        descriptions={['템플릿을 변경하면 입력한 내용이 모두 사라져요.']}
        confirmLabel="변경"
        confirmVariant="danger"
      />

      <MessagePreview
        isOpen={messagePreview.isOpen}
        onClose={messagePreview.close}
        lessonId={lessonId}
        lesson={lesson}
      />
    </div>
  )
}
