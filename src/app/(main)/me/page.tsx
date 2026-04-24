'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import ArrowLeftIcon from '@/assets/icons/icon-arrow-left.svg'
import ChoiceConfirmModal from '@/components/common/ChoiceConfirmModal/ChoiceConfirmModal'
import useToast from '@/hooks/useToast'
import { auth } from '@/services/auth'
import { useUserStore } from '@/stores/userStore'
import * as styles from './me.css'

const MSG = {
  pageTitle: '내 정보',
  back: '뒤로',
  profileTitle: '프로필',
  profileDesc: '이름과 이메일을 수정할 수 있어요. 이메일 변경 시 본인 확인용 비밀번호가 필요해요.',
  nameLabel: '이름',
  emailLabel: '이메일',
  currentPassLabel: '현재 비밀번호',
  currentPassPlaceholder: '이메일 변경 시에만 입력',
  joinedLabel: '가입일',
  save: '저장',
  cancel: '취소',
  edit: '수정',
  passwordTitle: '비밀번호 변경',
  passwordDesc: '현재 비밀번호 확인 후 새 비밀번호로 바꿀 수 있어요. (8자 이상)',
  passwordCurrent: '현재 비밀번호',
  passwordNew: '새 비밀번호',
  passwordConfirm: '새 비밀번호 확인',
  passwordChange: '비밀번호 변경',
  dangerTitle: '회원 탈퇴',
  dangerDesc: '탈퇴하면 30일간 유예 후 계정이 완전히 삭제돼요. 본인 확인용 비밀번호가 필요해요.',
  withdraw: '회원 탈퇴',
  withdrawConfirmTitle: '정말 탈퇴하시겠어요?',
  withdrawConfirmDesc: [
    '탈퇴 후 30일 안에 다시 로그인하지 않으면 계정과 수업 기록이 영구 삭제됩니다.',
    '이 작업은 되돌리기 어려울 수 있어요.',
  ],
  withdrawActionLabel: '탈퇴하기',
  loading: '불러오는 중…',
  nameTooShort: '이름을 입력해 주세요.',
  invalidEmail: '올바른 이메일 형식이 아니에요.',
  needCurrentPass: '이메일 변경 시 비밀번호가 필요해요.',
  passTooShort: '비밀번호는 8자 이상이어야 해요.',
  passMismatch: '새 비밀번호가 서로 달라요.',
  saveOk: '프로필이 수정됐어요.',
  passOk: '비밀번호가 변경됐어요.',
  withdrawOk: '탈퇴가 요청됐어요.',
  genericFail: '요청에 실패했어요.',
} as const

function initialFrom(name: string): string {
  const t = name?.trim() ?? ''
  if (!t) return '?'
  return t.charAt(0).toUpperCase()
}

function extractErrorMessage(e: unknown, fallback: string): string {
  const err = e as {
    response?: { data?: { error?: { message?: string }; message?: string } }
  }
  return (
    err?.response?.data?.error?.message ||
    err?.response?.data?.message ||
    fallback
  )
}

function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
}

export default function MyProfilePage() {
  const router = useRouter()
  const toast = useToast()
  const user = useUserStore((s) => s.user)
  const setUser = useUserStore((s) => s.setUser)

  const [loading, setLoading] = useState(!user)

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassForEmail, setCurrentPassForEmail] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)

  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [newPassConfirm, setNewPassConfirm] = useState('')
  const [passSaving, setPassSaving] = useState(false)
  const [passError, setPassError] = useState<string | null>(null)

  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [withdrawPass, setWithdrawPass] = useState('')
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setLoading(false)
      return
    }
    auth
      .me()
      .then((u) => {
        if (cancelled) return
        setUser(u)
        setName(u.name)
        setEmail(u.email)
      })
      .catch(() => {
        if (!cancelled) router.push('/login')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
    // user 최초 로드 한 번만
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const joinedLabel = useMemo(() => {
    if (!user?.created_at) return '-'
    try {
      return format(new Date(user.created_at), 'yyyy년 M월 d일 (E)', { locale: ko })
    } catch {
      return user.created_at
    }
  }, [user?.created_at])

  const emailChanged = !!user && email.trim().toLowerCase() !== user.email
  const nameChanged = !!user && name.trim() !== user.name.trim()
  const canSaveProfile = !!user && (nameChanged || emailChanged) && !profileSaving

  const startEdit = () => {
    if (!user) return
    setName(user.name)
    setEmail(user.email)
    setCurrentPassForEmail('')
    setProfileError(null)
    setEditing(true)
  }

  const cancelEdit = () => {
    if (!user) return
    setName(user.name)
    setEmail(user.email)
    setCurrentPassForEmail('')
    setProfileError(null)
    setEditing(false)
  }

  const onSaveProfile = async () => {
    if (!user) return
    const trimmedName = name.trim()
    const trimmedEmail = email.trim().toLowerCase()

    if (!trimmedName) {
      setProfileError(MSG.nameTooShort)
      return
    }
    if (trimmedEmail && !isValidEmail(trimmedEmail)) {
      setProfileError(MSG.invalidEmail)
      return
    }
    if (emailChanged && !currentPassForEmail) {
      setProfileError(MSG.needCurrentPass)
      return
    }

    setProfileError(null)
    setProfileSaving(true)
    try {
      const payload: { name?: string; email?: string; current_password?: string } = {}
      if (nameChanged) payload.name = trimmedName
      if (emailChanged) {
        payload.email = trimmedEmail
        payload.current_password = currentPassForEmail
      }
      const updated = await auth.updateMe(payload)
      setName(updated.name)
      setEmail(updated.email)
      setCurrentPassForEmail('')
      setEditing(false)
      toast.success(MSG.saveOk)
    } catch (e) {
      setProfileError(extractErrorMessage(e, MSG.genericFail))
    } finally {
      setProfileSaving(false)
    }
  }

  const passValid =
    currentPass.length > 0 &&
    newPass.length >= 8 &&
    newPass === newPassConfirm &&
    !passSaving

  const onChangePassword = async () => {
    if (!currentPass) {
      setPassError(MSG.genericFail)
      return
    }
    if (newPass.length < 8) {
      setPassError(MSG.passTooShort)
      return
    }
    if (newPass !== newPassConfirm) {
      setPassError(MSG.passMismatch)
      return
    }
    setPassError(null)
    setPassSaving(true)
    try {
      await auth.changePassword({
        current_password: currentPass,
        new_password: newPass,
      })
      setCurrentPass('')
      setNewPass('')
      setNewPassConfirm('')
      toast.success(MSG.passOk)
    } catch (e) {
      setPassError(extractErrorMessage(e, MSG.genericFail))
    } finally {
      setPassSaving(false)
    }
  }

  const onWithdraw = async () => {
    if (!withdrawPass) return
    setWithdrawSubmitting(true)
    try {
      await auth.withdraw({ password: withdrawPass })
      toast.success(MSG.withdrawOk)
      setWithdrawOpen(false)
      router.push('/login')
    } catch (e) {
      toast.error(extractErrorMessage(e, MSG.genericFail))
      setWithdrawOpen(false)
    } finally {
      setWithdrawSubmitting(false)
    }
  }

  if (loading || !user) {
    return (
      <div className={styles.pageRoot}>
        <p className={styles.emptyState}>{MSG.loading}</p>
      </div>
    )
  }

  return (
    <div className={styles.pageRoot}>
      <header className={styles.headerRow}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => router.back()}
          aria-label={MSG.back}
        >
          <ArrowLeftIcon width={24} height={24} />
        </button>
        <h1 className={styles.pageTitle}>{MSG.pageTitle}</h1>
      </header>

      <div className={styles.cardStack}>
        <section className={styles.card}>
          <div className={styles.profileTop}>
            <div className={styles.avatar}>{initialFrom(user.name)}</div>
            <div>
              <div className={styles.profileName}>{user.name}</div>
              <div className={styles.profileEmail}>{user.email}</div>
              <div className={styles.profileMeta}>
                {MSG.joinedLabel} · {joinedLabel}
              </div>
            </div>
          </div>

          <div className={styles.sectionHead}>
            <div>
              <h2 className={styles.sectionTitle}>{MSG.profileTitle}</h2>
              <p className={styles.sectionDesc}>{MSG.profileDesc}</p>
            </div>
            {!editing ? (
              <button
                type="button"
                className={`${styles.button} ${styles.buttonGhost}`}
                onClick={startEdit}
              >
                {MSG.edit}
              </button>
            ) : null}
          </div>

          <div className={styles.fieldGrid}>
            <span className={styles.fieldLabel}>{MSG.nameLabel}</span>
            {editing ? (
              <input
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                autoComplete="name"
              />
            ) : (
              <span className={styles.fieldValue}>{user.name}</span>
            )}

            <span className={styles.fieldLabel}>{MSG.emailLabel}</span>
            {editing ? (
              <input
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                maxLength={254}
              />
            ) : (
              <span className={styles.fieldValue}>{user.email}</span>
            )}

            {editing && emailChanged ? (
              <>
                <span className={styles.fieldLabel}>{MSG.currentPassLabel}</span>
                <input
                  className={styles.input}
                  value={currentPassForEmail}
                  onChange={(e) => setCurrentPassForEmail(e.target.value)}
                  type="password"
                  autoComplete="current-password"
                  placeholder={MSG.currentPassPlaceholder}
                />
              </>
            ) : null}
          </div>

          {profileError ? <p className={styles.errorText}>{profileError}</p> : null}

          {editing ? (
            <div className={styles.actionsRow}>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonGhost}`}
                onClick={cancelEdit}
                disabled={profileSaving}
              >
                {MSG.cancel}
              </button>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonPrimary}`}
                onClick={onSaveProfile}
                disabled={!canSaveProfile}
              >
                {MSG.save}
              </button>
            </div>
          ) : null}
        </section>

        <section className={styles.card}>
          <div>
            <h2 className={styles.sectionTitle}>{MSG.passwordTitle}</h2>
            <p className={styles.sectionDesc}>{MSG.passwordDesc}</p>
          </div>

          <div className={styles.fieldGrid}>
            <span className={styles.fieldLabel}>{MSG.passwordCurrent}</span>
            <input
              className={styles.input}
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              type="password"
              autoComplete="current-password"
            />

            <span className={styles.fieldLabel}>{MSG.passwordNew}</span>
            <input
              className={styles.input}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              type="password"
              autoComplete="new-password"
              minLength={8}
            />

            <span className={styles.fieldLabel}>{MSG.passwordConfirm}</span>
            <input
              className={styles.input}
              value={newPassConfirm}
              onChange={(e) => setNewPassConfirm(e.target.value)}
              type="password"
              autoComplete="new-password"
            />
          </div>

          {passError ? <p className={styles.errorText}>{passError}</p> : null}

          <div className={styles.actionsRow}>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={onChangePassword}
              disabled={!passValid}
            >
              {MSG.passwordChange}
            </button>
          </div>
        </section>

        <section className={styles.dangerCard}>
          <div>
            <h2 className={styles.dangerTitle}>{MSG.dangerTitle}</h2>
            <p className={styles.sectionDesc}>{MSG.dangerDesc}</p>
          </div>
          <div className={styles.fieldGrid}>
            <span className={styles.fieldLabel}>{MSG.currentPassLabel}</span>
            <input
              className={styles.input}
              type="password"
              value={withdrawPass}
              onChange={(e) => setWithdrawPass(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <div className={styles.actionsRow}>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonDangerGhost}`}
              onClick={() => setWithdrawOpen(true)}
              disabled={!withdrawPass || withdrawSubmitting}
            >
              {MSG.withdraw}
            </button>
          </div>
        </section>
      </div>

      <ChoiceConfirmModal
        isOpen={withdrawOpen}
        onClose={() => !withdrawSubmitting && setWithdrawOpen(false)}
        onConfirm={onWithdraw}
        title={MSG.withdrawConfirmTitle}
        descriptions={[...MSG.withdrawConfirmDesc]}
        confirmLabel={MSG.withdrawActionLabel}
        confirmTone="danger"
        confirmDisabled={withdrawSubmitting}
      />
    </div>
  )
}
