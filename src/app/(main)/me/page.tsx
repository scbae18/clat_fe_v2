'use client'

import * as styles from './me.css'
import { MSG } from './_lib/meShared'
import { useMyProfile } from './_hooks/useMyProfile'
import { useBillingMe } from './_hooks/useBillingMe'
import { MeIdentityCard } from './_components/MeIdentityCard'
import { MeAccountSections } from './_components/MeAccountSections'
import { MeAccountModals } from './_components/MeAccountModals'

export default function MyProfilePage() {
  const profile = useMyProfile()
  const billing = useBillingMe()

  if (profile.loading || !profile.user) {
    return (
      <div className={styles.pageRoot}>
        <p className={styles.emptyState}>{MSG.loading}</p>
      </div>
    )
  }

  return (
    <div className={styles.pageRoot}>
      <h1 className={styles.pageTitle}>{MSG.pageTitle}</h1>
      <div className={styles.pageBody}>
        <MeIdentityCard user={profile.user} enforced={billing.enforced} billingOff={billing.billingOff} />
        <div className={styles.pageContent}>
          <MeAccountSections
            user={profile.user}
            joinedLabel={profile.joinedLabel}
            editingName={profile.editingName}
            name={profile.name}
            onNameChange={profile.setName}
            phone={profile.phone}
            onPhoneChange={profile.setPhone}
            phoneError={profile.phoneError}
            nameError={profile.nameError}
            nameSaving={profile.nameSaving}
            canSaveName={profile.canSaveName}
            phoneSecret={profile.phoneSecret}
            onPhoneSecretChange={profile.setPhoneSecret}
            phoneChanged={profile.phoneChanged}
            codeSending={profile.codeSending}
            onSendAccountCode={() => void profile.sendAccountCode()}
            onStartEditName={profile.startEditName}
            onCancelEditName={profile.cancelEditName}
            onSaveName={() => void profile.onSaveName()}
            onOpenEmailModal={profile.openEmailModal}
            onOpenPassModal={profile.openPassModal}
            onStartWithdraw={profile.startWithdraw}
            enforced={billing.enforced}
            invoices={billing.invoices}
            hasOlderInvoices={billing.hasOlderInvoices}
            loadingOlderInvoices={billing.loadingOlderInvoices}
            onLoadOlderInvoices={() => void billing.loadOlderInvoices()}
          />
        </div>
      </div>

      <MeAccountModals
        emailModalOpen={profile.emailModalOpen}
        nextEmail={profile.nextEmail}
        onNextEmailChange={profile.setNextEmail}
        emailPass={profile.emailPass}
        onEmailPassChange={profile.setEmailPass}
        emailSaving={profile.emailSaving}
        emailError={profile.emailError}
        hasPassword={profile.hasPassword}
        codeSending={profile.codeSending}
        onSendAccountCode={() => void profile.sendAccountCode()}
        onCloseEmailModal={profile.closeEmailModal}
        onSaveEmail={() => void profile.onSaveEmail()}
        passModalOpen={profile.passModalOpen}
        currentPass={profile.currentPass}
        onCurrentPassChange={profile.setCurrentPass}
        newPass={profile.newPass}
        onNewPassChange={profile.setNewPass}
        newPassConfirm={profile.newPassConfirm}
        onNewPassConfirmChange={profile.setNewPassConfirm}
        passSaving={profile.passSaving}
        passError={profile.passError}
        passValid={profile.passValid}
        onClosePassModal={profile.closePassModal}
        onChangePassword={() => void profile.onChangePassword()}
        withdrawStep={profile.withdrawStep}
        onWithdrawContinue={() => profile.setWithdrawStep('password')}
        withdrawPass={profile.withdrawPass}
        onWithdrawPassChange={profile.setWithdrawPass}
        withdrawSubmitting={profile.withdrawSubmitting}
        withdrawError={profile.withdrawError}
        onCloseWithdraw={profile.closeWithdraw}
        onWithdraw={() => void profile.onWithdraw()}
      />
    </div>
  )
}
