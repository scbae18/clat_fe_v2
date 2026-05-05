'use client'

import { FormEvent, useMemo, useState } from 'react'
import * as styles from './ChatbotWidget.css'

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
  const [isOpen, setIsOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        '안녕하세요. CLAT 사용 도우미입니다.\n출결, 알림톡, 수업입력, 학부모 링크, 학생 대시보드 질문을 해 주세요.',
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

  return (
    <div className={styles.shell}>
      {isOpen ? (
        <div className={styles.panel} role="dialog" aria-label="CLAT 챗봇">
          <div className={styles.header}>
            <div className={styles.headerTitleWrap}>
              <span className={styles.headerTitle}>CLAT 챗봇</span>
              <span className={styles.headerSub}>선생님용 사용 도우미</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={styles.closeButton}
              aria-label="챗봇 닫기"
            >
              ×
            </button>
          </div>

          <div className={styles.messages}>
            {messages.map((msg, idx) => (
              <Bubble key={`${msg.role}-${idx}`} {...msg} />
            ))}
            {isSending ? (
              <Bubble
                role="assistant"
                content="관련 메뉴얼을 찾는 중이에요..."
              />
            ) : null}
          </div>

          <form onSubmit={onSubmit} className={styles.form}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="질문을 입력하세요. 예: 출결 코드 만료되면 어떻게 해?"
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
        aria-label="챗봇 열기"
      >
        💬 도움
      </button>
    </div>
  )
}
