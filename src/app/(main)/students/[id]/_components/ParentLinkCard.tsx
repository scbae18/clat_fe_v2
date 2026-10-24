'use client'

import { useState } from 'react'
import ChoiceConfirmModal from '@/components/common/ChoiceConfirmModal/ChoiceConfirmModal'
import { studentService } from '@/services/student'
import type { ParentLinkInfo, StudentDetail } from '@/types/student'
import { useToastStore } from '@/stores/toastStore'
import * as styles from '../studentDashboard.css'

function statusLabel(link: ParentLinkInfo) {
  if (link.status === 'blocked') return '차단'
  if (link.status === 'ending') return `종료 D-${link.days_left ?? 0}`
  return '활성'
}

export function ParentLinkCard({
  detail,
  onUpdated,
}: {
  detail: StudentDetail
  onUpdated: (detail: StudentDetail) => void
}) {
  const link = detail.parent_link
  const addToast = useToastStore((s) => s.addToast)
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  if (!link) return null

  const url = link.token ? `${window.location.origin}/parent/${link.token}` : ''

  const regenerate = async () => {
    setBusy(true)
    try {
      await studentService.regenerateParentLink(detail.id)
      const next = await studentService.getStudent(detail.id)
      onUpdated(next)
      addToast({ variant: 'success', message: '학부모 링크를 새로 만들었어요.' })
      setOpen(false)
    } catch {
      addToast({ variant: 'error', message: '학부모 링크를 만들지 못했어요.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className={styles.parentLinkCard}>
      <div className={styles.parentLinkTitle}>학부모 링크</div>
      <div className={styles.parentLinkStatus}>{statusLabel(link)}</div>
      {url ? <input className={styles.parentLinkUrl} readOnly value={url} /> : <p>아직 링크가 없습니다.</p>}
      <div className={styles.parentLinkActions}>
        {url ? (
          <button
            type="button"
            className={styles.parentLinkButtonGhost}
            onClick={() => {
              void navigator.clipboard.writeText(url)
              addToast({ variant: 'success', message: '링크를 복사했어요.' })
            }}
          >
            복사
          </button>
        ) : null}
        <button type="button" className={styles.parentLinkButton} onClick={() => setOpen(true)}>
          {url ? '다시 발급' : '링크 만들기'}
        </button>
      </div>
      <ChoiceConfirmModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          void regenerate()
        }}
        title={url ? '링크를 다시 발급할까요?' : '학부모 링크를 만들까요?'}
        descriptions={url ? ['이전 주소는 바로 끊깁니다.'] : ['학생 주소가 하나 만들어집니다.']}
        confirmLabel={busy ? '만드는 중' : '확인'}
        confirmDisabled={busy}
      />
    </section>
  )
}
