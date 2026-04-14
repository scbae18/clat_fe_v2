'use client'

import { useRouter } from 'next/navigation'
import Text from '@/components/common/Text'
import Button from '@/components/common/Button'
import ArrowLeftIcon from '@/assets/icons/icon-arrow-left.svg'
import SaveIcon from '@/assets/icons/icon-save.svg'
import TemplateName from '../_components/TemplateName/TemplateName'
import ContentSection from '../_components/ContentSection/ContentSection'
import MessageSettings from '../_components/MessageSettings/MessageSettings'
import MessagePreview from '../_components/MessagePreview/MessagePreview'
import {
  pageStyle,
  leftSectionStyle,
  rightSectionStyle,
  sectionBoxStyle,
  formHeaderStyle,
  formHeaderLeftStyle,
  formBackButtonStyle,
} from '../template-form.css'
import useTemplateEditor from '@/hooks/useTemplateEditor'
import type { TemplateItem } from '../_types/template'

const ATTENDANCE_DISPLAY: TemplateItem = {
  id: '__attendance__',
  label: '출결 *',
  isActive: true,
  isInMessage: true,
  locked: true,
  category: 'individual',
  itemType: 'attendance',
}

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
      <div className={pageStyle}>
        <div className={leftSectionStyle}>
          <div className={sectionBoxStyle}>
            <TemplateName value={editor.templateName} onChange={editor.setTemplateName} />
            <div style={{ marginTop: '100px' }}>
              <ContentSection
                title="공통 내용"
                description="모든 학생에게 동일하게 전달할 내용이에요"
                items={editor.commonItems}
                onToggle={editor.handleToggleCommonItem}
                onDelete={editor.handleDeleteCommonItem}
                onAddInline={editor.handleAddCommonItem}
                onUpdate={editor.handleUpdateCommonItem}
              />
            </div>
            <div style={{ marginTop: '100px' }}>
              <ContentSection
                title="개별 내용"
                description="학생마다 다르게 전달할 내용이에요"
                items={[ATTENDANCE_DISPLAY, ...editor.individualItems]}
                onToggle={(id) => {
                  if (id !== '__attendance__') editor.handleToggleIndividualItem(id)
                }}
                onDelete={(id) => {
                  if (id !== '__attendance__') editor.handleDeleteIndividualItem(id)
                }}
                onAdd={editor.handleAddIndividualItem}
              />
            </div>
          </div>
        </div>
        <div className={rightSectionStyle}>
          <div className={sectionBoxStyle}>
            <MessageSettings
              messageOrder={editor.messageOrder}
              allItemsMap={editor.allItemsMap}
              onToggle={editor.handleMessagePreviewToggle}
              onReorder={editor.handleMessageReorder}
            />
          </div>
          <div className={sectionBoxStyle}>
            <MessagePreview messageOrder={editor.messageOrder} allItemsMap={editor.allItemsMap} />
          </div>
        </div>
      </div>
    </>
  )
}
