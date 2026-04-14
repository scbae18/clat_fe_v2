'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToastStore } from '@/stores/toastStore'
import Text from '@/components/common/Text'
import AddCard from '@/components/common/AddCard'
import TemplateCard from './_components/TemplateCard/TemplateCard'
import DeleteConfirmModal from './_components/DeleteConfirmModal/DeleteConfirmModal'
import PlusCircleIcon from '@/assets/icons/icon-plus-circle.svg'
import { gridStyle } from './template.css'
import { templateService, type Template } from '@/services/template'

type DeleteTarget = {
  id: number
  title: string
  classCount: number
}

export default function TemplatePage() {
  const router = useRouter()
  const addToast = useToastStore((s) => s.addToast)
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)

  const fetchTemplates = async () => {
    try {
      const data = await templateService.getTemplates()
      setTemplates(data)
    } catch (err) {
      console.error('템플릿 목록 조회 실패', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await templateService.deleteTemplate(deleteTarget.id)
      setTemplates((prev) => prev.filter((t) => t.id !== deleteTarget.id))
      addToast({ variant: 'success', message: '템플릿이 삭제되었어요.' })
    } catch (err) {
      console.error('템플릿 삭제 실패', err)
      addToast({ variant: 'error', message: '템플릿 삭제에 실패했어요.' })
    } finally {
      setDeleteTarget(null)
    }
  }

  if (isLoading) {
    return null
  }

  return (
    <>
      <Text variant="display" as="h1">
        수업 템플릿
      </Text>
      <div className={gridStyle}>
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            id={template.id}
            title={template.name}
            classCount={template.class_count}
            classList={template.class_list.map((c) => c.name)}
            onDelete={(id) =>
              setDeleteTarget({ id, title: template.name, classCount: template.class_count })
            }
          />
        ))}
        <AddCard
          icon={<PlusCircleIcon width={36} height={36} />}
          label="템플릿 추가"
          onClick={() => router.push('/template/new')}
        />
      </div>
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        templateName={deleteTarget?.title ?? ''}
        classCount={deleteTarget?.classCount ?? 0}
      />
    </>
  )
}
