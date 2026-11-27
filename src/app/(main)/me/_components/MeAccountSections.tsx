'use client'

import Button from '@/components/common/Button'
import { formatPhoneInput } from '@/lib/phone'
import type { User } from '@/types/user'
import type { EnforcedBilling } from '@/lib/billingView'
import type { BillingInvoice } from '@/services/billing'
import PencilIcon from '@/assets/icons/icon-pencil-01.svg'
import MessageIcon from '@/assets/icons/icon-message.svg'
import * as styles from '../me.css'
import { MSG } from '../_lib/meShared'
import { displayPhone } from '../_lib/meBilling'
import { MeBillingPanel } from './MeBillingPanel'

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
  enforced: EnforcedBilling | null
  invoices: BillingInvoice[]
  hasOlderInvoices?: boolean
  loadingOlderInvoices?: boolean
  onLoadOlderInvoices?: () => void
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
  enforced,
  invoices,
  hasOlderInvoices,
  loadingOlderInvoices,
  onLoadOlderInvoices,
}: MeAccountSectionsProps) {
  const noPassword = user.has_password === false

  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>프로필</h2>
        <div>
          <div className={styles.row} data-tour="me-name">
            <span className={styles.rowLabel}>{MSG.nameLabel}</span>
            {editingName ? (
              <input
                className={`${styles.input} ${styles.rowMain}`}
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                maxLength={100}
                autoComplete="name"
              />
            ) : (
              <span className={`${styles.rowValue} ${styles.rowMain}`}>{user.name}</span>
            )}
            {editingName ? null : (
              <button type="button" className={styles.iconButton} onClick={onStartEditName} aria-label="이름 수정">
                <PencilIcon width={14} height={14} />
              </button>
            )}
          </div>

          <div className={styles.row} data-tour="me-phone">
            <span className={styles.rowLabel}>{MSG.phoneLabel}</span>
            {editingName ? (
              <input
                className={`${styles.input} ${styles.rowMain}`}
                value={phone}
                onChange={(e) => onPhoneChange(formatPhoneInput(e.target.value))}
                maxLength={13}
                inputMode="tel"
                autoComplete="tel"
                placeholder="010-0000-0000"
              />
            ) : (
              <span className={`${styles.rowValue} ${styles.rowMain}`}>{displayPhone(user.phone)}</span>
            )}
            {editingName ? null : (
              <button type="button" className={styles.iconButton} onClick={onStartEditName} aria-label="전화번호 수정">
                <PencilIcon width={14} height={14} />
              </button>
            )}
          </div>

          {editingName && phoneChanged ? (
            <div className={styles.row}>
              <span className={styles.rowLabel}>{noPassword ? MSG.codeLabel : MSG.currentPassLabel}</span>
              <input
                className={`${styles.input} ${styles.rowMain}`}
                type={noPassword ? 'text' : 'password'}
                inputMode={noPassword ? 'numeric' : undefined}
                value={phoneSecret}
                onChange={(e) =>
                  onPhoneSecretChange(noPassword ? e.target.value.replace(/\D/g, '').slice(0, 6) : e.target.value)
                }
                autoComplete={noPassword ? 'one-time-code' : 'current-password'}
              />
            </div>
          ) : null}
          {editingName && phoneChanged && noPassword ? (
            <div className={styles.editActions}>
              <Button variant="ghost" size="sm" onClick={onSendAccountCode} disabled={codeSending}>
                {codeSending ? '보내는 중…' : MSG.sendCode}
              </Button>
            </div>
          ) : null}

          <div className={styles.row}>
            <span className={styles.rowLabel}>{MSG.emailLabel}</span>
            <span className={`${styles.rowValue} ${styles.rowMain}`}>{user.email}</span>
          </div>
        </div>

        {nameError || phoneError ? <p className={styles.errorText}>{nameError || phoneError}</p> : null}

        {editingName ? (
          <div className={styles.editActions}>
            <Button variant="ghost" size="sm" onClick={onCancelEditName} disabled={nameSaving}>
              {MSG.cancel}
            </Button>
            <Button variant="primary" size="sm" onClick={onSaveName} disabled={!canSaveName}>
              {nameSaving ? '저장 중…' : MSG.save}
            </Button>
          </div>
        ) : null}
      </section>

      <MeBillingPanel
        user={user}
        enforced={enforced}
        invoices={invoices}
        hasOlder={hasOlderInvoices}
        loadingOlder={loadingOlderInvoices}
        onLoadOlder={onLoadOlderInvoices}
      />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>로그인 · 보안</h2>
        <div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>{MSG.emailLabel}</span>
            <span className={`${styles.rowValue} ${styles.rowMain}`}>{user.email}</span>
            <button type="button" className={styles.iconButton} onClick={onOpenEmailModal} aria-label="이메일 변경">
              <PencilIcon width={14} height={14} />
            </button>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>비밀번호</span>
            <span className={`${styles.rowValue} ${styles.rowMain}`}>{noPassword ? '' : '••••••••'}</span>
            <button type="button" className={styles.iconButton} onClick={onOpenPassModal} aria-label="비밀번호 변경">
              <PencilIcon width={14} height={14} />
            </button>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>알림 설정</h2>
        <div className={styles.noticeRow}>
          <MessageIcon width={18} height={18} />
          <div className={styles.noticeCopy}>
            <p className={styles.noticeTitle}>알림은 모두 알림톡으로 발송 돼요.</p>
            <p className={styles.noticeSub}>수신 번호: {displayPhone(user.phone)}</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.accountTitle}>계정</h2>
        <div className={styles.row}>
          <span className={styles.rowLabel}>{MSG.joinedLabel}</span>
          <span className={styles.rowValue}>{joinedLabel}</span>
        </div>
      </section>

      <div className={styles.dangerRow}>
        <div className={styles.dangerCopy}>
          <p className={styles.dangerTitle}>{MSG.dangerTitle}</p>
          <p className={styles.dangerDesc}>{MSG.dangerDesc}</p>
        </div>
        <button type="button" className={styles.dangerPill} onClick={onStartWithdraw}>
          {MSG.withdraw}
        </button>
      </div>
    </>
  )
}
