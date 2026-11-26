'use client'

import type { User } from '@/types/user'
import type { EnforcedBilling } from '@/lib/billingView'
import * as styles from '../me.css'
import { initialFrom } from '../_lib/meShared'
import { displayPhone } from '../_lib/meBilling'

type MeIdentityCardProps = {
  user: User
  enforced: EnforcedBilling | null
  billingOff: boolean
}

export function MeIdentityCard({ user, enforced, billingOff }: MeIdentityCardProps) {
  const planLabel = enforced?.plan.name ?? (billingOff ? '테스터' : '')
  return (
    <aside className={styles.identityCard}>
      <div className={styles.identityAvatar}>{initialFrom(user.name)}</div>
      <div className={styles.identityNameBlock}>
        <p className={styles.identityName}>{user.name}</p>
        <span className={planLabel ? styles.planChip : styles.planChipEmpty}>{planLabel}</span>
      </div>
      <div className={styles.identityContact}>
        <p>{displayPhone(user.phone)}</p>
        <p>{user.email}</p>
      </div>
    </aside>
  )
}
