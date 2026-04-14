'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as styles from '../alimtalkSettings.css'

export default function AlimtalkHistoryPage() {
  const pathname = usePathname()

  return (
    <div className={styles.pageRoot}>
      <h1 className={styles.pageTitle}>{'\uC54C\uB9BC\uD1A1'}</h1>

      <div className={styles.tabRow}>
        <Link
          href="/alimtalk"
          className={`${styles.tabLink} ${pathname === '/alimtalk' || pathname === '/alimtalk/' ? styles.tabActive : styles.tabInactive}`}
        >
          {'\uBB38\uC790 \uC124\uC815'}
        </Link>
        <Link
          href="/alimtalk/history"
          className={`${styles.tabLink} ${pathname.startsWith('/alimtalk/history') ? styles.tabActive : styles.tabInactive}`}
        >
          {'\uBC1C\uC1A1 \uB0B4\uC5ED'}
        </Link>
      </div>

      <p style={{ fontFamily: 'Pretendard, sans-serif', color: '#6B7280', marginTop: '24px' }}>
        {'\uBC1C\uC1A1 \uB0B4\uC5ED \uBAA9\uB85D\uC740 \uCD94\uD6C4 \uC5F0\uB3D9 \uC608\uC815\uC785\uB2C8\uB2E4.'}
      </p>
    </div>
  )
}
