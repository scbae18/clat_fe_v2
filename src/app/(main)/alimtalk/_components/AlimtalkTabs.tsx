'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TutorialReplayButton } from '@/features/tutorial/TutorialProvider'
import { screenForPath } from '@/features/tutorial/tutorialSteps'
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
  {
    href: '/alimtalk/test',
    label: '테스트',
    match: (p: string) => p.startsWith('/alimtalk/test'),
  },
] as const

export function AlimtalkTabs() {
  const pathname = usePathname()
  const screen = screenForPath(pathname)

  return (
    <div className={styles.tabRow}>
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`${styles.tabLink} ${tab.match(pathname) ? styles.tabActive : styles.tabInactive}`}
          data-tour={
            tab.href === '/alimtalk/history'
              ? 'alimtalk-tab-history'
              : tab.href === '/alimtalk/broadcast'
                ? 'alimtalk-tab-broadcast'
                : tab.href === '/alimtalk/test'
                  ? 'alimtalk-tab-test'
                  : undefined
          }
        >
          {tab.label}
        </Link>
      ))}
      <div className={styles.replaySlot}>
        {screen ? <TutorialReplayButton screen={screen} /> : null}
      </div>
    </div>
  )
}
