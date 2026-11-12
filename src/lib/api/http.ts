import { isAxiosError } from 'axios'

/** Re-export so UI never imports `axios` directly (claude-code-guide). */
export { isAxiosError }

export function apiErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const data = err.response?.data as { error?: { message?: string } } | undefined
    if (data?.error?.message) return data.error.message
  }
  return fallback
}
