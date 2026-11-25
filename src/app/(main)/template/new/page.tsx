'use client'

import { useRouter } from 'next/navigation'
import Text from '@/components/common/Text'
import Button from '@/components/common/Button'
import ArrowLeftIcon from '@/assets/icons/icon-arrow-left.svg'
import SaveIcon from '@/assets/icons/icon-save.svg'
import TemplateEditorPanels from '../_components/TemplateEditorPanels/TemplateEditorPanels'
import {
  formHeaderStyle,
  formHeaderLeftStyle,
  formBackButtonStyle,
} from '../template-form.css'
import useTemplateEditor from '@/hooks/useTemplateEditor'

export default function TemplateNewPage() {
  const router = useRouter()
  const editor = useTemplateEditor()

  return (
    <>
      <div className={formHeaderStyle}>
        <div className={formHeaderLeftStyle}>
          <button className={formBackButtonStyle} onClick={() => router.push('/template')}>
            <ArrowLeftIcon width={24} height={24} />
          </button>
          <Text variant="display" as="h1">
            수업 템플릿 생성
          </Text>
        </div>
        <Button
          variant="primary"
          size="sm"
          leftIcon={<SaveIcon width={16} height={16} />}
          onClick={editor.handleSave}
          disabled={editor.isSaving}
        >
          {editor.isSaving ? '저장 중...' : '저장'}
        </Button>
      </div>
      <TemplateEditorPanels editor={editor} />
    </>
  )
}
