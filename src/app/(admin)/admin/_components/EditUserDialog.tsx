'use client'

import { useState } from 'react'
import { Loader2, Pencil } from 'lucide-react'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button/Button'
import Input from '@/components/common/Input/Input'
import Text from '@/components/common/Text/Text'
import { admin, adminErrorMessage } from '@/services/admin'
import { useToastStore } from '@/stores/toastStore'
import * as styles from '../admin.css'

type Props = {
  userId: number
  name: string
  email: string
  phone: string | null
  onSaved: () => void
}

function editedPhoneKey(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  return canonicalPhone(trimmed) ?? trimmed
}

function canonicalPhone(value: string): string | null {
  const digits = value.replace(/\D/g, '')
  const withZero = digits.length === 10 && digits.startsWith('10') ? `0${digits}` : digits
  if (!/^010\d{8}$/.test(withZero)) return null
  return `${withZero.slice(0, 3)}-${withZero.slice(3, 7)}-${withZero.slice(7)}`
}

export default function EditUserDialog({ userId, name, email, phone, onSaved }: Props) {
  const addToast = useToastStore((s) => s.addToast)
  const [open, setOpen] = useState(false)
  const [nextName, setNextName] = useState(name)
  const [nextEmail, setNextEmail] = useState(email)
  const [nextPhone, setNextPhone] = useState(phone ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentPhoneKey = editedPhoneKey(phone ?? '')
  const nextPhoneKey = editedPhoneKey(nextPhone)
  const phoneChanged = nextPhoneKey !== currentPhoneKey
  const unchanged =
    nextName.trim() === name && nextEmail.trim().toLowerCase() === email.trim().toLowerCase() && !phoneChanged

  function openDialog() {
    setNextName(name)
    setNextEmail(email)
    setNextPhone(phone ?? '')
    setError(null)
    setOpen(true)
  }

  function close() {
    if (loading) return
    setOpen(false)
    setError(null)
  }

  async function handleSave() {
    const trimmedName = nextName.trim()
    const trimmedEmail = nextEmail.trim()
    const trimmedPhone = nextPhone.trim()
    if (!trimmedName) {
      setError('이름을 입력해 주세요.')
      return
    }
    if (trimmedName.length > 100) {
      setError('이름은 100자까지예요.')
      return
    }
    if (!trimmedEmail.includes('@')) {
      setError('올바른 이메일을 입력해 주세요.')
      return
    }
    if (trimmedPhone && !canonicalPhone(trimmedPhone)) {
      setError('전화번호는 010으로 시작하는 휴대폰 번호여야 해요.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await admin.updateUser(userId, {
        name: trimmedName,
        email: trimmedEmail,
        ...(editedPhoneKey(trimmedPhone) !== editedPhoneKey(phone ?? '') ? { phone: trimmedPhone } : {}),
      })
      addToast({ variant: 'success', message: '사용자 정보를 저장했어요.' })
      setOpen(false)
      onSaved()
    } catch (err) {
      setError(adminErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button type="button" className={styles.ghostBtn} onClick={openDialog}>
        <Pencil size={14} />
        정보 수정
      </button>
      <Modal isOpen={open} onClose={close} size="sm">
        <Text variant="headingSm" as="h2">
          사용자 정보 수정
        </Text>
        <p className={styles.dangerNote}>
          {name} · {email}
          <br />
          전화번호를 바꾸거나 지우면 인증이 풀려요. 선생님은 다음 로그인에서 다시 인증해요.
        </p>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>이름</span>
          <Input value={nextName} onChange={(e) => setNextName(e.target.value)} autoComplete="off" />
        </label>
        <label className={styles.fieldSpaced}>
          <span className={styles.fieldLabel}>이메일</span>
          <Input
            type="email"
            value={nextEmail}
            onChange={(e) => setNextEmail(e.target.value)}
            autoComplete="off"
          />
        </label>
        <label className={styles.fieldSpaced}>
          <span className={styles.fieldLabel}>전화번호</span>
          <Input
            value={nextPhone}
            onChange={(e) => setNextPhone(e.target.value)}
            placeholder="비우면 전화번호를 지워요"
            autoComplete="off"
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
            disabled={loading || unchanged}
            leftIcon={loading ? <Loader2 size={16} /> : <Pencil size={16} />}
            onClick={() => void handleSave()}
          >
            {loading ? '저장 중…' : '저장'}
          </Button>
        </div>
      </Modal>
    </>
  )
}
