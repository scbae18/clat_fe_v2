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
  dragHandleStyle,
  dragDotRowStyle,
  dragDotStyle,
  rowLabelStyle,
  itemTypeBadgeStyle,
} from './MessageSettings.css'

const ITEM_TYPE_LABELS: Record<string, string> = {
  number: '숫자형',
  text: '텍스트형',
  choice: '선택형',
  completion: '완료형',
  inline: '텍스트형',
}

interface MessageSettingsProps {
  messageOrder: string[]
  allItemsMap: Map<string, TemplateItem>
  onToggle: (id: string) => void
  onReorder: (newOrder: string[]) => void
}

interface SortableRowProps {
  item: TemplateItem
  onToggle: (id: string) => void
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

function SortableRow({ item, onToggle }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${rowStyle}${isDragging ? ` ${rowDraggingStyle}` : ''}`}
    >
      <span {...attributes} {...listeners}>
        <DragHandle />
      </span>
      <Chip
        label={item.category === 'common' ? '공통' : '개별'}
        variant={item.category === 'common' ? 'active' : 'default'}
      />
      <span className={rowLabelStyle}>{item.label.replace(' *', '')}</span>
      <span className={itemTypeBadgeStyle}>{ITEM_TYPE_LABELS[item.itemType] ?? ''}</span>
      <Toggle
        checked={item.isInMessage}
        onChange={() => onToggle(item.id)}
        disabled={item.itemType === 'attendance'}
      />
    </div>
  )
}

export default function MessageSettings({
  messageOrder,
  allItemsMap,
  onToggle,
  onReorder,
}: MessageSettingsProps) {
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
      <div className={sectionHeaderStyle}>
        <Text variant="headingMd">문자 설정</Text>
        <Text variant="bodyMd" color="gray500">
          순서를 바꾸거나 항목을 켜고 끌 수 있어요
        </Text>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={activeOrder} strategy={verticalListSortingStrategy}>
          <div className={rowListStyle}>
            {activeOrder.map((id) => {
              const item = allItemsMap.get(id)
              if (!item) return null
              return <SortableRow key={id} item={item} onToggle={onToggle} />
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
