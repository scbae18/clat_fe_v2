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
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`${styles.tabLink} ${tab.match(pathname) ? styles.tabActive : styles.tabInactive}`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
