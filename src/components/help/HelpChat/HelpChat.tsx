'use client'

import { FormEvent, useEffect, useRef, useState, type RefObject } from 'react'
import Link from 'next/link'
import { isAxiosError } from '@/lib/api/http'
import { askHelpChat, helpPagePath, type HelpChatLink } from '@/services/helpChat'
import CloseIcon from '@/assets/icons/icon-close.svg'
import LogoMark from '@/assets/logo/logo-mark.svg'
import LogoAiAssistant from '@/assets/logo/logo-ai-assistant.svg'
import SendIcon from '@/assets/icons/icon-chevron-right.svg'
import * as styles from './HelpChat.css'

interface Turn {
  id: number
  role: 'user' | 'assistant'
  content: string
  links: HelpChatLink[]
  stream: boolean
}

const FAIL = '지금은 답변을 만들지 못했어요. 잠시 후 다시 물어봐 주세요.'

const SUGGESTIONS = [
  '피드백 설정은 어떻게 하나요',
  '알림톡은 어디서 보내나요',
  '수업 문자는 어떻게 예약하나요',
]

function messageFromError(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response?.status === 429) {
      return '질문을 너무 자주 보냈어요. 잠시 후 다시 물어봐 주세요.'
    }
    const data = error.response?.data as { error?: { message?: string } } | undefined
    if (data?.error?.message) return data.error.message
  }
  return FAIL
}

function emphasisParts(text: string): Array<{ text: string; bold: boolean }> {
  const parts: Array<{ text: string; bold: boolean }> = []
  const pattern = /\*\*([^*\n]+)\*\*/g
  let last = 0
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0
    if (index > last) {
      parts.push({ text: text.slice(last, index).replaceAll('**', ''), bold: false })
    }
    parts.push({ text: match[1], bold: true })
    last = index + match[0].length
  }
  if (last < text.length) {
    parts.push({ text: text.slice(last).replaceAll('**', ''), bold: false })
  }
  return parts.filter((part) => part.text.length > 0)
}

function visibleLength(text: string): number {
  return emphasisParts(text).reduce((sum, part) => sum + part.text.length, 0)
}

function useTypewriter(text: string, active: boolean) {
  const total = visibleLength(text)
  const [count, setCount] = useState(active ? 0 : total)

  useEffect(() => {
    if (!active) {
      setCount(total)
      return
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || total === 0) {
      setCount(total)
      return
    }
    setCount(0)
    const step = total > 240 ? 2 : 1
    const timer = window.setInterval(() => {
      setCount((current) => {
        const next = Math.min(total, current + step)
        if (next >= total) window.clearInterval(timer)
        return next
      })
    }, 22)
    return () => window.clearInterval(timer)
  }, [active, text, total])

  return { count, done: count >= total }
}

function AssistantMessage({
  turn,
  logRef,
  onStreamDone,
}: {
  turn: Turn
  logRef: RefObject<HTMLDivElement | null>
  onStreamDone: (id: number) => void
}) {
  const { count, done } = useTypewriter(turn.content, turn.stream)
  let left = count
  const reported = useRef(false)

  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [count, logRef])

  useEffect(() => {
    if (!turn.stream || !done || reported.current) return
    reported.current = true
    onStreamDone(turn.id)
  }, [done, onStreamDone, turn.id, turn.stream])

  return (
    <div className={styles.rowStyle}>
      <span className={styles.miniAvatarStyle} aria-hidden="true">
        <LogoMark width={18} height={18} />
      </span>
      <div className={styles.bubbleStyle}>
        <p className={styles.metaStyle}>AI 조교</p>
        <p className={styles.assistantTextStyle}>
          {emphasisParts(turn.content).map((part, index) => {
            if (left <= 0) return null
            const slice = part.text.slice(0, left)
            left -= slice.length
            return part.bold ? (
              <strong key={index} className={styles.emphasisStyle}>
                {slice}
              </strong>
            ) : (
              <span key={index}>{slice}</span>
            )
          })}
          {turn.stream && !done ? <span className={styles.caretStyle} aria-hidden="true" /> : null}
        </p>
        {done && turn.links.length > 0 ? (
          <div>
            <p className={styles.linkCaptionStyle}>이 화면으로 이동</p>
            <div className={styles.linkRowStyle}>
              {turn.links.map((link) => (
                <Link key={link.id} href={link.href} className={styles.linkStyle}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default function HelpChat() {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [turns, setTurns] = useState<Turn[]>([])
  const [sending, setSending] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(1)
  const epoch = useRef(0)

  function takeId() {
    const id = nextId.current
    nextId.current += 1
    return id
  }

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    const log = logRef.current
    if (!log) return
    log.scrollTop = log.scrollHeight
  }, [turns, sending, open])

  function finishStream(id: number) {
    setTurns((prev) => prev.map((turn) => (turn.id === id ? { ...turn, stream: false } : turn)))
  }

  function resetChat() {
    epoch.current += 1
    setTurns([])
    setDraft('')
    setSending(false)
  }

  async function send(text?: string) {
    const content = (text ?? draft).trim()
    if (!content || sending) return

    const ticket = epoch.current
    const history = [...turns, { role: 'user' as const, content }].slice(-6)
    setTurns((prev) => [...prev, { id: takeId(), role: 'user', content, links: [], stream: false }])
    setDraft('')
    setSending(true)
    try {
      const result = await askHelpChat({
        messages: history.map(({ role, content: line }) => ({ role, content: line })),
        pagePath: helpPagePath(),
      })
      if (epoch.current !== ticket) return
      setTurns((prev) => [
        ...prev,
        { id: takeId(), role: 'assistant', content: result.reply, links: result.links, stream: true },
      ])
    } catch (error: unknown) {
      if (epoch.current !== ticket) return
      setTurns((prev) => [
        ...prev,
        {
          id: takeId(),
          role: 'assistant',
          content: messageFromError(error),
          links: [],
          stream: true,
        },
      ])
    } finally {
      if (epoch.current === ticket) setSending(false)
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    void send()
  }

  return (
    <div className={styles.dockStyle}>
      {open ? (
        <section className={styles.panelStyle} aria-label="AI 조교">
          <header className={styles.headerStyle}>
            <div className={styles.titleBlockStyle}>
              <h2 className={styles.titleStyle}>
                <LogoAiAssistant className={styles.brandLogoStyle} aria-hidden="true" />
                <span className={styles.srOnlyStyle}>AI 조교</span>
              </h2>
            </div>
            <div className={styles.headerActionsStyle}>
              <button
                type="button"
                className={styles.resetStyle}
                disabled={turns.length === 0 && draft.trim().length === 0 && !sending}
                onClick={resetChat}
              >
                초기화
              </button>
              <button type="button" className={styles.closeStyle} aria-label="닫기" onClick={() => setOpen(false)}>
                <CloseIcon width={18} height={18} />
              </button>
            </div>
          </header>
          <div className={styles.logStyle} ref={logRef} role="log">
            {turns.length === 0 ? (
              <div className={`${styles.rowStyle} ${styles.emptyStyle}`}>
                <span className={styles.miniAvatarStyle} aria-hidden="true">
                  <LogoMark width={18} height={18} />
                </span>
                <div className={styles.bubbleStyle}>
                  <p className={styles.metaStyle}>AI 조교</p>
                  <p className={styles.assistantTextStyle}>
                    안녕하세요 😊 클랫 AI 조교입니다. 궁금한 점을 여쭤보세요!
                  </p>
                  <div className={styles.chipRowStyle}>
                    {SUGGESTIONS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        className={styles.chipStyle}
                        disabled={sending}
                        onClick={() => void send(prompt)}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              turns.map((turn) =>
                turn.role === 'user' ? (
                  <div key={turn.id} className={`${styles.rowStyle} ${styles.userRowStyle}`}>
                    <p className={styles.userBubbleStyle}>{turn.content}</p>
                  </div>
                ) : (
                  <AssistantMessage
                    key={turn.id}
                    turn={turn}
                    logRef={logRef}
                    onStreamDone={finishStream}
                  />
                ),
              )
            )}
            {sending ? (
              <div className={styles.rowStyle}>
                <span className={styles.miniAvatarStyle} aria-hidden="true">
                  <LogoMark width={18} height={18} />
                </span>
                <div className={styles.thinkingStyle}>
                  <span className={styles.dotsStyle} aria-hidden="true">
                    <span className={styles.dotStyle} />
                    <span className={styles.dotStyle} />
                    <span className={styles.dotStyle} />
                  </span>
                  <span className={styles.thinkingLabelStyle}>답변을 준비하고 있어요</span>
                </div>
              </div>
            ) : null}
          </div>
          <form className={styles.formStyle} onSubmit={onSubmit}>
            <textarea
              className={styles.inputStyle}
              rows={1}
              maxLength={800}
              value={draft}
              placeholder="메시지를 입력해 주세요"
              aria-label="AI 조교에게 질문"
              disabled={sending}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  void send()
                }
              }}
            />
            <button
              type="submit"
              className={styles.sendStyle}
              aria-label="보내기"
              disabled={sending || draft.trim().length === 0}
            >
              <SendIcon width={18} height={18} />
            </button>
          </form>
        </section>
      ) : null}
      <button
        type="button"
        className={`${styles.launcherStyle}${open ? ` ${styles.launcherOpenStyle}` : ''}`}
        aria-expanded={open}
        aria-label={open ? 'AI 조교 닫기' : 'AI 조교 열기'}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.launcherIconStyle} aria-hidden="true">
          <LogoMark width={16} height={16} />
        </span>
        AI 조교
      </button>
    </div>
  )
}
