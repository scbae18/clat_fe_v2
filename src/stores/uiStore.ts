import { create } from 'zustand'

const STORAGE_KEY = 'sidebar-collapsed'

interface UiStore {
  sidebarCollapsed: boolean
  sidebarHydrated: boolean
  hydrateSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
}

export const useUiStore = create<UiStore>((set, get) => ({
  sidebarCollapsed: false,
  sidebarHydrated: false,
  hydrateSidebar: () => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem(STORAGE_KEY)
    set({
      sidebarCollapsed: stored === '1',
      sidebarHydrated: true,
    })
  },
  setSidebarCollapsed: (collapsed) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0')
    }
    set({ sidebarCollapsed: collapsed })
  },
  toggleSidebar: () => {
    get().setSidebarCollapsed(!get().sidebarCollapsed)
  },
}))
