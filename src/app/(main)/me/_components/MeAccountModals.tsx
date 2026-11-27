'use client'

import { useQuery } from '@tanstack/react-query'
import Text from '@/components/common/Text'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import ConfirmModal from '@/components/common/ConfirmModal'
import * as styles from '../me.css'
import { MSG, type WithdrawStep } from '../_lib/meShared'
import { isEnforcedBilling, moneyLabel } from '@/lib/billingView'
import { billingService } from '@/services/billing'

type MeAccountModalsProps = {
  emailModalOpen: boolean
  nextEmail: string
  onNextEmailChange: (v: string) => void
  emailPass: string
  onEmailPassChange: (v: string) => void
  emailSaving: boolean
  emailError: string | null
  hasPassword: boolean
  codeSending: boolean
  onSendAccountCode: () => void
  onCloseEmailModal: () => void
  onSaveEmail: () => void
  passModalOpen: boolean
  currentPass: string
  onCurrentPassChange: (v: string) => void
  newPass: string
  onNewPassChange: (v: string) => void
  newPassConfirm: string
  onNewPassConfirmChange: (v: string) => void
  passSaving: boolean
  passError: string | null
  passValid: boolean
  onClosePassModal: () => void
  onChangePassword: () => void
  withdrawStep: WithdrawStep
  onWithdrawContinue: () => void
  withdrawPass: string
  onWithdrawPassChange: (v: string) => void
  withdrawSubmitting: boolean
  withdrawError: string | null
  onCloseWithdraw: () => void
  onWithdraw: () => void
}

export function MeAccountModals({
  emailModalOpen,
  nextEmail,
  onNextEmailChange,
  emailPass,
  onEmailPassChange,
  emailSaving,
  emailError,
  hasPassword,
  codeSending,
  onSendAccountCode,
  onCloseEmailModal,
  onSaveEmail,
  passModalOpen,
  currentPass,
  onCurrentPassChange,
  newPass,
  onNewPassChange,
  newPassConfirm,
  onNewPassConfirmChange,
  passSaving,
  passError,
  passValid,
  onClosePassModal,
  onChangePassword,
  withdrawStep,
  onWithdrawContinue,
  withdrawPass,
  onWithdrawPassChange,
  withdrawSubmitting,
  withdrawError,
  onCloseWithdraw,
  onWithdraw,
}: MeAccountModalsProps) {
  const billingQuery = useQuery({
    queryKey: ['billing', 'me'],
    queryFn: () => billingService.me(),
    enabled: withdrawStep === 'confirm',
    refetchOnWindowFocus: false,
  })
  const billing = isEnforcedBilling(billingQuery.data) ? billingQuery.data : null
  const withdrawNotes: string[] = [...MSG.withdrawStep1Desc]
  if (billing?.card) {
    withdrawNotes.push('등록된 카드는 지워지고, 30일 안에 다시 로그인해도 돌아오지 않아요.')
  }
  if (billing && billing.unsettled_overage_amount > 0) {
    withdrawNotes.push(`초과 사용료 ${moneyLabel(billing.unsettled_overage_amount)}이 지금 결제돼요.`)
  }
  if (billing?.current_period_paid) {
    withdrawNotes.push('이미 낸 이번 기간 요금은 환불되지 않아요.')
  }

  return (
    <>
      <Modal isOpen={emailModalOpen} onClose={onCloseEmailModal} size="sm">
        <Text variant="headingMd" as="h2">
          {MSG.emailModalTitle}
        </Text>
        <p className={styles.sectionDesc} style={{ marginTop: 8 }}>
          {hasPassword ? MSG.emailModalDesc : MSG.emailModalDescNoPassword}
        </p>
        <div className={styles.modalFieldStack}>
          <div className={styles.modalField}>
            <span className={styles.fieldLabel}>{MSG.newEmailLabel}</span>
            <input
              className={styles.input}
              type="email"
              value={nextEmail}
              onChange={(e) => onNextEmailChange(e.target.value)}
              autoComplete="email"
              maxLength={254}
            />
          </div>
          <div className={styles.modalField}>
            <span className={styles.fieldLabel}>{hasPassword ? MSG.currentPassLabel : MSG.codeLabel}</span>
            <input
              className={styles.input}
              type={hasPassword ? 'password' : 'text'}
              inputMode={hasPassword ? undefined : 'numeric'}
              value={emailPass}
              onChange={(e) => onEmailPassChange(hasPassword ? e.target.value : e.target.value.replace(/\D/g, '').slice(0, 6))}
              autoComplete={hasPassword ? 'current-password' : 'one-time-code'}
            />
          </div>
          {!hasPassword ? (
            <Button variant="ghost" size="sm" onClick={onSendAccountCode} disabled={codeSending || emailSaving}>
              {codeSending ? '보내는 중…' : MSG.sendCode}
            </Button>
          ) : null}
          {emailError ? <p className={styles.errorText}>{emailError}</p> : null}
        </div>
        <div className={styles.modalActions}>
          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={onCloseEmailModal}
            disabled={emailSaving}
          >
            {MSG.cancel}
          </Button>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={onSaveEmail}
            disabled={emailSaving || !nextEmail.trim() || (hasPassword ? !emailPass : emailPass.length !== 6)}
          >
            {emailSaving ? '변경 중…' : MSG.changeEmail}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={passModalOpen} onClose={onClosePassModal} size="sm">
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
              onChange={(e) => onCurrentPassChange(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <div className={styles.modalField}>
            <span className={styles.fieldLabel}>{MSG.passwordNew}</span>
            <input
              className={styles.input}
              type="password"
              value={newPass}
              onChange={(e) => onNewPassChange(e.target.value)}
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
              onChange={(e) => onNewPassConfirmChange(e.target.value)}
              autoComplete="new-password"
              minLength={8}
            />
          </div>
          {passError ? <p className={styles.errorText}>{passError}</p> : null}
        </div>
        <div className={styles.modalActions}>
          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={onClosePassModal}
            disabled={passSaving}
          >
            {MSG.cancel}
          </Button>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={onChangePassword}
            disabled={!passValid}
          >
            {passSaving ? '변경 중…' : MSG.changePassword}
          </Button>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={withdrawStep === 'confirm'}
        onClose={onCloseWithdraw}
        onConfirm={onWithdrawContinue}
        title={MSG.withdrawStep1Title}
        descriptions={withdrawNotes}
        confirmLabel={MSG.withdrawContinue}
        confirmVariant="danger"
      />

      <Modal isOpen={withdrawStep === 'password'} onClose={onCloseWithdraw} size="sm">
        <Text variant="headingMd" as="h2">
          {MSG.withdrawStep2Title}
        </Text>
        <p className={styles.sectionDesc} style={{ marginTop: 8 }}>
          {hasPassword ? MSG.withdrawStep2Desc : MSG.withdrawStep2DescNoPassword}
        </p>
        <div className={styles.modalFieldStack}>
          <div className={styles.modalField}>
            <span className={styles.fieldLabel}>{hasPassword ? MSG.currentPassLabel : MSG.codeLabel}</span>
            <input
              className={styles.input}
              type={hasPassword ? 'password' : 'text'}
              inputMode={hasPassword ? undefined : 'numeric'}
              value={withdrawPass}
              onChange={(e) => onWithdrawPassChange(hasPassword ? e.target.value : e.target.value.replace(/\D/g, '').slice(0, 6))}
              autoComplete={hasPassword ? 'current-password' : 'one-time-code'}
            />
          </div>
          {!hasPassword ? (
            <Button variant="ghost" size="sm" onClick={onSendAccountCode} disabled={codeSending || withdrawSubmitting}>
              {codeSending ? '보내는 중…' : MSG.sendCode}
            </Button>
          ) : null}
          {withdrawError ? <p className={styles.errorText}>{withdrawError}</p> : null}
        </div>
        <div className={styles.modalActions}>
          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={onCloseWithdraw}
            disabled={withdrawSubmitting}
          >
            {MSG.cancel}
          </Button>
          <Button
            variant="danger"
            size="md"
            fullWidth
            onClick={onWithdraw}
            disabled={withdrawSubmitting || (hasPassword ? !withdrawPass : withdrawPass.length !== 6)}
          >
            {withdrawSubmitting ? '처리 중…' : MSG.withdrawAction}
          </Button>
        </div>
      </Modal>
    </>
  )
}
