'use client'

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import Text from '@/components/common/Text'
import { SENSITIVE_INFO_NOTICE } from '@/components/legal/SensitiveInfoNotice'
import * as styles from './LessonSectionHeading.css'

interface LessonSectionHeadingProps {
  title: string
}

export default function LessonSectionHeading({ title }: LessonSectionHeadingProps) {
  const titleRef = useRef<HTMLSpanElement>(null)
  const tipId = useId()
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const updatePos = () => {
    const el = titleRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const maxWidth = Math.min(360, window.innerWidth - 24)
    const x = Math.min(Math.max(12, rect.left), window.innerWidth - maxWidth - 12)
    setPos({ x, y: rect.top })
  }

  const show = () => {
    updatePos()
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const onMove = () => updatePos()
    window.addEventListener('scroll', onMove, true)
    window.addEventListener('resize', onMove)
    return () => {
      window.removeEventListener('scroll', onMove, true)
      window.removeEventListener('resize', onMove)
    }
  }, [open])

  return (
    <>
      <span
        ref={titleRef}
        className={styles.title}
        tabIndex={0}
        aria-describedby={open ? tipId : undefined}
        onMouseEnter={show}
        onMouseLeave={() => setOpen(false)}
        onFocus={show}
        onBlur={() => setOpen(false)}
      >
        <Text variant="headingMd">{title}</Text>
      </span>
      {open
        ? createPortal(
            <span
              id={tipId}
              className={styles.tooltip}
              role="tooltip"
              style={
                {
                  '--lesson-section-tip-x': `${pos.x}px`,
                  '--lesson-section-tip-y': `${pos.y}px`,
                } as CSSProperties
              }
            >
              {SENSITIVE_INFO_NOTICE}
            </span>,
            document.body,
          )
        : null}
    </>
  )
}
