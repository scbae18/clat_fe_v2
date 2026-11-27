type Listener = () => void

let message: string | null = null
const listeners = new Set<Listener>()

export const billingProgress = {
  get: () => message,
  show: (next: string) => {
    message = next
    listeners.forEach((listener) => listener())
  },
  clear: () => {
    message = null
    listeners.forEach((listener) => listener())
  },
  subscribe: (listener: Listener) => {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}
