'use client'

import type { User } from '@/types/user'
import type { EnforcedBilling } from '@/lib/billingView'
import * as styles from '../me.css'
import { initialFrom } from '../_lib/meShared'
import { displayPhone } from '../_lib/meBilling'

type MeIdentityCardProps = {
  user: User
  enforced: EnforcedBilling | null
}

export function MeIdentityCard({ user, enforced }: MeIdentityCardProps) {
  return (
    <aside className={styles.identityCard}>
      <div className={styles.identityAvatar}>{initialFrom(user.name)}</div>
      <div className={styles.identityNameBlock}>
        <p className={styles.identityName}>{user.name}</p>
        <span className={enforced ? styles.planChip : styles.planChipEmpty}>{enforced?.plan.name ?? ''}</span>
      </div>
      <div className={styles.identityContact}>
        <p>{displayPhone(user.phone)}</p>
        <p>{user.email}</p>
      </div>
    </aside>
  )
}
