'use client'

import {
  LESSON_ALIMTALK_CTA_LABEL,
  LESSON_ALIMTALK_FRAME_FOOTER,
} from '@/lib/lessonAlimtalkFrame'
import * as styles from './LessonAlimtalkFramePreview.css'

export function AlimtalkPreviewVarText({
  text,
  highlightVars = true,
  className,
}: {
  text: string
  highlightVars?: boolean
  className?: string
}) {
  const textClass = className ?? styles.frameText
  if (!highlightVars) {
    return <p className={textClass}>{text}</p>
  }

  const parts = text.split(/(\{[^}]+\})/g)
  return (
    <p className={textClass}>
      {parts.map((part, i) =>
        part.startsWith('{') && part.endsWith('}') ? (
          <span key={i} className={styles.frameVar}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </p>
  )
}

interface LessonAlimtalkFramePreviewProps {
  header: string
  body: string
  highlightVars?: boolean
  emptyBodyFallback?: string
}

export default function LessonAlimtalkFramePreview({
  header,
  body,
  highlightVars = false,
  emptyBodyFallback = '—',
}: LessonAlimtalkFramePreviewProps) {
  return (
    <>
      <AlimtalkPreviewVarText text={header} highlightVars={highlightVars} />
      <p className={styles.bodyText}>{body.trim() ? body : emptyBodyFallback}</p>
      <AlimtalkPreviewVarText text={LESSON_ALIMTALK_FRAME_FOOTER} highlightVars={highlightVars} />
      <div className={styles.cta}>{LESSON_ALIMTALK_CTA_LABEL}</div>
    </>
  )
}
