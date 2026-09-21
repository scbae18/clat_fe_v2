'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Text from '@/components/common/Text'
import Button from '@/components/common/Button'
import Chip from '@/components/common/Chip'
import CloseIcon from '@/assets/icons/icon-close.svg'
import ConfirmModal from '@/components/common/ConfirmModal'
import LessonMessageOrderModal from '../LessonMessageOrderModal/LessonMessageOrderModal'
import ParentDashboardPreviewPanel from './ParentDashboardPreviewPanel'
import AlimtalkMessagePreview from './AlimtalkMessagePreview'
import useDisclosure from '@/hooks/useDisclosure'
import type { LessonItemDetail } from '@/services/lesson'
import type { LessonStudent } from '@/types/lessonStudent'
import { isAxiosError } from '@/lib/api/http'
import {
  lessonService,
  type LessonPreviewRow,
  type LessonSendChannel,
  type ParentPreviewResult,
  type ParentPreviewStatusItem,
} from '@/services/lesson'
import { useQueryClient } from '@tanstack/react-query'
import { invalidateLessonLists } from '@/lib/queryKeys'
import { useToastStore } from '@/stores/toastStore'
import { useUserStore } from '@/stores/userStore'
import { fillLessonAlimtalkFrameHeader } from '@/lib/lessonAlimtalkFrame'
import * as styles from './AlimtalkSendModal.css'

function maskPhone(phone: string): string {
  const d = phone.replace(/\D/g, '')
  if (d.length < 10) return phone || '\u2014'
  const tail = d.slice(-4)
  return `${d.slice(0, 3)}-****-${tail}`
}

function hasPhone(value: string | null | undefined) {
  return Boolean(value && String(value).replace(/\D/g, '').length >= 8)
}

function resolveSendChannel(
  sendToParent: boolean,
  sendToStudent: boolean,
): LessonSendChannel | null {
  if (sendToParent && sendToStudent) return 'BOTH'
  if (sendToParent) return 'PARENT'
  if (sendToStudent) return 'STUDENT'
  return null
}

function isRowSelectable(
  row: LessonPreviewRow,
  sendToParent: boolean,
  sendToStudent: boolean,
) {
  if (sendToParent && hasPhone(row.parent_phone)) return true
  if (sendToStudent && hasPhone(row.phone)) return true
  return false
}

function channelAudienceLabel(sendToParent: boolean, sendToStudent: boolean) {
  if (sendToParent && sendToStudent) return '학생·학부모 번호'
  if (sendToParent) return '학부모 번호'
  if (sendToStudent) return '학생 번호'
  return '수신 대상'
}

function aiChip(item?: Pick<ParentPreviewStatusItem, 'status' | 'stale'>) {
  if (!item) return { variant: 'inProgress' as const, label: '대기' }
  if (item.stale) return { variant: 'inProgress' as const, label: '다시 만들기' }
  if (item.status === 'ready') return { variant: 'done' as const, label: '완료' }
  if (item.status === 'failed') return { variant: 'ended' as const, label: '실패' }
  return { variant: 'inProgress' as const, label: '작성 중' }
}

function isAiReady(item?: Pick<ParentPreviewStatusItem, 'status' | 'stale'>) {
  return Boolean(item && item.status === 'ready' && !item.stale)
}

interface AlimtalkSendModalProps {
  isOpen: boolean
  onClose: () => void
  lessonId: number
  lesson: {
    class_name: string
    academy_name?: string
    lesson_date: string
    items: LessonItemDetail[]
  }
  commonValues: Record<string, string>
  students: LessonStudent[]
  onSaveMessageOrder: (
    items: Array<{ source: 'template' | 'adhoc'; id: number }>,
  ) => Promise<void>
}

export default function AlimtalkSendModal({
  isOpen,
  onClose,
  lessonId,
  lesson,
  commonValues,
  students,
  onSaveMessageOrder,
}: AlimtalkSendModalProps) {
  const queryClient = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)
  const teacherName = useUserStore((s) => s.user?.name) ?? '강사명'
  const messageOrderModal = useDisclosure()
  const [rows, setRows] = useState<LessonPreviewRow[]>([])
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [focusId, setFocusId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [sendToParent, setSendToParent] = useState(true)
  const [sendToStudent, setSendToStudent] = useState(true)
  const [previewTab, setPreviewTab] = useState<'message' | 'dashboard'>('message')
  const [aiStatusById, setAiStatusById] = useState<Record<number, ParentPreviewStatusItem>>({})
  const [dashboardPreview, setDashboardPreview] = useState<ParentPreviewResult | null>(null)
  const [dashboardLoading, setDashboardLoading] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
    setSelected((prev) => {
      const next = new Set<number>()
      for (const id of prev) {
        const row = rows.find((r) => r.student_id === id)
        if (row && isRowSelectable(row, sendToParent, sendToStudent)) next.add(id)
      }
      return next
    })
  }, [rows, sendToParent, sendToStudent])

  useEffect(() => {
    if (!isOpen) return
    setSendToParent(true)
    setSendToStudent(true)
    setPreviewTab('message')
    setAiStatusById({})
    setDashboardPreview(null)
    void loadPreview()
  }, [isOpen, loadPreview])

  const selectedKey = Array.from(selected).sort((a, b) => a - b).join(',')

  useEffect(() => {
    if (!isOpen || selected.size === 0) return
    const ids = Array.from(selected)
    void lessonService.enqueueParentPreview(lessonId, ids).catch(() => {
      addToast({
        variant: 'error',
        message: '학부모 피드백 미리보기를 시작하지 못했어요.',
      })
    })
  }, [isOpen, lessonId, selectedKey, addToast, selected.size])

  useEffect(() => {
    if (!isOpen || selected.size === 0) return
    const ids = Array.from(selected)
    let cancelled = false

    const tick = async () => {
      try {
        const res = await lessonService.getParentPreviewStatus(lessonId, ids)
        if (cancelled) return
        const next: Record<number, ParentPreviewStatusItem> = {}
        for (const item of res.items) next[item.student_id] = item
        setAiStatusById(next)
      } catch {
        /* 폴링 실패는 다음 주기에 재시도 */
      }
    }

    void tick()
    const timer = window.setInterval(() => {
      void tick()
    }, 3000)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [isOpen, lessonId, selectedKey, selected.size])

  useEffect(() => {
    if (!isOpen || previewTab !== 'dashboard' || focusId == null) return
    let cancelled = false
    setDashboardLoading(true)
    lessonService
      .getParentPreview(lessonId, focusId)
      .then((res) => {
        if (!cancelled) setDashboardPreview(res)
      })
      .catch(() => {
        if (!cancelled) setDashboardPreview(null)
      })
      .finally(() => {
        if (!cancelled) setDashboardLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [
    isOpen,
    previewTab,
    focusId,
    lessonId,
    aiStatusById[focusId ?? -1]?.status,
    aiStatusById[focusId ?? -1]?.stale,
  ])

  if (!mounted || (!isOpen && !isClosing)) return null

  const sendChannel = resolveSendChannel(sendToParent, sendToStudent)
  const selectableRows = rows.filter((r) =>
    isRowSelectable(r, sendToParent, sendToStudent),
  )
  const allSelected =
    selectableRows.length > 0 &&
    selectableRows.every((r) => selected.has(r.student_id))
  const selectedAiReadyCount = Array.from(selected).filter((id) =>
    isAiReady(aiStatusById[id]),
  ).length
  const selectedAiReady = selected.size > 0 && selectedAiReadyCount === selected.size

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set())
      setFocusId(null)
    } else {
      setSelected(new Set(selectableRows.map((r) => r.student_id)))
      setFocusId(selectableRows[0]?.student_id ?? null)
    }
  }

  const toggleOne = (id: number) => {
    const row = rows.find((r) => r.student_id === id)
    if (!row || !isRowSelectable(row, sendToParent, sendToStudent)) return
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const focused = rows.find((r) => r.student_id === focusId)
  const frameHeader = focused
    ? fillLessonAlimtalkFrameHeader({
        academyName: lesson.academy_name?.trim() || '학원명',
        teacherName,
        studentName: focused.student_name,
        lessonDate: lesson.lesson_date,
      })
    : ''

  const handleClose = () => {
    if (sending) return
    setIsClosing(true)
  }

  const handleAnimationEnd = () => {
    if (isClosing) {
      setIsClosing(false)
      onClose()
    }
  }

  const requestSend = () => {
    if (!sendChannel) {
      addToast({
        variant: 'warning',
        message: '학부모 또는 학생 중 받을 대상을 골라 주세요.',
      })
      return
    }
    if (selected.size === 0) {
      addToast({
        variant: 'warning',
        message:
          '\uBCF4\uB0BC \uD559\uC0DD\uC744 \uD55C \uBA85 \uC774\uC0C1 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.',
      })
      return
    }
    const notReady = Array.from(selected).some((id) => !isAiReady(aiStatusById[id]))
    if (notReady) {
      addToast({
        variant: 'warning',
        message: '선택한 학생의 학부모 피드백이 모두 완료된 뒤에 보낼 수 있어요.',
      })
      setPreviewTab('dashboard')
      return
    }
    setConfirmOpen(true)
  }

  const handleRegenerate = async () => {
    if (focusId == null) return
    setRegenerating(true)
    try {
      await lessonService.enqueueParentPreview(lessonId, [focusId], true)
      setAiStatusById((prev) => ({
        ...prev,
        [focusId]: {
          student_id: focusId,
          status: 'pending',
          stale: false,
        },
      }))
    } catch {
      addToast({
        variant: 'error',
        message: '피드백을 다시 만들지 못했어요.',
      })
    } finally {
      setRegenerating(false)
    }
  }

  const handleSend = async () => {
    setConfirmOpen(false)
    const ids = Array.from(selected)
    if (ids.length === 0 || !sendChannel) return
    setSending(true)
    try {
      const result = await lessonService.sendLesson(lessonId, ids, sendChannel)
      const mode = result.delivery_mode === 'mock' ? '\uBAA8\uC758 \uC804\uC1A1' : '\uC2E4\uC81C \uBC1C\uC1A1'
      addToast({
        variant: 'success',
        message: `\uBCF4\uB0C8\uC5B4\uC694. (${mode} \u00B7 \uC131\uACF5 ${result.success_count}\uAC74 / \uC2E4\uD328 ${result.fail_count}\uAC74)`,
      })
      if (result.success_count > 0) {
        invalidateLessonLists(queryClient)
      }
      setIsClosing(true)
    } catch (err) {
      const apiMessage = isAxiosError(err)
        ? (err.response?.data as { error?: { message?: string } } | undefined)?.error
            ?.message
        : undefined
      const isTimeout =
        isAxiosError(err) && (err.code === 'ECONNABORTED' || err.message.includes('timeout'))
      addToast({
        variant: 'error',
        message:
          apiMessage ??
          (isTimeout
            ? '\uC54C\uB9BC\uD1A1 \uBC1C\uC1A1\uC774 \uC2DC\uAC04 \uCD08\uACFC\uB418\uC5C8\uC5B4\uC694. \uC7A0\uC2DC \uD6C4 \uBC1C\uC1A1 \uB0B4\uC5ED\uC5D0\uC11C \uACB0\uACFC\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.'
            : '\uC54C\uB9BC\uD1A1 \uBC1C\uC1A1\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694.'),
      })
    } finally {
      setSending(false)
    }
  }

  return createPortal(
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
          <div className={styles.headerActions}>
            <Button
              variant="secondary"
              size="sm"
              onClick={messageOrderModal.open}
              disabled={sending}
            >
              {'\uBB38\uC790 \uC21C\uC11C'}
            </Button>
            <button
              type="button"
              onClick={handleClose}
              className={styles.closeButton}
              aria-label={'\uB2EB\uAE30'}
              disabled={sending}
            >
              <CloseIcon width={24} height={24} />
            </button>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.leftCol}>
            <div className={styles.leftHeader}>
              <Text variant="titleMd">{'\uBCF4\uB0BC \uD559\uC0DD'}</Text>
              <div className={styles.leftHint}>
                <Text variant="bodyMd" color="gray500">
                  {`체크한 학생에게 ${channelAudienceLabel(sendToParent, sendToStudent)}로 발송해요`}
                </Text>
              </div>
            </div>
            <div className={styles.channelBlock}>
              <Text variant="titleSm" color="gray700">
                수신 대상
              </Text>
              <div className={styles.channelRow} role="group" aria-label="수신 대상">
                <button
                  type="button"
                  className={`${styles.channelCheck}${sendToParent ? ` ${styles.channelCheckActive}` : ''}`}
                  aria-pressed={sendToParent}
                  onClick={() => setSendToParent((v) => !v)}
                  disabled={sending}
                >
                  학부모에게 보내기
                </button>
                <button
                  type="button"
                  className={`${styles.channelCheck}${sendToStudent ? ` ${styles.channelCheckActive}` : ''}`}
                  aria-pressed={sendToStudent}
                  onClick={() => setSendToStudent((v) => !v)}
                  disabled={sending}
                >
                  학생에게 보내기
                </button>
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
                <div className={styles.listMessage}>
                  <Text variant="bodyMd" color="gray500">
                    {'\uBD88\uB7EC\uC624\uB294 \uC911\u2026'}
                  </Text>
                </div>
              )}
              {!loading && rows.length === 0 && (
                <div className={styles.listMessage}>
                  <Text variant="bodyMd" color="gray500">
                    {
                      '\uBBF8\uB9AC\uBCF4\uAE30\uD560 \uD559\uC0DD\uC774 \uC5C6\uC5B4\uC694. \uC218\uC5C5\uC744 \uC800\uC7A5\uD588\uB294\uC9C0 \uD655\uC778\uD574 \uC8FC\uC138\uC694.'
                    }
                  </Text>
                </div>
              )}
              {!loading &&
                rows.map((r) => {
                  const selectable = isRowSelectable(r, sendToParent, sendToStudent)
                  const checked = selected.has(r.student_id)
                  const isFocus = focusId === r.student_id
                  return (
                    <div
                      key={r.student_id}
                      role="button"
                      tabIndex={0}
                      className={`${styles.studentRow}${isFocus ? ` ${styles.studentRowFocused}` : ''}${
                        selectable ? '' : ` ${styles.studentRowDisabled}`
                      }`}
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
                        disabled={!selectable}
                        onChange={() => toggleOne(r.student_id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className={styles.studentMeta}>
                        <div className={styles.studentNameRow}>
                          <div className={styles.studentName} title={r.student_name}>
                            {r.student_name}
                          </div>
                          <Chip {...aiChip(aiStatusById[r.student_id])} />
                        </div>
                        <div
                          className={styles.phoneMuted}
                          title={`학생 ${maskPhone(r.phone)}${
                            r.parent_phone?.trim()
                              ? ` · 학부모 ${maskPhone(r.parent_phone)}`
                              : ' · 학부모 번호 없음'
                          }`}
                        >
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
            <div className={styles.tabRow} role="tablist" aria-label="미리보기">
              <button
                type="button"
                role="tab"
                aria-selected={previewTab === 'message'}
                className={`${styles.tabButton}${previewTab === 'message' ? ` ${styles.tabButtonActive}` : ''}`}
                onClick={() => setPreviewTab('message')}
              >
                <Text variant="headingSm" color={previewTab === 'message' ? 'gray900' : 'gray500'}>
                  문자
                </Text>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={previewTab === 'dashboard'}
                className={`${styles.tabButton}${previewTab === 'dashboard' ? ` ${styles.tabButtonActive}` : ''}`}
                onClick={() => setPreviewTab('dashboard')}
              >
                <Text variant="headingSm" color={previewTab === 'dashboard' ? 'gray900' : 'gray500'}>
                  대시보드
                </Text>
              </button>
            </div>
            {previewTab === 'dashboard' ? (
              focused ? (
                <ParentDashboardPreviewPanel
                  preview={dashboardPreview}
                  loading={dashboardLoading}
                  regenerating={regenerating}
                  onRegenerate={() => void handleRegenerate()}
                />
              ) : (
                <Text variant="bodyMd" color="gray500">
                  왼쪽에서 학생을 선택하면 학부모가 볼 화면이 나와요.
                </Text>
              )
            ) : (
              <AlimtalkMessagePreview
                focused={focused}
                frameHeader={frameHeader}
                sendToParent={sendToParent}
                sendToStudent={sendToStudent}
              />
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.footerHint}>
            <Text variant="bodyMd" color="gray500">
              {selected.size === 0
                ? '보낼 학생을 선택해 주세요.'
                : selectedAiReady
                  ? `AI 피드백 ${selectedAiReadyCount}/${selected.size}명 완료. 보내도 좋아요.`
                  : `AI 피드백 ${selectedAiReadyCount}/${selected.size}명 완료. 모두 끝나면 보낼 수 있어요.`}
            </Text>
          </div>
          <Button variant="ghost" size="md" onClick={handleClose} disabled={sending}>
            {'\uCDE8\uC18C'}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={requestSend}
            disabled={
              sending ||
              loading ||
              selected.size === 0 ||
              !sendChannel ||
              !selectedAiReady
            }
          >
            {sending
              ? '\uBCF4\uB0B4\uB294 \uC911\u2026'
              : selectedAiReady
                ? `${selected.size}명에게 알림톡 보내기`
                : 'AI 완료 후 보내기'}
          </Button>
        </div>

        {sending && (
          <div className={styles.sendingOverlay} role="status" aria-live="polite">
            <div className={styles.sendingModal}>
              <Text variant="titleMd">{'\uBCF4\uB0B4\uB294 \uC911\u2026'}</Text>
              <div className={styles.loadingDots} aria-hidden>
                <span className={styles.loadingDot} />
                <span className={`${styles.loadingDot} ${styles.loadingDotDelay1}`} />
                <span className={`${styles.loadingDot} ${styles.loadingDotDelay2}`} />
              </div>
              <Text variant="bodyMd" color="gray500">
                {'\uC54C\uB9BC\uD1A1\uC744 \uBC1C\uC1A1\uD558\uACE0 \uC788\uC5B4\uC694. \uC7A0\uC2DC\uB9CC \uAE30\uB2E4\uB824 \uC8FC\uC138\uC694.'}
              </Text>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => void handleSend()}
        title={'\uC54C\uB9BC\uD1A1\uC744 \uBCF4\uB0B4\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?'}
        descriptions={[
          `${selected.size}명의 ${channelAudienceLabel(sendToParent, sendToStudent)}로 알림톡이 발송됩니다.`,
          '미리 만든 학부모 피드백이 대시보드에 바로 보여요.',
        ]}
        confirmLabel={'\uBC1C\uC1A1'}
        cancelLabel={'\uCDE8\uC18C'}
      />

      <LessonMessageOrderModal
        isOpen={messageOrderModal.isOpen}
        onClose={messageOrderModal.close}
        lesson={lesson}
        commonValues={commonValues}
        students={students}
        onSave={async (items) => {
          await onSaveMessageOrder(items)
          await loadPreview()
        }}
      />
    </div>,
    document.body,
  )
}
