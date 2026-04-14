'use client'

import { useCallback, useEffect, useState } from 'react'
import Text from '@/components/common/Text'
import Button from '@/components/common/Button'
import CloseIcon from '@/assets/icons/icon-close.svg'
import { lessonService, type LessonPreviewRow } from '@/services/lesson'
import { useToastStore } from '@/stores/toastStore'
import * as styles from './AlimtalkSendModal.css'

function maskPhone(phone: string): string {
  const d = phone.replace(/\D/g, '')
  if (d.length < 10) return phone || '\u2014'
  const tail = d.slice(-4)
  return `${d.slice(0, 3)}-****-${tail}`
}

interface AlimtalkSendModalProps {
  isOpen: boolean
  onClose: () => void
  lessonId: number
}

export default function AlimtalkSendModal({ isOpen, onClose, lessonId }: AlimtalkSendModalProps) {
  const addToast = useToastStore((s) => s.addToast)
  const [rows, setRows] = useState<LessonPreviewRow[]>([])
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [focusId, setFocusId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const loadPreview = useCallback(async () => {
    setLoading(true)
    try {
      const res = await lessonService.previewLesson(lessonId)
      const list = res.data ?? []
      setRows(list)
      const ids = new Set(list.map((r) => r.student_id))
      setSelected(ids)
      setFocusId(list[0]?.student_id ?? null)
    } catch {
      addToast({
        variant: 'error',
        message:
          '\uBBF8\uB9AC\uBCF4\uAE30\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694. \uC800\uC7A5 \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.',
      })
      setRows([])
      setSelected(new Set())
      setFocusId(null)
    } finally {
      setLoading(false)
    }
  }, [lessonId, addToast])

  useEffect(() => {
    if (!isOpen) return
    void loadPreview()
  }, [isOpen, loadPreview])

  if (!isOpen && !isClosing) return null

  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.student_id))

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set())
      setFocusId(null)
    } else {
      setSelected(new Set(rows.map((r) => r.student_id)))
      setFocusId(rows[0]?.student_id ?? null)
    }
  }

  const toggleOne = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const focused = rows.find((r) => r.student_id === focusId)

  const handleClose = () => setIsClosing(true)

  const handleAnimationEnd = () => {
    if (isClosing) {
      setIsClosing(false)
      onClose()
    }
  }

  const handleSend = async () => {
    const ids = Array.from(selected)
    if (ids.length === 0) {
      addToast({
        variant: 'warning',
        message:
          '\uBCF4\uB0BC \uD559\uC0DD\uC744 \uD55C \uBA85 \uC774\uC0C1 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.',
      })
      return
    }
    setSending(true)
    try {
      const result = await lessonService.sendLesson(lessonId, ids)
      const mode = result.delivery_mode === 'mock' ? '\uBAA8\uC758 \uC804\uC1A1' : '\uC2E4\uC81C \uBC1C\uC1A1'
      addToast({
        variant: 'success',
        message: `\uBCF4\uB0C8\uC5B4\uC694. (${mode} \u00B7 \uC131\uACF5 ${result.success_count}\uAC74 / \uC2E4\uD328 ${result.fail_count}\uAC74)`,
      })
      setIsClosing(true)
    } catch {
      addToast({
        variant: 'error',
        message: '\uC54C\uB9BC\uD1A1 \uBC1C\uC1A1\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694.',
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={styles.backdrop} onClick={handleClose}>
      <div
        className={`${styles.drawer}${isClosing ? ` ${styles.drawerClosing}` : ''}`}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className={styles.header}>
          <Text variant="headingMd" as="h2">
            {'\uC54C\uB9BC\uD1A1 \uBCF4\uB0B4\uAE30'}
          </Text>
          <button
            type="button"
            onClick={handleClose}
            className={styles.closeButton}
            aria-label={'\uB2EB\uAE30'}
          >
            <CloseIcon width={24} height={24} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.leftCol}>
            <div style={{ padding: '16px 16px 8px' }}>
              <Text variant="titleMd">{'\uBCF4\uB0BC \uD559\uC0DD'}</Text>
              <div style={{ marginTop: '4px' }}>
                <Text variant="bodyMd" color="gray500">
                  {
                    '\uCCB4\uD06C\uD55C \uD559\uC0DD\uC5D0\uAC8C \uD559\uC0DD\u00B7\uD559\uBD80\uBAA8 \uBC88\uD638\uB85C \uBC1C\uC1A1\uD574\uC694'
                  }
                </Text>
              </div>
            </div>
            <label className={styles.selectAllRow}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={allSelected}
                onChange={toggleAll}
                disabled={loading || rows.length === 0}
              />
              <Text variant="titleSm">{'\uC804\uCCB4 \uC120\uD0DD'}</Text>
            </label>
            <div className={styles.studentList}>
              {loading && (
                <div style={{ padding: '24px 16px' }}>
                  <Text variant="bodyMd" color="gray500">
                    {'\uBD88\uB7EC\uC624\uB294 \uC911\u2026'}
                  </Text>
                </div>
              )}
              {!loading && rows.length === 0 && (
                <div style={{ padding: '24px 16px' }}>
                  <Text variant="bodyMd" color="gray500">
                    {
                      '\uBBF8\uB9AC\uBCF4\uAE30\uD560 \uD559\uC0DD\uC774 \uC5C6\uC5B4\uC694. \uC218\uC5C5\uC744 \uC800\uC7A5\uD588\uB294\uC9C0 \uD655\uC778\uD574 \uC8FC\uC138\uC694.'
                    }
                  </Text>
                </div>
              )}
              {!loading &&
                rows.map((r) => {
                  const checked = selected.has(r.student_id)
                  const isFocus = focusId === r.student_id
                  return (
                    <div
                      key={r.student_id}
                      role="button"
                      tabIndex={0}
                      className={`${styles.studentRow}${isFocus ? ` ${styles.studentRowFocused}` : ''}`}
                      onClick={() => setFocusId(r.student_id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setFocusId(r.student_id)
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={checked}
                        onChange={() => toggleOne(r.student_id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className={styles.studentMeta}>
                        <Text variant="titleSm">{r.student_name}</Text>
                        <div className={styles.phoneMuted}>
                          {'\uD559\uC0DD'} {maskPhone(r.phone)}
                          {r.parent_phone?.trim()
                            ? ` \u00B7 \uD559\uBD80\uBAA8 ${maskPhone(r.parent_phone)}`
                            : ' \u00B7 \uD559\uBD80\uBAA8 \uBC88\uD638 \uC5C6\uC74C'}
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>

          <div className={styles.rightCol}>
            <Text variant="titleMd">{'\uBA54\uC2DC\uC9C0 \uBBF8\uB9AC\uBCF4\uAE30'}</Text>
            {focused ? (
              <>
                <div>
                  <div className={styles.previewSectionLabel}>{'\uD559\uC0DD\uC6A9'}</div>
                  <div className={styles.previewBox}>{focused.message || '\u2014'}</div>
                </div>
                <div>
                  <div className={styles.previewSectionLabel}>{'\uD559\uBD80\uBAA8\uC6A9'}</div>
                  <div className={styles.previewBox}>
                    {focused.parent_phone?.trim()
                      ? focused.message_for_parent || '\u2014'
                      : '\uD559\uBD80\uBAA8 \uC5F0\uB77D\uCC98\uAC00 \uC5C6\uC5B4 \uC774 \uCC44\uB110\uB85C\uB294 \uBC1C\uC1A1\uB418\uC9C0 \uC54A\uC544\uC694.'}
                  </div>
                </div>
              </>
            ) : (
              <Text variant="bodyMd" color="gray500">
                {
                  '\uC67C\uCABD\uC5D0\uC11C \uD559\uC0DD\uC744 \uC120\uD0DD\uD558\uBA74 \uBBF8\uB9AC\uBCF4\uAE30\uAC00 \uD45C\uC2DC\uB3FC\uC694.'
                }
              </Text>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <Button variant="ghost" size="md" onClick={handleClose} disabled={sending}>
            {'\uCDE8\uC18C'}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => void handleSend()}
            disabled={sending || loading || selected.size === 0}
          >
            {sending
              ? '\uBCF4\uB0B4\uB294 \uC911\u2026'
              : `${selected.size}\uBA85\uC5D0\uAC8C \uC54C\uB9BC\uD1A1 \uBCF4\uB0B4\uAE30`}
          </Button>
        </div>
      </div>
    </div>
  )
}
