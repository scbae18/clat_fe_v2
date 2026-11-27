'use client'

import { useSyncExternalStore } from 'react'
import Modal from '@/components/common/Modal'
import Text from '@/components/common/Text'
import { billingProgress } from '@/lib/billingProgress'
import * as styles from './BillingProgressHost.css'

export default function BillingProgressHost() {
  const message = useSyncExternalStore(billingProgress.subscribe, billingProgress.get, () => null)
  return (
    <Modal isOpen={message != null} onClose={() => undefined} size="sm">
      <div className={styles.box}>
        <Text variant="headingMd" as="h2">
          {message}
        </Text>
      </div>
    </Modal>
  )
}
