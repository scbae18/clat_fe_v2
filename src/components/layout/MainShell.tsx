'use client'

import { useEffect } from 'react'
import Sidebar from '@/components/common/Sidebar'
import { ToastContainer } from '@/components/common/Toast'
import UserInitializer from '@/components/common/UserInitializer'
import AttendanceFloatingBarHost from '@/components/attendance/AttendanceFloatingBarHost'
import WhatsNewModalHost from '@/components/whats-new/WhatsNewModal/WhatsNewModalHost'
import { getSidebarWidth } from '@/lib/sidebar'
import { useUiStore } from '@/stores/uiStore'
import { mainStyle } from './MainShell.css'

export default function MainShell({ children }: { children: React.ReactNode }) {
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed)
  const hydrateSidebar = useUiStore((s) => s.hydrateSidebar)

  useEffect(() => {
    hydrateSidebar()
  }, [hydrateSidebar])

  const sidebarWidth = getSidebarWidth(sidebarCollapsed)

  return (
    <div style={{ display: 'flex' }}>
      <UserInitializer />
      <Sidebar />
      <main
        className={mainStyle}
        style={
          {
            marginLeft: `${sidebarWidth}px`,
            '--sidebar-width': `${sidebarWidth}px`,
          } as React.CSSProperties
        }
      >
        {children}
      </main>
      <ToastContainer />
      <AttendanceFloatingBarHost />
      <WhatsNewModalHost />
    </div>
  )
}
