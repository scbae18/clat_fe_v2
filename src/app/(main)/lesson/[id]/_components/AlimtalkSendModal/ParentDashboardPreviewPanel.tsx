'use client'

import Text from '@/components/common/Text'
import Button from '@/components/common/Button'
import type { ParentPreviewResult } from '@/services/lesson'
import type { ParentDashboardData } from '@/services/parentDashboard'
import ParentDashboardView from '@/app/parent/_components/ParentDashboardView'
import * as styles from './AlimtalkSendModal.css'

function toDashboardData(preview: ParentPreviewResult): ParentDashboardData {
  return {
    student_name: preview.student_name,
    class_name: preview.class_name,
    academy_name: preview.academy_name,
    lesson_date: preview.lesson_date,
    lesson_summary: preview.lesson_summary,
    ai_feedback: preview.ai_feedback,
    ai_feedback_status: preview.ai_feedback_status,
    incomplete_items: preview.incomplete_items ?? [],
    recent_lessons: preview.recent_lessons ?? [],
  }
}

interface ParentDashboardPreviewPanelProps {
  preview: ParentPreviewResult | null
  loading: boolean
  regenerating: boolean
  onRegenerate: () => void
}

export default function ParentDashboardPreviewPanel({
  preview,
  loading,
  regenerating,
  onRegenerate,
}: ParentDashboardPreviewPanelProps) {
  const showRegenerate = Boolean(
    preview && (preview.stale || preview.ai_feedback_status !== 'pending'),
  )

  if (loading && !preview) {
    return (
      <Text variant="bodyMd" color="gray500">
        불러오는 중…
      </Text>
    )
  }

  if (!preview) {
    return (
      <Text variant="bodyMd" color="gray500">
        학생을 선택하면 학부모가 볼 화면이 나와요.
      </Text>
    )
  }

  return (
    <div>
      {preview.stale ? (
        <div className={styles.staleBanner}>
          <Text variant="titleSm" color="gray900">
            수업 입력이 바뀌었어요
          </Text>
          <Text variant="bodyMd" color="gray700">
            학부모가 볼 피드백을 다시 만들 수 있어요. 그대로 보내면 보낸 뒤 새로 만들어져요.
          </Text>
        </div>
      ) : null}
      <ParentDashboardView
        data={toDashboardData(preview)}
        embed
        feedbackExtra={
          showRegenerate ? (
            <Button
              variant="outlined"
              size="sm"
              onClick={onRegenerate}
              disabled={regenerating}
            >
              {regenerating ? '다시 만드는 중…' : '다시 만들기'}
            </Button>
          ) : null
        }
      />
    </div>
  )
}
