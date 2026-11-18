'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import Button from '@/components/common/Button/Button'
import ConfirmModal from '@/components/common/ConfirmModal'
import Text from '@/components/common/Text/Text'
import { apiErrorMessage } from '@/lib/api/http'
import { invalidateLessonLists, queryKeys } from '@/lib/queryKeys'
import { lessonService } from '@/services/lesson'
import { alimtalkService } from '@/services/alimtalk'
import { useToastStore } from '@/stores/toastStore'
import { useQueryClient } from '@tanstack/react-query'
import {
  scheduleActionButtons,
  scheduleActionField,
  scheduleActionInput,
  scheduleActionPopover,
  scheduleActionStack,
  schedulePreview,
  schedulePreviewBody,
  schedulePreviewLine,
} from './Sidebar.css'

export interface ScheduleActionTarget {
  key: string
  scheduled_at: string
  badge: string
  title: string
  subtitle: string
  student_count: number
  kind: 'lesson' | 'broadcast'
  lesson_record_id?: number
  lesson_date?: string
  template_name?: string
  schedule_id?: number
  body?: string
}

function seoulDatetimeLocal(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''
  const hour = read('hour') === '24' ? '00' : read('hour')
  return `${read('year')}-${read('month')}-${read('day')}T${hour}:${read('minute')}`
}

function clockLabel(iso: string): string {
  const value = seoulDatetimeLocal(new Date(iso))
  const [, month, dayAndTime] = value.split('-')
  const [day, time] = dayAndTime.split('T')
  return `${Number(month)}월 ${Number(day)}일 ${time}`
}

type Props = {
  target: ScheduleActionTarget | null
  anchorEl: HTMLElement | null
  onClose: () => void
  onTimeSaved: (scheduledAt: string) => void
}

export default function ScheduleActionPopover({ target, anchorEl, onClose, onTimeSaved }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const confirmLockRef = useRef(false)
  const [mounted, setMounted] = useState(false)
  const setConfirmLock = useCallback((locked: boolean) => {
    confirmLockRef.current = locked
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useLayoutEffect(() => {
    const panel = panelRef.current
    if (!panel || !anchorEl || !target) return

    function place() {
      if (!panel || !anchorEl) return
      const rect = anchorEl.getBoundingClientRect()
      const height = panel.offsetHeight
      const gap = 10
      let top = rect.top
      if (top + height > window.innerHeight - 8) {
        top = Math.max(8, window.innerHeight - height - 8)
      }
      const arrow = Math.min(Math.max(rect.top + rect.height / 2 - top, 18), Math.max(18, height - 18))
      panel.style.setProperty('--schedule-popover-x', `${rect.right + gap}px`)
      panel.style.setProperty('--schedule-popover-y', `${top}px`)
      panel.style.setProperty('--schedule-popover-arrow', `${arrow}px`)
    }

    place()
    const observer = new ResizeObserver(() => place())
    observer.observe(panel)
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [anchorEl, target])

  useEffect(() => {
    if (!target) return
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape' || confirmLockRef.current) return
      onClose()
    }
    function onPointerDown(event: MouseEvent) {
      if (confirmLockRef.current) return
      const node = event.target
      if (!(node instanceof Node)) return
      if (panelRef.current?.contains(node)) return
      if (anchorEl?.contains(node)) return
      if (node instanceof Element && node.closest('[data-schedule-layer]')) return
      onClose()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [anchorEl, onClose, target])

  if (!mounted || !target || !anchorEl) return null

  return createPortal(
    <div
      ref={panelRef}
      className={scheduleActionPopover}
      role="dialog"
      data-schedule-layer=""
      aria-label={target.badge}
    >
      <ScheduleActionForm
        key={target.key}
        target={target}
        onClose={onClose}
        onTimeSaved={onTimeSaved}
        onConfirmLock={setConfirmLock}
      />
    </div>,
    document.body,
  )
}

function lessonDateLabel(lessonDate: string): string {
  const [, month, day] = lessonDate.split('-')
  return `${Number(month)}월 ${Number(day)}일`
}

function ScheduleContent({
  target,
  onOpenLesson,
}: {
  target: ScheduleActionTarget
  onOpenLesson: () => void
}) {
  if (target.kind === 'broadcast') {
    const body = target.body?.trim() ?? ''
    return (
      <div className={schedulePreview}>
        <p className={schedulePreviewBody}>{body || '안내사항이 없습니다.'}</p>
      </div>
    )
  }

  return (
    <div className={schedulePreview}>
      <p className={schedulePreviewLine}>{target.lesson_date ? lessonDateLabel(target.lesson_date) : target.subtitle}</p>
      <p className={schedulePreviewLine}>{target.title}</p>
      <p className={schedulePreviewLine}>{target.template_name || '템플릿 없음'}</p>
      <Button type="button" variant="outlined" size="sm" fullWidth onClick={onOpenLesson}>
        수업 입력으로 이동
      </Button>
    </div>
  )
}

function ScheduleActionForm({
  target,
  onClose,
  onTimeSaved,
  onConfirmLock,
}: {
  target: ScheduleActionTarget
  onClose: () => void
  onTimeSaved: (scheduledAt: string) => void
  onConfirmLock: (locked: boolean) => void
}) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const addToast = useToastStore((s) => s.addToast)
  const [timeValue, setTimeValue] = useState(() => seoulDatetimeLocal(new Date(target.scheduled_at)))
  const [busy, setBusy] = useState<'time' | 'send' | 'cancel' | null>(null)
  const [confirm, setConfirm] = useState<'send' | 'cancel' | null>(null)
  const [showContent, setShowContent] = useState(false)
  const currentValue = seoulDatetimeLocal(new Date(target.scheduled_at))
  const timeChanged = timeValue !== '' && timeValue !== currentValue
  const summary = `${target.title} · ${target.subtitle} · ${target.student_count}명`

  useEffect(() => {
    onConfirmLock(confirm != null)
    return () => onConfirmLock(false)
  }, [confirm, onConfirmLock])

  useEffect(() => {
    if (!confirm || busy) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setConfirm(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [busy, confirm])

  async function refresh() {
    invalidateLessonLists(queryClient)
    await queryClient.invalidateQueries({ queryKey: queryKeys.alimtalk.broadcastSchedules })
  }

  async function saveTime() {
    if (!timeChanged || busy) return
    setBusy('time')
    try {
      const scheduledAt = `${timeValue}:00+09:00`
      const saved =
        target.kind === 'lesson' && target.lesson_record_id != null
          ? await lessonService.updateSendSchedule(target.lesson_record_id, scheduledAt)
          : target.schedule_id != null
            ? await alimtalkService.updateBroadcastSchedule(target.schedule_id, scheduledAt)
            : null
      if (!saved) return
      onTimeSaved(saved.scheduled_at)
      setTimeValue(seoulDatetimeLocal(new Date(saved.scheduled_at)))
      await refresh()
      addToast({ variant: 'success', message: `${clockLabel(saved.scheduled_at)}로 바꿨어요.` })
    } catch (err) {
      addToast({ variant: 'error', message: apiErrorMessage(err, '예약 시각을 바꾸지 못했어요.') })
    } finally {
      setBusy(null)
    }
  }

  async function sendNow() {
    if (busy) return
    setBusy('send')
    try {
      if (target.kind === 'lesson' && target.lesson_record_id != null) {
        await lessonService.sendScheduledNow(target.lesson_record_id)
      } else if (target.schedule_id != null) {
        await alimtalkService.sendBroadcastScheduleNow(target.schedule_id)
      }
      await refresh()
      addToast({ variant: 'success', message: '발송을 시작했어요.' })
      onClose()
    } catch (err) {
      addToast({ variant: 'error', message: apiErrorMessage(err, '바로 보내지 못했어요.') })
    } finally {
      setBusy(null)
    }
  }

  async function cancelSchedule() {
    if (busy) return
    setBusy('cancel')
    try {
      if (target.kind === 'lesson' && target.lesson_record_id != null) {
        await lessonService.cancelSendSchedule(target.lesson_record_id)
      } else if (target.schedule_id != null) {
        await alimtalkService.cancelBroadcastSchedule(target.schedule_id)
      }
      await refresh()
      addToast({ variant: 'success', message: '예약을 취소했어요.' })
      onClose()
    } catch (err) {
      addToast({ variant: 'error', message: apiErrorMessage(err, '예약 취소에 실패했어요.') })
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className={scheduleActionStack}>
      <div>
        <Text variant="titleSm" as="h2">
          {target.badge}
        </Text>
        <Text variant="bodyMd" color="gray500" as="p">
          {target.title} · {target.subtitle} · {target.student_count}명
        </Text>
      </div>
      <Button
        type="button"
        variant="outlined"
        size="sm"
        fullWidth
        disabled={busy != null}
        onClick={() => setShowContent((open) => !open)}
      >
        {showContent ? '내용 닫기' : '내용 확인하기'}
      </Button>
      {showContent ? <ScheduleContent target={target} onOpenLesson={() => {
        if (target.lesson_record_id == null) return
        onClose()
        router.push(`/lesson/${target.lesson_record_id}`)
      }} /> : null}
      <label className={scheduleActionField}>
        <Text variant="bodyMd" color="gray700" as="span">
          보낼 시각 (한국 시간)
        </Text>
        <input
          type="datetime-local"
          className={scheduleActionInput}
          min={seoulDatetimeLocal(new Date())}
          value={timeValue}
          disabled={busy != null}
          onChange={(event) => setTimeValue(event.target.value)}
        />
      </label>
      <div className={scheduleActionButtons}>
        <Button
          type="button"
          variant="outlined"
          size="sm"
          fullWidth
          disabled={busy != null || !timeChanged}
          onClick={() => void saveTime()}
        >
          {busy === 'time' ? '저장 중…' : '시간 저장'}
        </Button>
        <Button type="button" variant="primary" size="sm" fullWidth disabled={busy != null} onClick={() => setConfirm('send')}>
          지금 보내기
        </Button>
        <Button type="button" variant="danger" size="sm" fullWidth disabled={busy != null} onClick={() => setConfirm('cancel')}>
          예약 취소
        </Button>
      </div>
      <ConfirmModal
        isOpen={confirm === 'send'}
        onClose={() => {
          if (busy) return
          setConfirm(null)
        }}
        onConfirm={() => void sendNow()}
        title="지금 보낼까요?"
        descriptions={[summary, '예약 시각을 기다리지 않고 바로 발송합니다.']}
        confirmLabel={busy === 'send' ? '보내는 중…' : '지금 보내기'}
        confirmVariant="primary"
      />
      <ConfirmModal
        isOpen={confirm === 'cancel'}
        onClose={() => {
          if (busy) return
          setConfirm(null)
        }}
        onConfirm={() => void cancelSchedule()}
        title="예약을 취소할까요?"
        descriptions={[summary, '예약 알림톡이 발송되지 않습니다.']}
        confirmLabel={busy === 'cancel' ? '취소하는 중…' : '예약 취소'}
        confirmVariant="danger"
      />
    </div>
  )
}
