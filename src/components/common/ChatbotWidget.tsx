'use client'

import { FormEvent, useMemo, useState } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import chatbotLauncherIcon from '@/assets/logo/App Icon.jpg'
import * as styles from './ChatbotWidget.css'

/** 강사용 도움말 — 학부모·출결·인증 화면에서는 미표시 */
const CHATBOT_HIDDEN_PREFIXES = ['/login', '/signup', '/parent', '/check'] as const

function shouldHideChatbot(pathname: string | null): boolean {
  if (!pathname) return false
  return CHATBOT_HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

type ChatMessage = {
  role: 'assistant' | 'user'
  content: string
}

function Bubble({ role, content }: ChatMessage) {
  const isUser = role === 'user'
  return (
    <div className={isUser ? styles.rowUser : styles.rowAssistant}>
      <div className={`${styles.bubbleBase} ${isUser ? styles.bubbleUser : styles.bubbleAssistant}`}>
        {content}
      </div>
    </div>
  )
}

export default function ChatbotWidget() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        '무엇이든 물어보세요.\n출결·알림톡·수업 입력·학생 화면까지 안내해 드려요.',
    },
  ])

  const canSend = useMemo(
    () => input.trim().length > 0 && !isSending,
    [input, isSending]
  )

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const question = input.trim()
    if (!question || isSending) return

    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: question }])
    setIsSending(true)
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })
      const json = (await res.json()) as {
        success: boolean
        data?: { answer?: string }
      }

      const answer =
        json.success && json.data?.answer
          ? json.data.answer
          : '답변 생성에 실패했어요. 잠시 후 다시 시도해 주세요.'

      setMessages((prev) => [...prev, { role: 'assistant', content: answer }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '네트워크 오류가 발생했어요. 잠시 후 다시 시도해 주세요.',
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  if (shouldHideChatbot(pathname)) return null

  return (
    <div className={styles.shell}>
      {isOpen ? (
        <div className={styles.panel} role="dialog" aria-label="도움말">
          <div className={styles.header}>
            <span className={styles.headerTitle}>도움말</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={styles.closeButton}
              aria-label="닫기"
            >
              <span className={styles.closeIcon} aria-hidden>
                ×
              </span>
            </button>
          </div>

          <div className={styles.messages}>
            {messages.map((msg, idx) => (
              <Bubble key={`${msg.role}-${idx}`} {...msg} />
            ))}
            {isSending ? (
              <Bubble role="assistant" content="잠시만요…" />
            ) : null}
          </div>

          <form onSubmit={onSubmit} className={styles.form}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="예: 출결 코드가 만료되면?"
              rows={2}
              className={styles.textarea}
            />
            <button type="submit" disabled={!canSend} className={styles.sendButton}>
              전송
            </button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        className={styles.launcher}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="도움말 열기"
      >
        <Image
          src={chatbotLauncherIcon}
          alt=""
          width={64}
          height={64}
          className={styles.launcherImage}
          priority
        />
      </button>
    </div>
  )
}
