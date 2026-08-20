'use client'

import { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns'
import Chip from '@/components/common/Chip'
import Text from '@/components/common/Text'
import WhatsNewModal from '@/components/whats-new/WhatsNewModal/WhatsNewModal'
import FlagIcon from '@/assets/icons/icon-flag.svg'
import ChevronRight from '@/assets/icons/icon-chevron-right.svg'
import { updateNotices } from '@/services/updateNotices'
import type { UpdateNotice } from '@/lib/whatsNew'
import * as homeStyles from '../../home.css'
import * as styles from './HomeUpdateSection.css'

function formatNoticeDate(value: string): string {
  const date = parseISO(value)
  if (Number.isNaN(date.getTime())) return '-'
  return format(date, 'yyyy.MM.dd')
}

export default function HomeUpdateSection() {
  const [notices, setNotices] = useState<UpdateNotice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState<UpdateNotice | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const list = await updateNotices.list()
        if (!cancelled) setNotices(list)
      } catch {
        if (!cancelled) setNotices([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section>
      <div className={homeStyles.sectionHeaderStyle}>
        <FlagIcon width={24} height={24} />
        <span className={homeStyles.sectionTitleStyle}>업데이트 소식</span>
      </div>

      {isLoading ? (
        <p className={styles.loading}>업데이트 소식을 불러오는 중…</p>
      ) : notices.length === 0 ? (
        <div className={styles.empty}>
          <Text as="p" variant="bodyMd" color="gray500">
            아직 등록된 업데이트가 없어요.
          </Text>
        </div>
      ) : (
        <ul className={styles.list}>
          {notices.map((notice) => (
            <li key={notice.id}>
              <button
                type="button"
                className={styles.row}
                onClick={() => setSelected(notice)}
              >
                <Chip
                  variant="active"
                  label={formatNoticeDate(notice.created_at)}
                  className={styles.dateChip}
                />
                <div className={styles.rowBody}>
                  <Text as="p" variant="titleMd" className={styles.rowTitle}>
                    {notice.title}
                  </Text>
                  <Text as="p" variant="bodyMd" color="gray500" className={styles.rowSubtitle}>
                    {notice.subtitle}
                  </Text>
                </div>
                <span className={styles.chevron}>
                  <ChevronRight width={20} height={20} />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <WhatsNewModal
        isOpen={Boolean(selected)}
        content={selected}
        confirmLabel="닫기"
        onClose={() => setSelected(null)}
      />
    </section>
  )
}
