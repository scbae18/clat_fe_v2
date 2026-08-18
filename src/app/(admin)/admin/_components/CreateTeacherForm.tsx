'use client'

import { useState, type FormEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { UserPlus, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import Input from '@/components/common/Input/Input'
import Button from '@/components/common/Button/Button'
import { admin, adminErrorMessage } from '@/services/admin'
import { useToastStore } from '@/stores/toastStore'
import * as styles from '../admin.css'

export default function CreateTeacherForm() {
  const queryClient = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const created = await admin.createUser({ name, email, password })
      addToast({ variant: 'success', message: `${created.name} 계정이 생성됐습니다.` })
      setName('')
      setEmail('')
      setPassword('')
      await queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      await queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    } catch (err) {
      setError(adminErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.card}>
      <button
        type="button"
        className={styles.formToggle}
        onClick={() => {
          setOpen((v) => !v)
          setError(null)
        }}
      >
        <span className={styles.formToggleLeft}>
          <span className={styles.iconBox.primary50}>
            <UserPlus size={16} />
          </span>
          <span className={styles.cardTitle}>선생님 계정 생성</span>
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open ? (
        <form className={styles.formBody} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>이름</span>
              <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="홍길동" />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>이메일</span>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="teacher@example.com"
              />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>비밀번호 (8자 이상)</span>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="********"
              />
            </label>
          </div>
          <div className={styles.formActions}>
            <Button type="submit" disabled={loading} leftIcon={loading ? <Loader2 size={16} /> : <UserPlus size={16} />}>
              {loading ? '생성 중...' : '계정 생성'}
            </Button>
            {error ? <span className={styles.dropText}>{error}</span> : null}
          </div>
        </form>
      ) : null}
    </section>
  )
}
