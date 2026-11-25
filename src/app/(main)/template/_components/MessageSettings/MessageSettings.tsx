'use client'

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Text from '@/components/common/Text'
import Chip from '@/components/common/Chip'
import Toggle from '@/components/common/Toggle'
import type { TemplateItem } from '../../_types/template'
import {
  sectionHeaderStyle,
  rowListStyle,
  rowStyle,
  rowDraggingStyle,
  compactRowStyle,
  compactHeaderStyle,
  categoryMarkStyle,
  categoryDividerStyle,
  dragHandleStyle,
  dragDotRowStyle,
  dragDotStyle,
  rowLabelStyle,
  itemTypeBadgeStyle,
  recipientGroupStyle,
  recipientButtonStyle,
} from './MessageSettings.css'

const ITEM_TYPE_LABELS: Record<string, string> = {
  number: '점수형',
  text: '텍스트형',
  choice: '선택형',
  completion: '완료형',
  inline: '텍스트형',
}

type RecipientChannel = 'parent' | 'student'

interface MessageSettingsProps {
  messageOrder: string[]
  allItemsMap: Map<string, TemplateItem>
  onToggle: (id: string) => void
  onReorder: (newOrder: string[]) => void
  onRecipientToggle?: (id: string, channel: RecipientChannel) => void
  /** 수업 화면 등: 토글은 표시만 하고 순서만 변경 */
  toggleDisabled?: boolean
  /** 템플릿 설정: 유형 뱃지 없이 한 줄로 표시 */
  density?: 'default' | 'compact'
}

interface SortableRowProps {
  item: TemplateItem
  onToggle: (id: string) => void
  onRecipientToggle?: (id: string, channel: RecipientChannel) => void
  toggleDisabled?: boolean
  compact?: boolean
}

function DragHandle() {
  return (
    <span className={dragHandleStyle}>
      <span className={dragDotRowStyle}>
        <span className={dragDotStyle} />
        <span className={dragDotStyle} />
      </span>
      <span className={dragDotRowStyle}>
        <span className={dragDotStyle} />
        <span className={dragDotStyle} />
      </span>
      <span className={dragDotRowStyle}>
        <span className={dragDotStyle} />
        <span className={dragDotStyle} />
      </span>
    </span>
  )
}

function RecipientToggleButton({
  label,
  ariaLabel,
  pressed,
  disabled,
  onChange,
}: {
  label: string
  ariaLabel: string
  pressed: boolean
  disabled?: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={ariaLabel}
      disabled={disabled}
      data-pressed={pressed}
      className={recipientButtonStyle}
      onClick={disabled ? undefined : onChange}
    >
      {label}
    </button>
  )
}

function SortableRow({ item, onToggle, onRecipientToggle, toggleDisabled, compact }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const recipientDisabled = toggleDisabled || !item.isInMessage
  const attendanceLocked = item.itemType === 'attendance'
  const showRecipients = compact || !attendanceLocked

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${rowStyle}${compact ? ` ${compactRowStyle}` : ''}${isDragging ? ` ${rowDraggingStyle}` : ''}`}
    >
      <span {...attributes} {...listeners}>
        <DragHandle />
      </span>
      {compact ? (
        <span className={categoryMarkStyle}>
          {item.category === 'common' ? '공통' : '개별'}
          <span className={categoryDividerStyle}>|</span>
        </span>
      ) : (
        <Chip
          label={item.category === 'common' ? '공통' : '개별'}
          variant={item.category === 'common' ? 'active' : 'default'}
        />
      )}
      <span className={rowLabelStyle}>{item.label.replace(' *', '')}</span>
      {compact ? null : (
        <span className={itemTypeBadgeStyle}>{ITEM_TYPE_LABELS[item.itemType] ?? ''}</span>
      )}
      {showRecipients ? (
        <div className={recipientGroupStyle}>
          <RecipientToggleButton
            label={compact ? '학부모' : '학부모에게 전송'}
            ariaLabel="학부모에게 전송"
            pressed={item.sendToParent}
            disabled={recipientDisabled || attendanceLocked}
            onChange={() => onRecipientToggle?.(item.id, 'parent')}
          />
          <RecipientToggleButton
            label={compact ? '학생' : '학생에게 전송'}
            ariaLabel="학생에게 전송"
            pressed={item.sendToStudent}
            disabled={recipientDisabled || attendanceLocked}
            onChange={() => onRecipientToggle?.(item.id, 'student')}
          />
        </div>
      ) : null}
      <Toggle
        checked={item.isInMessage}
        onChange={() => onToggle(item.id)}
        disabled={toggleDisabled || item.itemType === 'attendance' || item.locked}
      />
    </div>
  )
}

export default function MessageSettings({
  messageOrder,
  allItemsMap,
  onToggle,
  onReorder,
  onRecipientToggle,
  toggleDisabled,
  density = 'default',
}: MessageSettingsProps) {
  const compact = density === 'compact'
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const activeOrder = messageOrder.filter((id) => allItemsMap.get(id)?.isActive)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = messageOrder.indexOf(String(active.id))
    const newIndex = messageOrder.indexOf(String(over.id))
    onReorder(arrayMove(messageOrder, oldIndex, newIndex))
  }

  return (
    <div>
      <div className={compact ? compactHeaderStyle : sectionHeaderStyle}>
        <Text variant="headingMd">문자 설정</Text>
        <Text variant="bodyMd" color="gray500">
          {compact
            ? '알림톡에 넣을 항목을 켜고, 끌어서 순서를 바꾸세요'
            : '순서를 바꾸거나 항목을 켜고 끌 수 있어요'}
        </Text>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={activeOrder} strategy={verticalListSortingStrategy}>
          <div className={rowListStyle}>
            {activeOrder.map((id) => {
              const item = allItemsMap.get(id)
              if (!item) return null
              return (
                <SortableRow
                  key={id}
                  item={item}
                  onToggle={onToggle}
                  onRecipientToggle={onRecipientToggle}
                  toggleDisabled={toggleDisabled}
                  compact={compact}
                />
              )
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
