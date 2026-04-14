'use client'

export const dynamic = 'force-dynamic'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { lessonService } from '@/services/lesson'
import { classService } from '@/services/class'
import { useToastStore } from '@/stores/toastStore'
import TemplateSelectModal from '../_components/TemplateSelectModal/TemplateSelectModal'

function LessonNewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const classId = Number(searchParams.get('class_id'))
  const date = searchParams.get('date') ?? ''
  const isAdhoc = searchParams.get('is_adhoc') !== 'false'
  const addToast = useToastStore((s) => s.addToast)

  const handleConfirm = async (templateId: number) => {
    try {
      const classStudents = await classService.getClassStudents(classId, date)
      const lesson = await lessonService.createLesson({
        class_id: classId,
        template_id: templateId,
        lesson_date: date,
        is_adhoc: isAdhoc,
        status: 'DRAFT',
        common_data: [],
        student_data: classStudents.map((s) => ({ student_id: s.id, items: [] })),
      })
      router.push(`/lesson/${lesson.id}`)
    } catch (err: any) {
      if (err?.response?.status === 409) {
        const conflictId = err?.response?.data?.data?.id ?? err?.response?.data?.data?.lesson_record_id
        if (conflictId) {
          router.push(`/lesson/${conflictId}`)
          return
        }
        const res = await lessonService.getLessons(date)
        const existing = res.data.find((l) => l.class_id === classId)
        const existingId = existing?.lesson_record_id ?? existing?.id
        if (existingId) {
          router.push(`/lesson/${existingId}`)
          return
        }
      }
      addToast({ variant: 'error', message: '수업 생성에 실패했어요.' })
    }
  }

  return (
    <TemplateSelectModal
      isOpen={true}
      onClose={() => router.push('/lesson')}
      onConfirm={handleConfirm}
      title="템플릿 선택"
      confirmLabel="수업 입력하기"
    />
  )
}

export default function LessonNewPage() {
  return (
    <Suspense>
      <LessonNewContent />
    </Suspense>
  )
}
