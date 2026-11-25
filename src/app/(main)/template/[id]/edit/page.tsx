'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Text from '@/components/common/Text'
import Button from '@/components/common/Button'
import { UnsavedChangesGuard, useRequestLeave } from '@/components/common/UnsavedChangesGuard'
import ArrowLeftIcon from '@/assets/icons/icon-arrow-left.svg'
import SaveIcon from '@/assets/icons/icon-save.svg'
import TemplateEditorPanels from '../../_components/TemplateEditorPanels/TemplateEditorPanels'
import {
  formHeaderStyle,
  formHeaderLeftStyle,
  formBackButtonStyle,
} from '../../template-form.css'
import useTemplateEditor from '@/hooks/useTemplateEditor'
import { templateService, toEditorItems } from '@/services/template'

type EditorInitialData = Parameters<typeof useTemplateEditor>[0]

function TemplateEditHeader({
  onSave,
  isSaving,
}: {
  onSave: () => void
  isSaving: boolean
}) {
  const requestLeave = useRequestLeave()

  return (
    <div className={formHeaderStyle}>
      <div className={formHeaderLeftStyle}>
        <button className={formBackButtonStyle} onClick={() => requestLeave('back')}>
          <ArrowLeftIcon width={24} height={24} />
        </button>
        <div data-tour="template-intro">
          <Text variant="display" as="h1">
            수업 템플릿 수정
          </Text>
        </div>
      </div>
      <Button
        variant="primary"
        size="sm"
        leftIcon={<SaveIcon width={16} height={16} />}
        onClick={onSave}
        disabled={isSaving}
        data-tour="template-save"
      >
        {isSaving ? '저장 중...' : '저장'}
      </Button>
    </div>
  )
}

function TemplateEditForm({ id, initialData }: { id: number; initialData: EditorInitialData }) {
  const editor = useTemplateEditor(initialData)

  return (
    <UnsavedChangesGuard
      dirty={editor.isDirty}
      title="변경 사항이 저장되지 않았습니다."
      description="저장하지 않고 페이지를 나가시겠습니까?"
    >
      <TemplateEditHeader onSave={() => editor.handleUpdate(id)} isSaving={editor.isSaving} />
      <TemplateEditorPanels editor={editor} tour />
    </UnsavedChangesGuard>
  )
}

export default function TemplateEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [initialData, setInitialData] = useState<EditorInitialData>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    templateService.getTemplate(Number(id))
      .then((detail) => {
        setInitialData(toEditorItems(detail))
        setIsLoading(false)
      })
      .catch(() => {
        alert('템플릿을 불러오지 못했습니다.')
        router.push('/template')
      })
  }, [id])

  if (isLoading || !initialData) return null

  return <TemplateEditForm id={Number(id)} initialData={initialData} />
}