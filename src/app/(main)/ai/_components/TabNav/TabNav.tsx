'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as styles from './TabNav.css'

interface TabItem {
  href: string
  label: string
  isNew?: boolean
}

const TABS: TabItem[] = [
  { href: '/ai', label: '학생별 위험도', isNew: true },
  { href: '/ai/settings', label: '조교 설정' },
]

function isActive(pathname: string, href: string): boolean {
  if (href === '/ai') return pathname === '/ai'
  return pathname.startsWith(href)
}

export default function TabNav() {
  const pathname = usePathname()
  return (
    <nav className={styles.wrap}>
      {TABS.map((t) => {
        const active = isActive(pathname, t.href)
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`${styles.tab}${active ? ` ${styles.tabActive}` : ''}`}
          >
            {t.label}
            {t.isNew && !active ? <span className={styles.newDot} /> : null}
          </Link>
        )
      })}
    </nav>
  )
}
