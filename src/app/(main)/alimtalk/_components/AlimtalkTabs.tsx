'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as styles from '../alimtalkSettings.css'

const TABS = [
  { href: '/alimtalk', label: '문자 설정', match: (p: string) => p === '/alimtalk' || p === '/alimtalk/' },
  {
    href: '/alimtalk/broadcast',
    label: '전체 공지',
    match: (p: string) => p.startsWith('/alimtalk/broadcast'),
    comingSoon: true,
  },
  {
    href: '/alimtalk/history',
    label: '발송 내역',
    match: (p: string) => p.startsWith('/alimtalk/history'),
  },
] as const

export function AlimtalkTabs() {
  const pathname = usePathname()

  return (
    <div className={styles.tabRow}>
      {TABS.map((tab) =>
        'comingSoon' in tab && tab.comingSoon ? (
          <span
            key={tab.href}
            className={`${styles.tabLink} ${styles.tabComingSoon}`}
            aria-disabled="true"
          >
            {tab.label}
            <span className={styles.comingSoonTooltip} role="tooltip">
              추후 공개 예정
            </span>
          </span>
        ) : (
          <Link
            key={tab.href}
            href={tab.href}
            className={`${styles.tabLink} ${tab.match(pathname) ? styles.tabActive : styles.tabInactive}`}
          >
            {tab.label}
          </Link>
        ),
      )}
    </div>
  )
}
