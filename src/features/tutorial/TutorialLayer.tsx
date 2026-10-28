'use client'

import { useEffect, useState } from 'react'
import type { TutorialBeat } from './tutorialSteps'
import * as styles from './tutorial.css'

interface TutorialLayerProps {
  beat: TutorialBeat
  stepLabel: string
  onNext: () => void
  onSkip: () => void
  onClose: () => void
  onReopen: () => void
}

export function TutorialLayer({ beat, stepLabel, onNext, onSkip, onClose, onReopen }: TutorialLayerProps) {
  const [rect, setRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    let scrolled = false
    const measure = () => {
      const element = document.querySelector(`[data-tour="${beat.anchor}"]`)
      if (!(element instanceof HTMLElement)) {
        setRect(null)
        return
      }
      if (!scrolled) {
        element.scrollIntoView({ block: 'nearest', inline: 'nearest' })
        scrolled = true
      }
      setRect(element.getBoundingClientRect())
    }
    measure()
    const timer = window.setInterval(measure, 400)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [beat.anchor])

  useEffect(() => {
    if (beat.mode !== 'click') return
    const onClick = (event: MouseEvent) => {
      const element = document.querySelector(`[data-tour="${beat.anchor}"]`)
      if (!(element instanceof HTMLElement)) return
      const target = event.target
      if (!(target instanceof Node) || !element.contains(target)) return
      onNext()
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [beat.anchor, beat.mode, onNext])

  const placeAbove = rect ? rect.bottom + 190 > window.innerHeight && rect.top > 200 : false
  const tooltipTop = rect ? (placeAbove ? Math.max(16, rect.top - 170) : rect.bottom + 12) : 0
  const tooltipLeft = rect ? Math.min(Math.max(16, rect.left), window.innerWidth - 336) : 16

  if (!rect) {
    return (
      <div className={styles.fallback} role="dialog" aria-label={beat.title}>
        <p className={styles.tooltipTitle}>{beat.title}</p>
        <p className={styles.tooltipBody}>화면에서 버튼을 찾는 중이에요.</p>
        <div className={styles.tooltipActions}>
          <button type="button" className={styles.textButton} onClick={onClose}>닫기</button>
          {beat.allowSkip ? (
            <button type="button" className={styles.textButton} onClick={onSkip}>나중에 확인</button>
          ) : null}
          <button type="button" className={styles.primaryButton} onClick={onReopen}>다시 열기</button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className={styles.spotlight}
        style={{ top: rect.top - 6, left: rect.left - 6, width: rect.width + 12, height: rect.height + 12 }}
      />
      <div
        className={styles.tooltip}
        role="dialog"
        aria-label={beat.title}
        style={{ top: tooltipTop, left: tooltipLeft }}
      >
        <p className={styles.tooltipNote}>{stepLabel}</p>
        <p className={styles.tooltipTitle}>{beat.title}</p>
        <p className={styles.tooltipBody}>{beat.body}</p>
        {beat.note ? <p className={styles.tooltipNote}>{beat.note}</p> : null}
        <div className={styles.tooltipActions}>
          <button type="button" className={styles.textButton} onClick={onClose}>닫기</button>
          {beat.allowSkip ? (
            <button type="button" className={styles.textButton} onClick={onSkip}>나중에 확인</button>
          ) : null}
          {beat.mode === 'next' ? (
            <button type="button" className={styles.primaryButton} onClick={onNext}>다음</button>
          ) : null}
        </div>
      </div>
    </>
  )
}
