import axiosInstance from '@/lib/api/axiosInstance'

export interface HelpChatLink {
  id: string
  label: string
  href: string
}

export interface HelpChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface HelpChatData {
  reply: string
  links: HelpChatLink[]
}

/** CLAT-BE/src/help/help-links.ts 와 같은 주소만 이동 버튼으로 쓴다. */
const ALLOWED_HREFS = new Set([
  '/home',
  '/lesson',
  '/lesson/new',
  '/management',
  '/management?tab=students',
  '/template',
  '/template/new',
  '/alimtalk',
  '/alimtalk/broadcast',
  '/alimtalk/history',
  '/alimtalk/test',
  '/ai',
  '/me',
])

export function allowedHelpLinks(links: HelpChatLink[]): HelpChatLink[] {
  return links.filter((link) => ALLOWED_HREFS.has(link.href)).slice(0, 3)
}

export function helpPagePath(): string | undefined {
  if (typeof window === 'undefined') return undefined
  const raw = `${window.location.pathname}${window.location.search}`.slice(0, 200)
  return /^\/[A-Za-z0-9\-._~/?=&%]*$/.test(raw) ? raw : undefined
}

export async function askHelpChat(input: {
  messages: HelpChatMessage[]
  pagePath?: string
}): Promise<HelpChatData> {
  const { data } = await axiosInstance.post<{ success: boolean; data: HelpChatData }>('/help/chat', {
      messages: input.messages.map((message) => ({
        role: message.role,
        content: message.content.slice(0, 1200),
      })),
    ...(input.pagePath ? { page_path: input.pagePath } : {}),
  })
  return {
    reply: data.data.reply,
    links: allowedHelpLinks(data.data.links ?? []),
  }
}
