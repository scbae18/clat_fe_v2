'use client'

import Button from '@/components/common/Button'
import { formatPhoneInput } from '@/lib/phone'
import type { User } from '@/types/user'
import * as styles from '../me.css'
import { MSG, initialFrom } from '../_lib/meShared'

type MeAccountSectionsProps = {
  user: User
  joinedLabel: string
  editingName: boolean
  name: string
  onNameChange: (value: string) => void
  phone: string
  onPhoneChange: (value: string) => void
  phoneError: string | null
  nameError: string | null
  nameSaving: boolean
  canSaveName: boolean
  phoneSecret: string
  onPhoneSecretChange: (value: string) => void
  phoneChanged: boolean
  codeSending: boolean
  onSendAccountCode: () => void
  onStartEditName: () => void
  onCancelEditName: () => void
  onSaveName: () => void
  onOpenEmailModal: () => void
  onOpenPassModal: () => void
  onStartWithdraw: () => void
}

export function MeAccountSections({
  user,
  joinedLabel,
  editingName,
  name,
  onNameChange,
  phone,
  onPhoneChange,
  phoneError,
  nameError,
  nameSaving,
  canSaveName,
  phoneSecret,
  onPhoneSecretChange,
  phoneChanged,
  codeSending,
  onSendAccountCode,
  onStartEditName,
  onCancelEditName,
  onSaveName,
  onOpenEmailModal,
  onOpenPassModal,
  onStartWithdraw,
}: MeAccountSectionsProps) {
  return (
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
            <Button variant="ghost" size="sm" onClick={onStartEditName}>
              {MSG.edit}
            </Button>
          ) : null}
        </div>

        <div className={styles.fieldGrid} data-tour="me-name">
          <span className={styles.fieldLabel}>{MSG.nameLabel}</span>
          {editingName ? (
            <input
              className={styles.input}
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              maxLength={100}
              autoComplete="name"
            />
          ) : (
            <span className={styles.fieldValue}>{user.name}</span>
          )}
        </div>

        <div className={styles.fieldGrid} data-tour="me-phone">
          <span className={styles.fieldLabel}>{MSG.phoneLabel}</span>
          {editingName ? (
            <input
              className={styles.input}
              value={phone}
              onChange={(e) => onPhoneChange(formatPhoneInput(e.target.value))}
              maxLength={13}
              inputMode="tel"
              autoComplete="tel"
              placeholder="010-0000-0000"
            />
          ) : (
            <span className={styles.fieldValue}>{user.phone || MSG.phoneEmpty}</span>
          )}
        </div>

        {editingName && phoneChanged ? (
          <div className={styles.fieldGrid}>
            <span className={styles.fieldLabel}>{user.has_password === false ? MSG.codeLabel : MSG.currentPassLabel}</span>
            <input
              className={styles.input}
              type={user.has_password === false ? 'text' : 'password'}
              inputMode={user.has_password === false ? 'numeric' : undefined}
              value={phoneSecret}
              onChange={(e) => onPhoneSecretChange(user.has_password === false ? e.target.value.replace(/\D/g, '').slice(0, 6) : e.target.value)}
              autoComplete={user.has_password === false ? 'one-time-code' : 'current-password'}
            />
          </div>
        ) : null}
        {editingName && phoneChanged && user.has_password === false ? (
          <div className={styles.actionsRow}>
            <Button variant="ghost" size="sm" onClick={onSendAccountCode} disabled={codeSending}>
              {codeSending ? '보내는 중…' : MSG.sendCode}
            </Button>
          </div>
        ) : null}

        {nameError || phoneError ? (
          <p className={styles.errorText}>{nameError || phoneError}</p>
        ) : null}

        {editingName ? (
          <div className={styles.actionsRow}>
            <Button variant="ghost" size="sm" onClick={onCancelEditName} disabled={nameSaving}>
              {MSG.cancel}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onSaveName}
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
            <p className={styles.sectionDesc}>
              {user.has_password === false
                ? '로그인에 쓰는 이메일이에요. 바꿀 때 인증번호로 확인할게요.'
                : MSG.loginDesc}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onOpenEmailModal}>
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
            <p className={styles.sectionDesc}>
              {user.has_password === false
                ? '비밀번호가 없어요. 비밀번호 찾기에서 만들 수 있어요.'
                : MSG.securityDesc}
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={onOpenPassModal}>
            {user.has_password === false ? '비밀번호 만들기' : MSG.changePassword}
          </Button>
        </div>
      </section>

      <section className={styles.dangerCard}>
        <div className={styles.sectionHead}>
          <div>
            <h2 className={styles.dangerTitle}>{MSG.dangerTitle}</h2>
            <p className={styles.sectionDesc}>{MSG.dangerDesc}</p>
          </div>
          <Button variant="deleteClass" size="sm" onClick={onStartWithdraw}>
            {MSG.withdraw}
          </Button>
        </div>
      </section>
    </div>
  )
}
