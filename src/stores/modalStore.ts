import { create } from 'zustand'

interface ModalStore {
  openCount: number
  registerOpen: () => void
  registerClose: () => void
}

export const useModalStore = create<ModalStore>((set) => ({
  openCount: 0,
  registerOpen: () => set((s) => ({ openCount: s.openCount + 1 })),
  registerClose: () => set((s) => ({ openCount: Math.max(0, s.openCount - 1) })),
}))
