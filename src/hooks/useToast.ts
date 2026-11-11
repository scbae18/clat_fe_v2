import { useToastStore } from '@/stores/toastStore'

export default function useToast() {
  const addToast = useToastStore((s) => s.addToast)

  return {
    success: (message: string) => addToast({ variant: 'success', message }),
    warning: (message: string, duration?: number) =>
      addToast({ variant: 'warning', message, duration }),
    error: (message: string) => addToast({ variant: 'error', message }),
  }
}
