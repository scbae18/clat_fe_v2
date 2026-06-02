'use client'

import { FormEvent, useEffect, useRef, useMemo, useState } from 'react'
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

const QUICK_REPLIES = [
  '출결 코드가 만료되면?',
  '알림톡 발송이 실패했어요',
  '학부모 링크 재발급하려면?',
  '수업 입력은 어떻게 해요?',
]

const WELCOME_MESSAGE = '무엇이든 물어보세요.\n출결·알림톡·수업 입력·학생 화면까지 안내해 드려요.'

type ChatMessage = {
  role: 'assistant' | 'user'
  content: string
}

function TypingIndicator() {
  return (
    <div className={styles.rowAssistant}>
      <div className={`${styles.bubbleBase} ${styles.bubbleAssistant} ${styles.typingBubble}`}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
    </div>
  )
}

function Bubble({ role, content }: ChatMessage) {
  const isUser = role === 'user'
  return (
    <div className={isUser ? styles.rowUser : styles.rowAssistant}>
      {!isUser && <div className={styles.avatarDot} aria-hidden />}
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
    { role: 'assistant', content: WELCOME_MESSAGE },
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const showQuickReplies = messages.length === 1 && !isSending

  const canSend = useMemo(
    () => input.trim().length > 0 && !isSending,
    [input, isSending]
  )

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isSending, isOpen])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }, [isOpen])

  async function sendQuestion(question: string) {
    if (!question.trim() || isSending) return

    const userMessage: ChatMessage = { role: 'user', content: question }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setIsSending(true)

    /** 히스토리에서 웰컴 메시지 제외하고 직전 대화만 전달 */
    const historyToSend = nextMessages
      .slice(1)
      .slice(0, -1)

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          history: historyToSend,
          currentPath: pathname,
        }),
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

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    await sendQuestion(input.trim())
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendQuestion(input.trim())
    }
  }

  function resetChat() {
    setMessages([{ role: 'assistant', content: WELCOME_MESSAGE }])
    setInput('')
  }

  if (shouldHideChatbot(pathname)) return null

  return (
    <div className={styles.shell}>
      {isOpen ? (
        <div className={styles.panel} role="dialog" aria-label="도움말">
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.headerAvatar} aria-hidden>
                <Image
                  src={chatbotLauncherIcon}
                  alt=""
                  width={28}
                  height={28}
                  className={styles.headerAvatarImage}
                />
              </div>
              <div>
                <div className={styles.headerTitle}>CLAT 도움말</div>
                <div className={styles.headerSubtitle}>무엇이든 물어보세요</div>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                type="button"
                onClick={resetChat}
                className={styles.iconButton}
                aria-label="대화 초기화"
                title="대화 초기화"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path
                    d="M2 8a6 6 0 1 1 1.2 3.6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M2 12V8h4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={styles.iconButton}
                aria-label="닫기"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path
                    d="M3 3l10 10M13 3L3 13"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.messages}>
            {messages.map((msg, idx) => (
              <Bubble key={`${msg.role}-${idx}`} {...msg} />
            ))}
            {showQuickReplies && (
              <div className={styles.quickReplies}>
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className={styles.quickReplyButton}
                    onClick={() => sendQuestion(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            {isSending && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={onSubmit} className={styles.form}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Enter로 전송, Shift+Enter로 줄바꿈"
              rows={2}
              className={styles.textarea}
            />
            <button type="submit" disabled={!canSend} className={styles.sendButton}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path
                  d="M15.5 9L2.5 2.5l2.8 6.5-2.8 6.5L15.5 9z"
                  fill="currentColor"
                />
              </svg>
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
