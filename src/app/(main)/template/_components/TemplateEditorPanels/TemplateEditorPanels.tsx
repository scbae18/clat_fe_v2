'use client'

import TemplateName from '../TemplateName/TemplateName'
import ContentSection from '../ContentSection/ContentSection'
import MessageSettings from '../MessageSettings/MessageSettings'
import TemplatePreview from '../TemplatePreview/TemplatePreview'
import { leftSectionStyle, leftStackStyle, rightSectionStyle, sectionBoxStyle, stackDividerStyle, pageStyle } from '../../template-form.css'
import type useTemplateEditor from '@/hooks/useTemplateEditor'
import type { TemplateItem } from '../../_types/template'

const ATTENDANCE_DISPLAY: TemplateItem = {
  id: '__attendance__',
  label: '출결 *',
  isActive: true,
  isInMessage: true,
  sendToParent: true,
  sendToStudent: true,
  locked: true,
  category: 'individual',
  itemType: 'attendance',
}

type Editor = ReturnType<typeof useTemplateEditor>

export default function TemplateEditorPanels({
  editor,
  tour,
}: {
  editor: Editor
  tour?: boolean
}) {
  const individualItems = [ATTENDANCE_DISPLAY, ...editor.individualItems]

  return (
    <div className={pageStyle}>
      <div className={leftSectionStyle}>
        <div className={sectionBoxStyle}>
          <div className={leftStackStyle}>
            <TemplateName value={editor.templateName} onChange={editor.setTemplateName} />
            <ContentSection
              title="공통 내용"
              description="모든 학생에게 동일하게 전달할 내용이에요"
              tourId={tour ? 'common' : undefined}
              items={editor.commonItems}
              onToggle={editor.handleToggleCommonItem}
              onDelete={editor.handleDeleteCommonItem}
              onAddInline={editor.handleAddCommonItem}
              onUpdate={editor.handleUpdateCommonItem}
            />
            <ContentSection
              title="개별 내용"
              description="학생마다 다르게 전달할 내용이에요"
              tourId={tour ? 'individual' : undefined}
              items={individualItems}
              onToggle={(id) => {
                if (id !== '__attendance__') editor.handleToggleIndividualItem(id)
              }}
              onDelete={(id) => {
                if (id !== '__attendance__') editor.handleDeleteIndividualItem(id)
              }}
              onAdd={editor.handleAddIndividualItem}
            />
            <hr className={stackDividerStyle} />
            <MessageSettings
              density="compact"
              messageOrder={editor.messageOrder}
              allItemsMap={editor.allItemsMap}
              onToggle={editor.handleMessagePreviewToggle}
              onRecipientToggle={editor.handleRecipientToggle}
              onReorder={editor.handleMessageReorder}
            />
          </div>
        </div>
      </div>
      <div className={rightSectionStyle}>
        <div className={sectionBoxStyle}>
          <TemplatePreview
            commonItems={editor.commonItems}
            individualItems={individualItems}
            messageOrder={editor.messageOrder}
            allItemsMap={editor.allItemsMap}
          />
        </div>
      </div>
    </div>
  )
}
