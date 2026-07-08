'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import Text from '@/components/common/Text'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import ConfirmModal from '@/components/common/ConfirmModal'
import useToast from '@/hooks/useToast'
import { auth, clearTokens } from '@/services/auth'
import { useUserStore } from '@/stores/userStore'
import * as styles from './me.css'

const MSG = {
  pageTitle: '내 정보',
  pageDesc: '클랫에 로그인할 때 쓰는 계정 정보예요.',
  basicTitle: '기본 정보',
  basicDesc: '수업에 표시되는 선생님 이름이에요.',
  loginTitle: '로그인 정보',
  loginDesc: '로그인에 쓰는 이메일이에요. 바꿀 때 비밀번호로 확인할게요.',
  securityTitle: '보안',
  securityDesc: '현재 비밀번호를 확인한 뒤 새 비밀번호로 바꿔요.',
  dangerTitle: '회원 탈퇴',
  dangerDesc: '탈퇴하면 30일 동안 복구할 수 있고, 이후에는 데이터가 삭제돼요.',
  nameLabel: '이름',
  emailLabel: '이메일',
  joinedLabel: '가입일',
  edit: '수정',
  cancel: '취소',
  save: '저장',
  changeEmail: '이메일 변경',
  changePassword: '비밀번호 변경',
  withdraw: '회원 탈퇴',
  loading: '불러오는 중…',
  nameTooShort: '이름을 입력해 주세요.',
  invalidEmail: '올바른 이메일 형식이 아니에요.',
  needCurrentPass: '이메일 변경 시 비밀번호가 필요해요.',
  passTooShort: '비밀번호는 8자 이상이어야 해요.',
  passMismatch: '새 비밀번호가 서로 달라요.',
  passSameAsCurrent: '새 비밀번호는 현재 비밀번호와 달라야 해요.',
  saveOk: '이름이 변경됐어요.',
  emailOk: '이메일이 변경됐어요. 새 이메일로 다시 로그인해 주세요.',
  passOk: '비밀번호가 변경됐어요.',
  withdrawOk: '탈퇴가 요청됐어요. 30일 안에 다시 로그인하면 복구할 수 있어요.',
  genericFail: '요청에 실패했어요.',
  emailModalTitle: '이메일 변경',
  emailModalDesc: '새 이메일과 현재 비밀번호를 입력해 주세요. 변경 후에는 다시 로그인해야 해요.',
  newEmailLabel: '새 이메일',
  currentPassLabel: '현재 비밀번호',
  passModalTitle: '비밀번호 변경',
  passModalDesc: '현재 비밀번호를 확인한 뒤 새 비밀번호(8자 이상)로 바꿔요.',
  passwordNew: '새 비밀번호',
  passwordConfirm: '새 비밀번호 확인',
  withdrawStep1Title: '정말 탈퇴하시겠어요?',
  withdrawStep1Desc: [
    '탈퇴 후 30일 안에 다시 로그인하면 계정을 복구할 수 있어요.',
    '30일이 지나면 계정과 수업 기록이 삭제돼요.',
  ],
  withdrawContinue: '계속',
  withdrawStep2Title: '비밀번호를 확인해 주세요',
  withdrawStep2Desc: '본인 확인을 위해 현재 비밀번호를 입력해 주세요.',
  withdrawAction: '탈퇴하기',
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
  return err?.response?.data?.error?.message || err?.response?.data?.message || fallback
}

function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
}

type WithdrawStep = null | 'confirm' | 'password'

export default function MyProfilePage() {
  const router = useRouter()
  const toast = useToast()
  const user = useUserStore((s) => s.user)
  const setUser = useUserStore((s) => s.setUser)

  const [loading, setLoading] = useState(!user)

  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState('')
  const [nameSaving, setNameSaving] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)

  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [nextEmail, setNextEmail] = useState('')
  const [emailPass, setEmailPass] = useState('')
  const [emailSaving, setEmailSaving] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  const [passModalOpen, setPassModalOpen] = useState(false)
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [newPassConfirm, setNewPassConfirm] = useState('')
  const [passSaving, setPassSaving] = useState(false)
  const [passError, setPassError] = useState<string | null>(null)

  const [withdrawStep, setWithdrawStep] = useState<WithdrawStep>(null)
  const [withdrawPass, setWithdrawPass] = useState('')
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false)
  const [withdrawError, setWithdrawError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    if (user) {
      setName(user.name)
      setLoading(false)
      return
    }
    auth
      .me()
      .then((u) => {
        if (cancelled) return
        setUser(u)
        setName(u.name)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once
  }, [])

  const joinedLabel = useMemo(() => {
    if (!user?.created_at) return '-'
    try {
      return format(new Date(user.created_at), 'yyyy년 M월 d일 (E)', { locale: ko })
    } catch {
      return user.created_at
    }
  }, [user?.created_at])

  const nameChanged = !!user && name.trim() !== user.name.trim()
  const canSaveName = !!user && nameChanged && !nameSaving

  const startEditName = () => {
    if (!user) return
    setName(user.name)
    setNameError(null)
    setEditingName(true)
  }

  const cancelEditName = () => {
    if (!user) return
    setName(user.name)
    setNameError(null)
    setEditingName(false)
  }

  const onSaveName = async () => {
    if (!user) return
    const trimmedName = name.trim()
    if (!trimmedName) {
      setNameError(MSG.nameTooShort)
      return
    }
    setNameError(null)
    setNameSaving(true)
    try {
      const updated = await auth.updateMe({ name: trimmedName })
      setName(updated.name)
      setEditingName(false)
      toast.success(MSG.saveOk)
    } catch (e) {
      setNameError(extractErrorMessage(e, MSG.genericFail))
    } finally {
      setNameSaving(false)
    }
  }

  const openEmailModal = () => {
    if (!user) return
    setNextEmail(user.email)
    setEmailPass('')
    setEmailError(null)
    setEmailModalOpen(true)
  }

  const closeEmailModal = () => {
    if (emailSaving) return
    setEmailModalOpen(false)
    setEmailPass('')
    setEmailError(null)
  }

  const onSaveEmail = async () => {
    if (!user) return
    const trimmedEmail = nextEmail.trim().toLowerCase()
    if (!isValidEmail(trimmedEmail)) {
      setEmailError(MSG.invalidEmail)
      return
    }
    if (trimmedEmail === user.email) {
      setEmailError('현재 이메일과 같아요.')
      return
    }
    if (!emailPass) {
      setEmailError(MSG.needCurrentPass)
      return
    }
    setEmailError(null)
    setEmailSaving(true)
    try {
      await auth.updateMe({
        email: trimmedEmail,
        current_password: emailPass,
      })
      toast.success(MSG.emailOk)
      setEmailModalOpen(false)
      clearTokens()
      useUserStore.getState().setUser(null)
      window.location.href = '/login'
    } catch (e) {
      setEmailError(extractErrorMessage(e, MSG.genericFail))
      setEmailSaving(false)
    }
  }

  const openPassModal = () => {
    setCurrentPass('')
    setNewPass('')
    setNewPassConfirm('')
    setPassError(null)
    setPassModalOpen(true)
  }

  const closePassModal = () => {
    if (passSaving) return
    setPassModalOpen(false)
    setCurrentPass('')
    setNewPass('')
    setNewPassConfirm('')
    setPassError(null)
  }

  const passValid =
    currentPass.length > 0 &&
    newPass.length >= 8 &&
    newPass === newPassConfirm &&
    newPass !== currentPass &&
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
    if (newPass === currentPass) {
      setPassError(MSG.passSameAsCurrent)
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
      toast.success(MSG.passOk)
      setPassModalOpen(false)
      setCurrentPass('')
      setNewPass('')
      setNewPassConfirm('')
      setPassError(null)
    } catch (e) {
      setPassError(extractErrorMessage(e, MSG.genericFail))
    } finally {
      setPassSaving(false)
    }
  }

  const startWithdraw = () => setWithdrawStep('confirm')

  const closeWithdraw = () => {
    if (withdrawSubmitting) return
    setWithdrawStep(null)
    setWithdrawPass('')
    setWithdrawError(null)
  }

  const onWithdraw = async () => {
    if (!withdrawPass) {
      setWithdrawError(MSG.needCurrentPass)
      return
    }
    setWithdrawError(null)
    setWithdrawSubmitting(true)
    try {
      await auth.withdraw({ password: withdrawPass })
      toast.success(MSG.withdrawOk)
      setWithdrawStep(null)
      router.push('/login')
    } catch (e) {
      setWithdrawError(extractErrorMessage(e, MSG.genericFail))
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
      <h1 className={styles.pageTitle}>{MSG.pageTitle}</h1>
      <p className={styles.pageDesc}>{MSG.pageDesc}</p>

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
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHead}>
            <div>
              <h2 className={styles.sectionTitle}>{MSG.basicTitle}</h2>
              <p className={styles.sectionDesc}>{MSG.basicDesc}</p>
            </div>
            {!editingName ? (
              <Button variant="ghost" size="sm" onClick={startEditName}>
                {MSG.edit}
              </Button>
            ) : null}
          </div>

          <div className={styles.fieldGrid}>
            <span className={styles.fieldLabel}>{MSG.nameLabel}</span>
            {editingName ? (
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
          </div>

          {nameError ? <p className={styles.errorText}>{nameError}</p> : null}

          {editingName ? (
            <div className={styles.actionsRow}>
              <Button variant="ghost" size="sm" onClick={cancelEditName} disabled={nameSaving}>
                {MSG.cancel}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => void onSaveName()}
                disabled={!canSaveName}
              >
                {nameSaving ? '저장 중…' : MSG.save}
              </Button>
            </div>
          ) : null}
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHead}>
            <div>
              <h2 className={styles.sectionTitle}>{MSG.loginTitle}</h2>
              <p className={styles.sectionDesc}>{MSG.loginDesc}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={openEmailModal}>
              {MSG.changeEmail}
            </Button>
          </div>
          <div className={styles.fieldGrid}>
            <span className={styles.fieldLabel}>{MSG.emailLabel}</span>
            <span className={styles.fieldValue}>{user.email}</span>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHead}>
            <div>
              <h2 className={styles.sectionTitle}>{MSG.securityTitle}</h2>
              <p className={styles.sectionDesc}>{MSG.securityDesc}</p>
            </div>
            <Button variant="secondary" size="sm" onClick={openPassModal}>
              {MSG.changePassword}
            </Button>
          </div>
        </section>

        <section className={styles.dangerCard}>
          <div className={styles.sectionHead}>
            <div>
              <h2 className={styles.dangerTitle}>{MSG.dangerTitle}</h2>
              <p className={styles.sectionDesc}>{MSG.dangerDesc}</p>
            </div>
            <Button variant="deleteClass" size="sm" onClick={startWithdraw}>
              {MSG.withdraw}
            </Button>
          </div>
        </section>
      </div>

      <Modal isOpen={emailModalOpen} onClose={closeEmailModal} size="sm">
        <Text variant="headingMd" as="h2">
          {MSG.emailModalTitle}
        </Text>
        <p className={styles.sectionDesc} style={{ marginTop: 8 }}>
          {MSG.emailModalDesc}
        </p>
        <div className={styles.modalFieldStack}>
          <div className={styles.modalField}>
            <span className={styles.fieldLabel}>{MSG.newEmailLabel}</span>
            <input
              className={styles.input}
              type="email"
              value={nextEmail}
              onChange={(e) => setNextEmail(e.target.value)}
              autoComplete="email"
              maxLength={254}
            />
          </div>
          <div className={styles.modalField}>
            <span className={styles.fieldLabel}>{MSG.currentPassLabel}</span>
            <input
              className={styles.input}
              type="password"
              value={emailPass}
              onChange={(e) => setEmailPass(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {emailError ? <p className={styles.errorText}>{emailError}</p> : null}
        </div>
        <div className={styles.modalActions}>
          <Button variant="ghost" size="md" fullWidth onClick={closeEmailModal} disabled={emailSaving}>
            {MSG.cancel}
          </Button>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => void onSaveEmail()}
            disabled={emailSaving || !nextEmail.trim() || !emailPass}
          >
            {emailSaving ? '변경 중…' : MSG.changeEmail}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={passModalOpen} onClose={closePassModal} size="sm">
        <Text variant="headingMd" as="h2">
          {MSG.passModalTitle}
        </Text>
        <p className={styles.sectionDesc} style={{ marginTop: 8 }}>
          {MSG.passModalDesc}
        </p>
        <div className={styles.modalFieldStack}>
          <div className={styles.modalField}>
            <span className={styles.fieldLabel}>{MSG.currentPassLabel}</span>
            <input
              className={styles.input}
              type="password"
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <div className={styles.modalField}>
            <span className={styles.fieldLabel}>{MSG.passwordNew}</span>
            <input
              className={styles.input}
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              autoComplete="new-password"
              minLength={8}
            />
          </div>
          <div className={styles.modalField}>
            <span className={styles.fieldLabel}>{MSG.passwordConfirm}</span>
            <input
              className={styles.input}
              type="password"
              value={newPassConfirm}
              onChange={(e) => setNewPassConfirm(e.target.value)}
              autoComplete="new-password"
              minLength={8}
            />
          </div>
          {passError ? <p className={styles.errorText}>{passError}</p> : null}
        </div>
        <div className={styles.modalActions}>
          <Button variant="ghost" size="md" fullWidth onClick={closePassModal} disabled={passSaving}>
            {MSG.cancel}
          </Button>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => void onChangePassword()}
            disabled={!passValid}
          >
            {passSaving ? '변경 중…' : MSG.changePassword}
          </Button>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={withdrawStep === 'confirm'}
        onClose={closeWithdraw}
        onConfirm={() => setWithdrawStep('password')}
        title={MSG.withdrawStep1Title}
        descriptions={[...MSG.withdrawStep1Desc]}
        confirmLabel={MSG.withdrawContinue}
        confirmVariant="danger"
      />

      <Modal isOpen={withdrawStep === 'password'} onClose={closeWithdraw} size="sm">
        <Text variant="headingMd" as="h2">
          {MSG.withdrawStep2Title}
        </Text>
        <p className={styles.sectionDesc} style={{ marginTop: 8 }}>
          {MSG.withdrawStep2Desc}
        </p>
        <div className={styles.modalFieldStack}>
          <div className={styles.modalField}>
            <span className={styles.fieldLabel}>{MSG.currentPassLabel}</span>
            <input
              className={styles.input}
              type="password"
              value={withdrawPass}
              onChange={(e) => setWithdrawPass(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {withdrawError ? <p className={styles.errorText}>{withdrawError}</p> : null}
        </div>
        <div className={styles.modalActions}>
          <Button variant="ghost" size="md" fullWidth onClick={closeWithdraw} disabled={withdrawSubmitting}>
            {MSG.cancel}
          </Button>
          <Button
            variant="danger"
            size="md"
            fullWidth
            onClick={() => void onWithdraw()}
            disabled={!withdrawPass || withdrawSubmitting}
          >
            {withdrawSubmitting ? '처리 중…' : MSG.withdrawAction}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
