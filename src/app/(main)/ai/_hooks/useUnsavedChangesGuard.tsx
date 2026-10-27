'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import ConfirmModal from '@/components/common/ConfirmModal'

const LEAVE_TITLE = '저장하지 않은 변경이 있어요'
const LEAVE_BODY = '이 페이지를 나갈까요?'

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

/** 저장 전 이탈. 다른 화면, 뒤로 가기, 새로고침·창 닫기. */
export function UnsavedChangesGuard({ dirty }: { dirty: boolean }) {
  const router = useRouter()
  const dirtyRef = useRef(dirty)
  dirtyRef.current = dirty
  const pendingRef = useRef<string | null>(null)
  const [pendingHref, setPendingHref] = useState<string | null>(null)

  const closePrompt = () => {
    pendingRef.current = null
    setPendingHref(null)
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
    <ConfirmModal
      isOpen={pendingHref !== null}
      title={LEAVE_TITLE}
      descriptions={[LEAVE_BODY]}
      confirmLabel="나가기"
      cancelLabel="취소"
      onClose={closePrompt}
      onConfirm={() => {
        const href = pendingRef.current
        dirtyRef.current = false
        closePrompt()
        if (href) router.push(href)
      }}
    />
  )
}
