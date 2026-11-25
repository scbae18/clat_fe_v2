'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Text from '@/components/common/Text'
import Button from '@/components/common/Button'
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

function TemplateEditForm({ id, initialData }: { id: number; initialData: EditorInitialData }) {
  const router = useRouter()
  const editor = useTemplateEditor(initialData)

  return (
    <>
      <div className={formHeaderStyle}>
        <div className={formHeaderLeftStyle}>
          <button className={formBackButtonStyle} onClick={() => router.back()}>
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
          onClick={() => editor.handleUpdate(id)}
          disabled={editor.isSaving}
          data-tour="template-save"
        >
          {editor.isSaving ? '저장 중...' : '저장'}
        </Button>
      </div>
      <TemplateEditorPanels editor={editor} tour />
    </>
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