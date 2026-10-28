'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import Button from '@/components/common/Button'
import Text from '@/components/common/Text'
import type { TutorialBeat } from './tutorialSteps'
import { isTutorialGateOpen, subscribeTutorialGate } from './tutorialEvents'
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
  const gateOpen = useSyncExternalStore(
    subscribeTutorialGate,
    () => (beat.gate ? isTutorialGateOpen(beat.gate) : true),
    () => !beat.gate,
  )
  const waiting = Boolean(beat.gate) && !gateOpen

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

  const actions = (
    <div className={styles.tooltipActions}>
      <Button variant="ghost" size="sm" onClick={onClose}>
        닫기
      </Button>
      {beat.allowSkip ? (
        <Button variant="ghost" size="sm" onClick={onSkip}>
          나중에 확인
        </Button>
      ) : null}
      {rect && beat.mode === 'next' ? (
        <Button variant="primary" size="sm" onClick={onNext} disabled={waiting}>
          {waiting ? '준비 중' : '다음'}
        </Button>
      ) : null}
      {!rect ? (
        <Button variant="primary" size="sm" onClick={onReopen}>
          다시 열기
        </Button>
      ) : null}
    </div>
  )

  const placeAbove = rect ? rect.bottom + 190 > window.innerHeight && rect.top > 200 : false
  const tooltipTop = rect ? (placeAbove ? Math.max(16, rect.top - 170) : rect.bottom + 12) : 0
  const tooltipLeft = rect ? Math.min(Math.max(16, rect.left), window.innerWidth - 336) : 16

  if (!rect) {
    return (
      <div className={styles.fallback} role="dialog" aria-label={beat.title}>
        <Text variant="titleMd" as="p" className={styles.plainText}>
          {beat.title}
        </Text>
        <Text variant="bodyMd" color="gray700" as="p" className={styles.plainText}>
          화면에서 버튼을 찾는 중이에요.
        </Text>
        {actions}
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
        <Text variant="labelSm" color="gray600" as="p" className={styles.plainText}>
          {stepLabel}
        </Text>
        <Text variant="titleMd" as="p" className={styles.plainText}>
          {beat.title}
        </Text>
        <Text variant="bodyMd" color="gray700" as="p" className={styles.plainText}>
          {beat.body}
        </Text>
        {beat.note ? (
          <Text variant="labelSm" color="gray600" as="p" className={styles.plainText}>
            {beat.note}
          </Text>
        ) : null}
        {actions}
      </div>
    </>
  )
}
