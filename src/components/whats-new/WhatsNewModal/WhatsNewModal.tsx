'use client'

import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import Text from '@/components/common/Text'
import type { UpdateNoticeItem } from '@/lib/whatsNew'
import * as styles from './WhatsNewModal.css'

export type WhatsNewContentProps = {
  title: string
  subtitle: string
  items: UpdateNoticeItem[]
}

export function WhatsNewContent({ title, subtitle, items }: WhatsNewContentProps) {
  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Text as="h2" variant="headingLg">
          {title}
        </Text>
        <Text as="p" variant="bodyLg" color="gray500">
          {subtitle}
        </Text>
      </div>

      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={`${item.title}-${index}`} className={styles.item}>
            <span className={styles.itemIndex} aria-hidden>
              {index + 1}
            </span>
            <div className={styles.itemBody}>
              <Text as="p" variant="titleMd">
                {item.title}
              </Text>
              <Text as="p" variant="bodyMd" color="gray500" className={styles.itemDescription}>
                {item.description}
              </Text>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function WhatsNewModal({
  isOpen,
  content,
  onClose,
}: {
  isOpen: boolean
  content: WhatsNewContentProps | null
  onClose: () => void
}) {
  if (!content) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <WhatsNewContent {...content} />
      <div className={styles.actions}>
        <Button variant="primary" size="md" fullWidth onClick={onClose}>
          확인했어요
        </Button>
      </div>
    </Modal>
  )
}
