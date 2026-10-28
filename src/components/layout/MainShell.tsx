'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/common/Sidebar'
import { ToastContainer } from '@/components/common/Toast'
import UserInitializer from '@/components/common/UserInitializer'
import AttendanceFloatingBarHost from '@/components/attendance/AttendanceFloatingBarHost'
import WhatsNewModalHost from '@/components/whats-new/WhatsNewModal/WhatsNewModalHost'
import { useUiStore } from '@/stores/uiStore'
import { useAttendanceSessionStore } from '@/stores/attendanceSessionStore'
import { isLessonDetailPath } from '@/lib/mobileNav'
import BottomNav from './BottomNav'
import MobileTopBar from './MobileTopBar'
import MoreSheet from './MoreSheet'
import { mainStyle, shellStyle } from './MainShell.css'

export default function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ''
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed)
  const hydrateSidebar = useUiStore((s) => s.hydrateSidebar)
  const attendanceActive = useAttendanceSessionStore((s) => Boolean(s.active))
  const [moreOpen, setMoreOpen] = useState(false)

  useEffect(() => {
    hydrateSidebar()
  }, [hydrateSidebar])

  useEffect(() => {
    setMoreOpen(false)
  }, [pathname])

  return (
    <div
      className={shellStyle}
      data-sidebar-collapsed={sidebarCollapsed ? 'true' : 'false'}
      data-lesson-footer={isLessonDetailPath(pathname) ? 'true' : 'false'}
      data-attendance-bar={attendanceActive ? 'true' : 'false'}
    >
      <UserInitializer />
      <Sidebar />
      <MobileTopBar />
      <main className={mainStyle}>{children}</main>
      <BottomNav moreOpen={moreOpen} onMoreToggle={() => setMoreOpen((v) => !v)} />
      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
      <ToastContainer />
      <AttendanceFloatingBarHost />
      <WhatsNewModalHost />
    </div>
  )
}
