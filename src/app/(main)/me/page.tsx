'use client'

import * as styles from './me.css'
import { MSG } from './_lib/meShared'
import { useMyProfile } from './_hooks/useMyProfile'
import { MeAccountSections } from './_components/MeAccountSections'
import { MeAccountModals } from './_components/MeAccountModals'

export default function MyProfilePage() {
  const profile = useMyProfile()

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
      <p className={styles.pageDesc}>{MSG.pageDesc}</p>

      <MeAccountSections
        user={profile.user}
        joinedLabel={profile.joinedLabel}
        editingName={profile.editingName}
        name={profile.name}
        onNameChange={profile.setName}
        nameError={profile.nameError}
        nameSaving={profile.nameSaving}
        canSaveName={profile.canSaveName}
        onStartEditName={profile.startEditName}
        onCancelEditName={profile.cancelEditName}
        onSaveName={() => void profile.onSaveName()}
        onOpenEmailModal={profile.openEmailModal}
        onOpenPassModal={profile.openPassModal}
        onStartWithdraw={profile.startWithdraw}
      />

      <MeAccountModals
        emailModalOpen={profile.emailModalOpen}
        nextEmail={profile.nextEmail}
        onNextEmailChange={profile.setNextEmail}
        emailPass={profile.emailPass}
        onEmailPassChange={profile.setEmailPass}
        emailSaving={profile.emailSaving}
        emailError={profile.emailError}
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
