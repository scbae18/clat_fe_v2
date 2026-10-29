'use client'

import { useState } from 'react'
import { KeyRound, Loader2 } from 'lucide-react'
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
}

export default function ResetPasswordDialog({ userId, email, name }: Props) {
  const addToast = useToastStore((s) => s.addToast)
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saved, setSaved] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function close() {
    if (loading) return
    setOpen(false)
    setPassword('')
    setConfirm('')
    setSaved(null)
    setError(null)
  }

  async function handleSave() {
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 해요.')
      return
    }
    if (password.length > 128) {
      setError('비밀번호는 128자까지예요.')
      return
    }
    if (password !== confirm) {
      setError('비밀번호가 서로 달라요.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await admin.resetUserPassword(userId, password)
      setSaved(password)
      setPassword('')
      setConfirm('')
      addToast({ variant: 'success', message: '비밀번호를 바꿨어요. 선생님에게 새 비밀번호를 알려 주세요.' })
    } catch (err) {
      setError(adminErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!saved) return
    try {
      await navigator.clipboard.writeText(saved)
      addToast({ variant: 'success', message: '비밀번호를 복사했어요.' })
    } catch {
      addToast({ variant: 'error', message: '비밀번호를 복사하지 못했어요.' })
    }
  }

  return (
    <>
      <button
        type="button"
        className={styles.ghostBtn}
        onClick={() => {
          setOpen(true)
          setPassword('')
          setConfirm('')
          setSaved(null)
          setError(null)
        }}
      >
        <KeyRound size={14} />
        비밀번호 다시 정하기
      </button>
      <Modal isOpen={open} onClose={close} size="sm">
        <Text variant="headingSm" as="h2">
          새 비밀번호를 정할까요?
        </Text>
        <p className={styles.dangerNote}>
          {name} · {email}
          <br />
          예전 비밀번호는 알 수 없어요. 여기서 정한 비밀번호를 선생님에게 알려 주세요.
        </p>
        {saved ? (
          <>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>선생님에게 알려 줄 비밀번호</span>
              <Input readOnly value={saved} autoComplete="off" />
            </label>
            <div className={styles.modalActions}>
              <Button type="button" variant="secondary" className={styles.flex1} onClick={() => void handleCopy()}>
                복사
              </Button>
              <Button type="button" variant="primary" className={styles.flex1} onClick={close}>
                닫기
              </Button>
            </div>
          </>
        ) : (
          <>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>새 비밀번호</span>
              <Input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>새 비밀번호 확인</span>
              <Input
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </label>
            {error ? <p className={styles.dropText}>{error}</p> : null}
            <div className={styles.modalActions}>
              <Button type="button" variant="secondary" className={styles.flex1} disabled={loading} onClick={close}>
                취소
              </Button>
              <Button
                type="button"
                variant="primary"
                className={styles.flex1}
                disabled={loading || password.length === 0 || confirm.length === 0}
                leftIcon={loading ? <Loader2 size={16} /> : <KeyRound size={16} />}
                onClick={() => void handleSave()}
              >
                {loading ? '저장 중…' : '비밀번호 저장'}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </>
  )
}
