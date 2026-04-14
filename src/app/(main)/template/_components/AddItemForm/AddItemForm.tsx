'use client'

import { useState } from 'react'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import NumberIcon from '@/assets/icons/icon-number.svg'
import TextIcon from '@/assets/icons/icon-text.svg'
import SelectIcon from '@/assets/icons/icon-select.svg'
import CheckIcon from '@/assets/icons/icon-check.svg'
import CloseIcon from '@/assets/icons/icon-close.svg'
import InfoIcon from '@/assets/icons/icon-info.svg'
import {
  formStyle,
  fieldStyle,
  labelStyle,
  typeGridStyle,
  typeCardRecipe,
  typeCardTitleStyle,
  typeCardDescStyle,
  tagInputContainerStyle,
  tagStyle,
  tagRemoveButtonStyle,
  tagInputStyle,
  completionInfoStyle,
  completionInfoTitleStyle,
  completionInfoListStyle,
  actionsStyle,
} from './AddItemForm.css'
import { colors } from '@/styles/tokens/colors'

type ItemTypeId = 'number' | 'text' | 'choice' | 'completion'

const ITEM_TYPES: Array<{ id: ItemTypeId; name: string; desc: string }> = [
  { id: 'number', name: '숫자형', desc: '예: 시험 점수' },
  { id: 'text', name: '텍스트형', desc: '예: 메모' },
  { id: 'choice', name: '선택형', desc: '원하는 선택지를 직접 추가해요' },
  { id: 'completion', name: '완료형', desc: '완료/미완료' },
]

interface AddItemFormProps {
  onAdd: (label: string, type: string, choices?: string[]) => void
  onCancel: () => void
}

export default function AddItemForm({ onAdd, onCancel }: AddItemFormProps) {
  const [label, setLabel] = useState('')
  const [selectedType, setSelectedType] = useState<ItemTypeId | null>(null)
  const [choices, setChoices] = useState<string[]>([])
  const [choiceInput, setChoiceInput] = useState('')

  const addChoice = (value: string) => {
    const trimmed = value.trim()
    if (trimmed) setChoices((prev) => [...prev, trimmed])
  }

  const handleChoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.endsWith(',')) {
      addChoice(value.slice(0, -1))
      setChoiceInput('')
    } else {
      setChoiceInput(value)
    }
  }

  const handleChoiceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault()
      addChoice(choiceInput)
      setChoiceInput('')
    }
  }

  const removeChoice = (index: number) => {
    setChoices((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAdd = () => {
    if (!label.trim() || !selectedType) return
    const finalChoices =
      selectedType === 'choice'
        ? [...choices, ...(choiceInput.trim() ? [choiceInput.trim()] : [])]
        : undefined
    onAdd(label.trim(), selectedType, finalChoices)
  }

  return (
    <div className={formStyle}>
      {/* 항목 이름 */}
      <div className={fieldStyle}>
        <span className={labelStyle}>항목 이름 <span style={{ color: '#EF4453' }}>*</span></span>
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="예) 금요일 과제"
        />
      </div>

      {/* 항목 타입 */}
      <div className={fieldStyle}>
        <span className={labelStyle}>항목 타입 <span style={{ color: '#EF4453' }}>*</span></span>
        <div className={typeGridStyle}>
          {ITEM_TYPES.map((type) => {
            const isSelected = selectedType === type.id
            return (
              <button
                key={type.id}
                className={typeCardRecipe({ selected: isSelected })}
                onClick={() => setSelectedType(type.id)}
              >
                <div className={typeCardTitleStyle}>
                  {type.id === 'number' && <NumberIcon width={16} height={16} />}
                  {type.id === 'text' && <TextIcon width={16} height={16} />}
                  {type.id === 'choice' && <SelectIcon width={16} height={16} />}
                  {type.id === 'completion' && <CheckIcon width={16} height={16} />}
                  {type.name}
                </div>
                <div className={typeCardDescStyle}>{type.desc}</div>
              </button>
            )
          })}
        </div>

        {/* 선택형: 선택지 태그 입력 */}
        {selectedType === 'choice' && (
          <div className={tagInputContainerStyle}>
            {choices.map((choice, i) => (
              <span key={i} className={tagStyle}>
                {choice}
                <button className={tagRemoveButtonStyle} onClick={() => removeChoice(i)}>
                  <CloseIcon width={12} height={12} />
                </button>
              </span>
            ))}
            <input
              className={tagInputStyle}
              value={choiceInput}
              onChange={handleChoiceChange}
              onKeyDown={handleChoiceKeyDown}
              placeholder="쉼표로 구분"
            />
          </div>
        )}

        {/* 완료형: 안내 문구 */}
        {selectedType === 'completion' && (
          <div className={completionInfoStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <InfoIcon width={16} height={16} style={{ color: colors.primary500 }} />
              <span className={completionInfoTitleStyle}>완료형은 이런 기능을 지원해요</span>
            </div>
            <ul className={completionInfoListStyle}>
              <li>미완료 학생 자동 분류</li>
              <li>학생 관리 탭에서 한눈에 확인</li>
            </ul>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className={actionsStyle}>
        <Button variant="ghost" size="sm" fullWidth onClick={onCancel}>
          취소
        </Button>
        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={handleAdd}
          disabled={!label.trim() || !selectedType}
        >
          추가
        </Button>
      </div>
    </div>
  )
}
