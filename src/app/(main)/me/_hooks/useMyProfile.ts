import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

import useToast from '@/hooks/useToast'
import { auth, clearTokens } from '@/services/auth'
import { useUserStore } from '@/stores/userStore'

import {
  MSG,
  type WithdrawStep,
  extractErrorMessage,
  isValidEmail,
} from '../_lib/meShared'

export function useMyProfile() {
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
      setUser(updated)
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
      setEmailError(MSG.emailSame)
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
      setUser(null)
      toast.success(MSG.withdrawOk)
      setWithdrawStep(null)
      router.push('/login')
    } catch (e) {
      setWithdrawError(extractErrorMessage(e, MSG.genericFail))
    } finally {
      setWithdrawSubmitting(false)
    }
  }

  return {
    user,
    loading,
    joinedLabel,
    editingName,
    name,
    setName,
    nameSaving,
    nameError,
    canSaveName,
    startEditName,
    cancelEditName,
    onSaveName,
    emailModalOpen,
    nextEmail,
    setNextEmail,
    emailPass,
    setEmailPass,
    emailSaving,
    emailError,
    openEmailModal,
    closeEmailModal,
    onSaveEmail,
    passModalOpen,
    currentPass,
    setCurrentPass,
    newPass,
    setNewPass,
    newPassConfirm,
    setNewPassConfirm,
    passSaving,
    passError,
    passValid,
    openPassModal,
    closePassModal,
    onChangePassword,
    withdrawStep,
    setWithdrawStep,
    withdrawPass,
    setWithdrawPass,
    withdrawSubmitting,
    withdrawError,
    startWithdraw,
    closeWithdraw,
    onWithdraw,
  }
}
