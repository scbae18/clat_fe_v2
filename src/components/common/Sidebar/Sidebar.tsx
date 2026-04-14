'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { auth } from '@/services/auth'
import {
  sidebarStyle,
  sidebarTopStyle,
  navStyle,
  navItemStyle,
  navItemActiveStyle,
  logoutButtonStyle,
} from './Sidebar.css'
import LogoutConfirmModal from './_components/LogoutConfirmModal'
import HomeIcon from '@/assets/icons/icon-home.svg'
import EditIcon from '@/assets/icons/icon-edit.svg'
import UsersIcon from '@/assets/icons/icon-users.svg'
import ClipboardIcon from '@/assets/icons/icon-clipboard.svg'
import MessageIcon from '@/assets/icons/icon-message.svg'
import LogoIcon from '@/assets/logo/logo-symbol.svg'
import LogoutIcon from '@/assets/icons/icon-logout.svg'

const NAV_ITEMS = [
  { href: '/home', label: '\uD648', icon: HomeIcon },
  { href: '/lesson', label: '\uC218\uC5C5 \uC785\uB825', icon: EditIcon },
  { href: '/management', label: '\uD559\uC0DD\u00B7\uBC18 \uAD00\uB9AC', icon: UsersIcon },
  { href: '/template', label: '\uC218\uC5C5 \uD15C\uD50C\uB9BF', icon: ClipboardIcon },
  { href: '/alimtalk', label: '\uC54C\uB9BC\uD1A1', icon: MessageIcon },
]

export default function Sidebar() {
  const pathname = usePathname()

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  return (
    <aside className={sidebarStyle}>
      <div className={sidebarTopStyle}>
        <LogoIcon width={32} height={32} />
      </div>
      <nav className={navStyle}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`${navItemStyle}${isActive ? ` ${navItemActiveStyle}` : ''}`}
            >
              <Icon width={20} height={20} />
              {label}
            </Link>
          )
        })}

        <button className={logoutButtonStyle} onClick={() => setIsLogoutModalOpen(true)}>
          <LogoutIcon width={20} height={20} />
          {'\uB85C\uADF8\uC544\uC6C3'}
        </button>
      </nav>

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={async () => {
          await auth.logout()
        }}
      />
    </aside>
  )
}
