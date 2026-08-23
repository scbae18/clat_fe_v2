'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import HomeIcon from '@/assets/icons/icon-home.svg'
import EditIcon from '@/assets/icons/icon-edit.svg'
import UsersIcon from '@/assets/icons/icon-users.svg'
import MoreIcon from '@/assets/icons/icon-more.svg'
import { getActivePhoneTab, PHONE_NAV_TABS } from '@/lib/mobileNav'
import * as styles from './BottomNav.css'

const TAB_ICONS = {
  home: HomeIcon,
  lesson: EditIcon,
  management: UsersIcon,
} as const

interface BottomNavProps {
  moreOpen: boolean
  onMoreToggle: () => void
}

export default function BottomNav({ moreOpen, onMoreToggle }: BottomNavProps) {
  const pathname = usePathname() ?? ''
  const active = getActivePhoneTab(pathname)
  const moreActive = active === 'more' || moreOpen

  return (
    <nav className={styles.navStyle} aria-label="모바일 메뉴">
      {PHONE_NAV_TABS.map((tab) => {
        const Icon = TAB_ICONS[tab.id]
        const isActive = active === tab.id
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`${styles.itemStyle}${isActive ? ` ${styles.itemActiveStyle}` : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon width={22} height={22} />
            {tab.label}
          </Link>
        )
      })}
      <button
        type="button"
        className={`${styles.itemStyle}${moreActive ? ` ${styles.itemActiveStyle}` : ''}`}
        aria-expanded={moreOpen}
        aria-label="더보기"
        onClick={onMoreToggle}
      >
        <MoreIcon width={22} height={22} />
        더보기
      </button>
    </nav>
  )
}
