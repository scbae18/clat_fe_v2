'use client'

import Link from 'next/link'
import LogoFull from '@/assets/logo/logo-full.svg'
import * as styles from './MobileTopBar.css'

export default function MobileTopBar() {
  return (
    <header className={styles.topBarStyle}>
      <Link href="/home" className={styles.logoLinkStyle} aria-label="클랫 홈">
        <LogoFull className={styles.logoStyle} />
      </Link>
    </header>
  )
}
