'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  HeartPulse,
  GraduationCap,
  MessageSquare,
  Shield,
  Megaphone,
} from 'lucide-react'
import LogoSymbol from '@/assets/logo/logo-symbol.svg'
import * as styles from '../admin.css'

const NAV = [
  { href: '/admin', label: '대시보드', icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: '선생님', icon: Users },
  { href: '/admin/classes', label: '반 & 학생', icon: GraduationCap },
  { href: '/admin/lessons', label: '수업 기록', icon: BookOpen },
  { href: '/admin/alimtalk', label: '알림톡', icon: MessageSquare },
  { href: '/admin/updates', label: '업데이트 모달', icon: Megaphone },
  { href: '/admin/health', label: '헬스체크', icon: HeartPulse },
] as const

function isActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brandWrap}>
        <Link href="/admin" className={styles.brandLink} aria-label="CLAT 관리자 홈">
          <LogoSymbol width={32} height={32} aria-hidden />
          <div>
            <p className={styles.brandTitle}>CLAT</p>
            <p className={styles.brandSub}>관리자</p>
          </div>
        </Link>
      </div>
      <nav className={styles.nav}>
        {NAV.map((item) => {
          const active = isActive(pathname, item.href, 'exact' in item ? item.exact : false)
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href} className={styles.navLink[active ? 'active' : 'idle']}>
              <Icon size={20} strokeWidth={active ? 2.25 : 2} />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className={styles.sidebarFooter}>
        <div className={styles.footerLabel}>
          <Shield size={16} strokeWidth={2} />
          <span className={styles.footerLabelText}>내부 운영</span>
        </div>
        <p className={styles.footerHint}>
          선생님 앱 메뉴에는 노출되지 않습니다. 허용된 계정만 접근할 수 있습니다.
        </p>
        <Link href="/home" className={styles.teacherAppLink}>
          선생님 앱으로
        </Link>
      </div>
    </aside>
  )
}
