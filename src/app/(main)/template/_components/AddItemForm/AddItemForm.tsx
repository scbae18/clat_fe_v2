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
  { id: 'number', name: '\uC810\uC218\uD615', desc: '\uC608: \uC2DC\uD5D8\u00B7\uCABD\uC9C0\uC2DC\uD5D8 \uB4F1' },
  { id: 'text', name: '\uD14D\uC2A4\uD2B8\uD615', desc: '\uC608: \uBA54\uBAA8' },
  { id: 'choice', name: '\uC120\uD0DD\uD615', desc: '\uC6D0\uD558\uB294 \uC120\uD0DD\uC9C0\uB97C \uC9C1\uC811 \uCD94\uAC00\uD574\uC694' },
  { id: 'completion', name: '\uC644\uB8CC\uD615', desc: '\uC644\uB8CC/\uBBF8\uC644\uB8CC' },
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
      <div className={fieldStyle}>
        <span className={labelStyle}>
          {'\uD56D\uBAA9 \uC774\uB984'} <span style={{ color: '#EF4453' }}>*</span>
        </span>
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={'\uC608) \uAE08\uC694\uC77C \uACFC\uC81C'}
        />
      </div>

      <div className={fieldStyle}>
        <span className={labelStyle}>
          {'\uD56D\uBAA9 \uD0C0\uC785'} <span style={{ color: '#EF4453' }}>*</span>
        </span>
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
              placeholder={'\uC27C\uD45C\uB85C \uAD6C\uBD84'}
            />
          </div>
        )}

        {selectedType === 'number' && (
          <div className={completionInfoStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <InfoIcon width={16} height={16} style={{ color: colors.primary500 }} />
              <span className={completionInfoTitleStyle}>
                {'\uC810\uC218\uD615\uC740 \uC774\uB7F0 \uAE30\uB2A5\uC744 \uC9C0\uC6D0\uD574\uC694'}
              </span>
            </div>
            <ul className={completionInfoListStyle}>
              <li>
                {
                  '\uC218\uC5C5 \uC785\uB825 \uD654\uBA74\uC5D0\uC11C \uBC18 \uD3C9\uADE0\u00B7\uCD5C\uACE0\uC810\uC744 \uC2E4\uC2DC\uAC04\uC73C\uB85C \uD655\uC778'
                }
              </li>
              <li>
                {
                  '\uD559\uC0DD \uB300\uC2DC\uBCF4\uB4DC \uB4F1\uC5D0\uC11C \uC810\uC218 \uCD94\uC774\uB85C \uD65C\uC6A9'
                }
              </li>
            </ul>
          </div>
        )}

        {selectedType === 'completion' && (
          <div className={completionInfoStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <InfoIcon width={16} height={16} style={{ color: colors.primary500 }} />
              <span className={completionInfoTitleStyle}>
                {'\uC644\uB8CC\uD615\uC740 \uC774\uB7F0 \uAE30\uB2A5\uC744 \uC9C0\uC6D0\uD574\uC694'}
              </span>
            </div>
            <ul className={completionInfoListStyle}>
              <li>{'\uBBF8\uC644\uB8CC \uD559\uC0DD \uC790\uB3D9 \uBD84\uB958'}</li>
              <li>{'\uD559\uC0DD \uAD00\uB9AC \uD0ED\uC5D0\uC11C \uD55C\uB208\uC5D0 \uD655\uC778'}</li>
            </ul>
          </div>
        )}
      </div>

      <div className={actionsStyle}>
        <Button variant="ghost" size="sm" fullWidth onClick={onCancel}>
          {'\uCDE8\uC18C'}
        </Button>
        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={handleAdd}
          disabled={!label.trim() || !selectedType}
        >
          {'\uCD94\uAC00'}
        </Button>
      </div>
    </div>
  )
}
