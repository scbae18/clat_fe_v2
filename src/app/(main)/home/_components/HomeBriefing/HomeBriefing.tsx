'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CheckIcon from '@/assets/icons/icon-check.svg'
import StarIcon from '@/assets/icons/icon-star.svg'
import Text from '@/components/common/Text'
import { listItemRowStyle } from '@/components/common/styles/listItem.css'
import { homeService } from '@/services/home'
import type { BriefingItem } from '@/types/home'
import { briefingGreeting } from './briefingGreeting'
import * as styles from './HomeBriefing.css'

export default function HomeBriefing() {
  const router = useRouter()
  const [items, setItems] = useState<BriefingItem[]>([])
  const [briefingDate, setBriefingDate] = useState('')
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const greeting = briefingGreeting()

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const result = await homeService.today()
        if (!cancelled) {
          setItems(result.items)
          setBriefingDate(result.date)
          setStatus('ready')
        }
      } catch {
        if (!cancelled) setStatus('error')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const openItem = (item: BriefingItem) => {
    if (item.href) router.push(item.href)
  }

  return (
    <section className={styles.card} aria-label="하루 브리핑">
      <div className={styles.greetingRow}>
        <span className={styles.spark} aria-hidden>
          <StarIcon width={16} height={16} />
        </span>
        <div className={styles.greetingText}>
          <Text variant="headingSm" as="h2" className={styles.headingReset}>
            {greeting}
          </Text>
          {briefingDate ? (
            <Text variant="labelSm" color="gray500">
              {briefingDateLabel(briefingDate)}
            </Text>
          ) : null}
        </div>
      </div>
      {status === 'loading' ? (
        <Text variant="labelSm" color="gray500" as="p" className={styles.note}>
          불러오는 중
        </Text>
      ) : null}
      {status === 'error' ? (
        <Text variant="labelSm" color="error500" as="p" className={styles.note}>
          하루 브리핑을 불러오지 못했어요.
        </Text>
      ) : null}
      {status === 'ready' && items.length === 0 ? (
        <Text variant="labelSm" color="gray500" as="p" className={styles.note}>
          오늘 할 일을 모두 마쳤어요
        </Text>
      ) : null}
      {status === 'ready' && items.length > 0 ? (
        <ul className={styles.list}>
          {items.map((item) => (
            <li
              key={`${item.kind}-${item.lesson_id ?? ''}-${item.class_id ?? ''}-${item.event_id ?? ''}`}
              className={item.href ? `${listItemRowStyle} ${styles.row}` : listItemRowStyle}
              onClick={item.href ? () => openItem(item) : undefined}
            >
              <span className={styles.mark} aria-hidden>
                <CheckIcon width={14} height={14} />
              </span>
              <Text variant="bodyMd" color="gray900" className={styles.title}>
                {item.title}
              </Text>
              {item.sub && item.sub !== item.action_label ? (
                <Text variant="labelSm" color="gray500" className={styles.meta}>
                  {item.sub}
                </Text>
              ) : null}
              {item.action_label ? (
                <button
                  type="button"
                  className={styles.action}
                  onClick={(event) => {
                    event.stopPropagation()
                    openItem(item)
                  }}
                >
                  {item.action_label}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}

function briefingDateLabel(date: string): string {
  const [year, month, day] = date.split('-')
  if (!year || !month || !day) return date
  return `${year}년 ${Number(month)}월 ${Number(day)}일`
}
