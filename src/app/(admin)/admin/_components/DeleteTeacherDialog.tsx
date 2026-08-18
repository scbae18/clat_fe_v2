'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button/Button'
import Input from '@/components/common/Input/Input'
import Text from '@/components/common/Text/Text'
import { admin, adminErrorMessage } from '@/services/admin'
import { useToastStore } from '@/stores/toastStore'
import * as styles from '../admin.css'

type Props = {
  userId: number
  email: string
  name: string
  variant?: 'compact' | 'danger-zone'
}

export default function DeleteTeacherDialog({
  userId,
  email,
  name,
  variant = 'compact',
}: Props) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = confirm.trim().toLowerCase() === email.toLowerCase()

  async function handleDelete() {
    setLoading(true)
    setError(null)
    try {
      await admin.deleteUser(userId, confirm)
      addToast({ variant: 'success', message: `${name} 계정을 삭제했습니다.` })
      setOpen(false)
      await queryClient.invalidateQueries({ queryKey: ['admin'] })
      if (variant === 'danger-zone') router.push('/admin/users')
    } catch (err) {
      setError(adminErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {variant === 'compact' ? (
        <button
          type="button"
          className={styles.dangerBtn}
          onClick={() => {
            setOpen(true)
            setConfirm('')
            setError(null)
          }}
        >
          <Trash2 size={14} />
          삭제
        </button>
      ) : (
        <Button
          type="button"
          variant="danger"
          leftIcon={<Trash2 size={16} />}
          onClick={() => {
            setOpen(true)
            setConfirm('')
            setError(null)
          }}
        >
          계정 영구 삭제
        </Button>
      )}
      <Modal isOpen={open} onClose={() => !loading && setOpen(false)} size="sm">
        <Text variant="headingSm" as="h2">
          계정을 완전히 삭제할까요?
        </Text>
        <p className={styles.dangerNote}>
          {name} · {email}
          <br />
          아래 데이터가 복구 없이 모두 삭제되며, 이 이메일로는 더 이상 로그인할 수 없습니다.
        </p>
        <ul className={styles.confirmList}>
          <li className={styles.confirmItem}>개설한 모든 반·일정·반 학생 매핑</li>
          <li className={styles.confirmItem}>등록한 학생·수업 템플릿·항목·선택지</li>
          <li className={styles.confirmItem}>수업 기록 및 입력값(공통·학생별)</li>
          <li className={styles.confirmItem}>계정(비밀번호 해시 포함)</li>
        </ul>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>계속하려면 이메일 주소를 그대로 입력하세요</span>
          <Input
            type="email"
            autoComplete="off"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder={email}
          />
        </label>
        {error ? <p className={styles.dropText}>{error}</p> : null}
        <div className={styles.modalActions}>
          <Button type="button" variant="secondary" className={styles.flex1} disabled={loading} onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button
            type="button"
            variant="danger"
            className={styles.flex1}
            disabled={loading || !canSubmit}
            leftIcon={loading ? <Loader2 size={16} /> : <Trash2 size={16} />}
            onClick={handleDelete}
          >
            {loading ? '삭제 중…' : '영구 삭제'}
          </Button>
        </div>
      </Modal>
    </>
  )
}
