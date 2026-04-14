'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Modal from '@/components/common/Modal'
import Text from '@/components/common/Text'
import Button from '@/components/common/Button'
import Chip from '@/components/common/Chip'
import Dropdown from '@/components/common/Dropdown'
import ArrowRightIcon from '@/assets/icons/icon-chevron-right.svg'
import { templateService, type Template, type TemplateDetail } from '@/services/template'
import {
  modalContentStyle,
  actionsStyle,
  templateCompareStyle,
  templateColStyle,
  templateColTitleStyle,
  itemChipGroupStyle,
  chipGroupStyle,
  chipButtonRecipe,
  currentTemplateNameStyle,
} from './TemplateSelectModal.css'

interface TemplateSelectModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (templateId: number) => void | Promise<void>
  currentTemplateId?: number
  title?: string
  confirmLabel?: string
}

export default function TemplateSelectModal({
  isOpen,
  onClose,
  onConfirm,
  currentTemplateId,
  title = '템플릿 선택',
  confirmLabel = '확인',
}: TemplateSelectModalProps) {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [currentDetail, setCurrentDetail] = useState<TemplateDetail | null>(null)
  const [selectedDetail, setSelectedDetail] = useState<TemplateDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    templateService.getTemplates().then(setTemplates)
    if (currentTemplateId) {
      templateService.getTemplate(currentTemplateId).then(setCurrentDetail)
    }
  }, [isOpen, currentTemplateId])

  const handleSelect = async (value: string) => {
    const id = Number(value)
    setSelectedId(id)
    const detail = await templateService.getTemplate(id)
    setSelectedDetail(detail)
  }

  const handleConfirm = async () => {
    if (!selectedId) return
    setIsLoading(true)
    try {
      await onConfirm(selectedId)
    } finally {
      setIsLoading(false)
      setSelectedId(null)
      setSelectedDetail(null)
    }
  }

  const handleClose = () => {
    setSelectedId(null)
    setSelectedDetail(null)
    onClose()
  }

  const dropdownOptions = templates
    .filter((t) => t.id !== currentTemplateId)
    .map((t) => ({ label: t.name, value: String(t.id) }))

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size={currentTemplateId ? 'md' : 'sm'}>
      <div className={modalContentStyle}>
        <Text variant="headingMd">{title}</Text>

        {currentTemplateId ? (
          // 변경 모드 - 현재 vs 변경 후 비교
          <div className={templateCompareStyle}>
            <div className={templateColStyle}>
              <span className={templateColTitleStyle}>현재</span>
              {currentDetail ? (
                <>
                  <div className={currentTemplateNameStyle}>{currentDetail.name}</div>
                  <div className={itemChipGroupStyle}>
                    {currentDetail.items
                      .filter((item) => item.item_type !== 'ATTENDANCE')
                      .map((item) => (
                        <Chip
                          key={item.id}
                          label={item.name}
                          variant={item.is_common ? 'active' : 'default'}
                        />
                      ))}
                  </div>
                </>
              ) : (
                <Text variant="bodyMd" color="gray500">-</Text>
              )}
            </div>

            <ArrowRightIcon
              width={20}
              height={20}
              style={{ color: '#9492A9', flexShrink: 0, marginTop: '28px' }}
            />

            <div className={templateColStyle}>
              <span className={templateColTitleStyle}>변경 후</span>
              <Dropdown
                options={dropdownOptions}
                value={selectedId ? String(selectedId) : ''}
                onChange={handleSelect}
                placeholder="템플릿 선택"
                fullWidth
                noBorder
              />
              {selectedDetail && (
                <div className={itemChipGroupStyle}>
                  {selectedDetail.items
                    .filter((item) => item.item_type !== 'ATTENDANCE')
                    .map((item) => (
                      <Chip
                        key={item.id}
                        label={item.name}
                        variant={item.is_common ? 'active' : 'default'}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          // 최초 선택 모드 - 칩 목록
          <>
            {templates.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Text variant="bodyMd" color="gray500">등록된 템플릿이 없어요.</Text>
                <Text variant="bodyMd" color="gray500">템플릿을 먼저 만들어주세요.</Text>
              </div>
            ) : (
              <div className={chipGroupStyle}>
                {templates.map((t) => (
                  <button
                    key={t.id}
                    className={chipButtonRecipe({ selected: selectedId === t.id })}
                    onClick={() => handleSelect(String(t.id))}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            )}
            {selectedDetail && (
              <div className={itemChipGroupStyle}>
                {selectedDetail.items.map((item) => (
                  <Chip
                    key={item.id}
                    label={item.name}
                    variant={item.is_common ? 'active' : 'default'}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <div className={actionsStyle}>
          {templates.length === 0 && !currentTemplateId ? (
            <Button variant="primary" size="md" fullWidth onClick={() => router.push('/template/new')}>
              템플릿 만들러 가기
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="md" fullWidth onClick={handleClose}>
                취소
              </Button>
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={handleConfirm}
                disabled={!selectedId || isLoading}
              >
                {confirmLabel}
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}