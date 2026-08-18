'use client'

import {
  LESSON_ALIMTALK_CTA_LABEL,
  LESSON_ALIMTALK_FRAME_FOOTER,
} from '@/lib/lessonAlimtalkFrame'
import * as styles from './LessonAlimtalkFramePreview.css'

function FrameLine({ text, highlightVars }: { text: string; highlightVars: boolean }) {
  if (!highlightVars) {
    return <p className={styles.frameText}>{text}</p>
  }

  const parts = text.split(/(\{[^}]+\})/g)
  return (
    <p className={styles.frameText}>
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
      <FrameLine text={header} highlightVars={highlightVars} />
      <p className={styles.bodyText}>{body.trim() ? body : emptyBodyFallback}</p>
      <FrameLine text={LESSON_ALIMTALK_FRAME_FOOTER} highlightVars={highlightVars} />
      <div className={styles.cta}>{LESSON_ALIMTALK_CTA_LABEL}</div>
    </>
  )
}
