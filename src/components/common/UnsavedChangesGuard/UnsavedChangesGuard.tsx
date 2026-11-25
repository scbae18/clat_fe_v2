'use client'

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import ConfirmModal from '@/components/common/ConfirmModal'

const DEFAULT_TITLE = '저장하지 않은 변경이 있어요'
const DEFAULT_BODY = '이 페이지를 나갈까요?'

type LeaveTarget = string | 'back'

const LeaveContext = createContext<(target?: LeaveTarget) => void>(() => {})

export function useRequestLeave() {
  return useContext(LeaveContext)
}

function leavingHref(anchor: HTMLAnchorElement): string | null {
  if (anchor.target === '_blank' || anchor.hasAttribute('download')) return null
  const href = anchor.getAttribute('href')
  if (!href || href.startsWith('#')) return null
  let url: URL
  try {
    url = new URL(anchor.href, window.location.href)
  } catch {
    return null
  }
  if (url.origin !== window.location.origin) return null
  if (url.pathname === window.location.pathname && url.search === window.location.search) return null
  return `${url.pathname}${url.search}${url.hash}`
}

/** 저장 전 이탈. 뒤로 가기, 다른 화면, 새로고침·창 닫기. */
export function UnsavedChangesGuard({
  dirty,
  title = DEFAULT_TITLE,
  description = DEFAULT_BODY,
  children,
}: {
  dirty: boolean
  title?: string
  description?: string
  children?: ReactNode
}) {
  const router = useRouter()
  const dirtyRef = useRef(dirty)
  dirtyRef.current = dirty
  const pendingRef = useRef<LeaveTarget | null>(null)
  const [pendingHref, setPendingHref] = useState<LeaveTarget | null>(null)

  const closePrompt = () => {
    pendingRef.current = null
    setPendingHref(null)
  }

  const requestLeave = (target: LeaveTarget = 'back') => {
    if (!dirtyRef.current) {
      if (target === 'back') router.back()
      else router.push(target)
      return
    }
    pendingRef.current = target
    setPendingHref(target)
  }

  useEffect(() => {
    if (!dirty) return

    const returnUrl = window.location.href

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirtyRef.current) return
      event.preventDefault()
      event.returnValue = ''
    }

    const onClick = (event: MouseEvent) => {
      if (!dirtyRef.current || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest('a')
      if (!(anchor instanceof HTMLAnchorElement)) return
      const href = leavingHref(anchor)
      if (!href) return
      event.preventDefault()
      event.stopPropagation()
      pendingRef.current = href
      setPendingHref(href)
    }

    const onPopState = (event: PopStateEvent) => {
      if (!dirtyRef.current) return
      const href = `${window.location.pathname}${window.location.search}${window.location.hash}`
      if (href === `${new URL(returnUrl).pathname}${new URL(returnUrl).search}`) return
      event.stopImmediatePropagation()
      window.history.pushState({ __NA: true }, '', returnUrl)
      if (!pendingRef.current) {
        pendingRef.current = href
        setPendingHref(href)
      }
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    window.addEventListener('click', onClick, true)
    window.addEventListener('popstate', onPopState, true)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      window.removeEventListener('click', onClick, true)
      window.removeEventListener('popstate', onPopState, true)
    }
  }, [dirty])

  return (
    <LeaveContext.Provider value={requestLeave}>
      {children}
      <ConfirmModal
        isOpen={pendingHref !== null}
        title={title}
        descriptions={[description]}
        confirmLabel="나가기"
        cancelLabel="취소"
        onClose={closePrompt}
        onConfirm={() => {
          const href = pendingRef.current
          closePrompt()
          // 모달을 닫는 상태 변경과 같은 턴에 이동하면 라우터가 그 이동을 무시한다.
          window.setTimeout(() => {
            dirtyRef.current = false
            if (!href || href === 'back') router.back()
            else router.push(href)
          }, 0)
        }}
      />
    </LeaveContext.Provider>
  )
}
