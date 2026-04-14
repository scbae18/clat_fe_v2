'use client'

import { useEffect, useState } from 'react'
import Modal from '@/components/common/Modal'
import Text from '@/components/common/Text'
import { colors } from '@/styles/tokens/colors'
import { studentService } from '@/services/student'
import { useToastStore } from '@/stores/toastStore'
import useDisclosure from '@/hooks/useDisclosure'
import type { StudentDetail, IncompleteItem } from '@/types/student'
import CloseIcon from '@/assets/icons/icon-close.svg'
import CheckIcon from '@/assets/icons/icon-check.svg'
import AddStudentFormModal from '../AddStudentFormModal/AddStudentFormModal'
import {
  headerStyle,
  closeButtonStyle,
  sectionStyle,
  sectionTitleStyle,
  infoLabelStyle,
  infoValueStyle,
  editButtonStyle,
  statsGridStyle,
  statCardStyle,
  statLabelStyle,
  statValueStyle,
  trackingListStyle,
  trackingItemStyle,
  trackingLabelStyle,
  completeButtonStyle,
  completeCheckIconStyle,
  scrollBodyStyle,
} from './StudentDetailModal.css'

interface StudentDetailModalProps {
  studentId: number | null
  onClose: () => void
  onUpdated?: () => void
}

export default function StudentDetailModal({
  studentId,
  onClose,
  onUpdated,
}: StudentDetailModalProps) {
  const addToast = useToastStore((s) => s.addToast)
  const [detail, setDetail] = useState<StudentDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const editStudent = useDisclosure()

  useEffect(() => {
    if (!studentId) return
    setIsLoading(true)
    setDetail(null)
    studentService
      .getStudent(studentId)
      .then(setDetail)
      .catch(() => addToast({ variant: 'error', message: '학생 정보를 불러오지 못했어요.' }))
      .finally(() => setIsLoading(false))
  }, [studentId])

  const handleComplete = async (itemId: number) => {
    try {
      await studentService.completeItem(itemId)
      setDetail((prev) =>
        prev
          ? {
              ...prev,
              incomplete_items: prev.incomplete_items.filter(
                (i) => i.lesson_student_data_id !== itemId
              ),
              stats: {
                ...prev.stats,
                total_incomplete_items: prev.stats.total_incomplete_items - 1,
                total_complete_items: prev.stats.total_complete_items + 1,

                completion_rate:
                  (prev.stats.total_complete_items + 1) /
                  (prev.stats.total_complete_items + 1 + prev.stats.total_incomplete_items - 1),
              },
            }
          : prev
      )
      addToast({ variant: 'success', message: '완료 처리됐어요.' })
      onUpdated?.()
    } catch {
      addToast({ variant: 'error', message: '완료 처리에 실패했어요.' })
    }
  }

  return (
    <>
      <Modal isOpen={!!studentId} onClose={onClose} size="md">
        {isLoading || !detail ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <Text variant="bodyMd" color="gray500">
              불러오는 중...
            </Text>
          </div>
        ) : (
          <>
            {/* 헤더 */}
            <div className={headerStyle}>
              <Text variant="headingLg" as="h2">
                {detail.name}
              </Text>
              <button className={closeButtonStyle} onClick={onClose}>
                <CloseIcon width={24} height={24} />
              </button>
            </div>

            <div className={scrollBodyStyle}>
            {/* 기본 정보 */}
            <div className={sectionStyle}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}
              >
                <Text variant="headingMd" as="h3">
                  기본 정보
                </Text>
                <button className={editButtonStyle} onClick={editStudent.open}>
                  수정
                </button>
              </div>
              <div
                style={{
                  backgroundColor: colors.gray50,
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span className={infoLabelStyle}>학생 전화번호</span>
                  <span className={infoValueStyle}>{detail.phone || '-'}</span>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span className={infoLabelStyle}>학부모 전화번호</span>
                  <span className={infoValueStyle}>{detail.parent_phone || '-'}</span>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span className={infoLabelStyle}>소속 반</span>
                  <span className={infoValueStyle}>
                    {detail.classes.map((c) => c.name).join(', ') || '-'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span className={infoLabelStyle}>학교명</span>
                  <span className={infoValueStyle}>{detail.school_name || '-'}</span>
                </div>
              </div>
            </div>

            {/* 통계 요약 */}
            <div className={sectionStyle}>
              <Text variant="headingMd" as="h3" className={sectionTitleStyle}>
                통계 요약
              </Text>
              <div className={statsGridStyle}>
                <div className={statCardStyle}>
                  <span className={statLabelStyle}>완료율</span>
                  <span className={statValueStyle} style={{ color: '#1DAA7F' }}>
                    {Math.round(detail.stats.completion_rate * 100)}%
                  </span>
                </div>
                <div className={statCardStyle}>
                  <span className={statLabelStyle}>완료</span>
                  <span className={statValueStyle}>{detail.stats.total_complete_items}개</span>
                </div>
                <div className={statCardStyle}>
                  <span className={statLabelStyle}>미완료</span>
                  <span className={statValueStyle}>{detail.stats.total_incomplete_items}개</span>
                </div>
              </div>
            </div>

            {/* 미완료 항목 */}
            <div className={sectionStyle}>
              <Text variant="headingMd" as="h3" className={sectionTitleStyle}>
                미완료 항목{' '}
                <span style={{ color: '#3B51CC' }}>{detail.incomplete_items.length}</span>
              </Text>
              <div className={trackingListStyle}>
                {detail.incomplete_items.length === 0 ? (
                  <Text variant="bodyMd" color="gray500">
                    미완료 항목이 없어요.
                  </Text>
                ) : (
                  detail.incomplete_items.map((item: IncompleteItem) => (
                    <div key={item.lesson_student_data_id} className={trackingItemStyle}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span className={trackingLabelStyle}>{item.item_name}</span>
                        <span style={{ fontSize: '12px', color: '#9492A9' }}>
                          {item.lesson_date} · {item.class_name}
                        </span>
                      </div>
                      <button
                        className={completeButtonStyle}
                        onClick={() => handleComplete(item.lesson_student_data_id)}
                      >
                        <CheckIcon width={16} height={16} className={completeCheckIconStyle} />
                        완료 처리
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
            </div>
          </>
        )}
      </Modal>

      {detail && (
        <AddStudentFormModal
          isOpen={editStudent.isOpen}
          onClose={editStudent.close}
          mode="edit"
          defaultValues={{
            name: detail.name,
            phone: detail.phone,
            parent_phone: detail.parent_phone,
            school_name: detail.school_name,
            class_ids: detail.classes.map((c) => c.id),
          }}
          onConfirm={async (data) => {
            try {
              await studentService.updateStudent(detail.id, data)
              // 수정 후 상세 다시 조회
              const updated = await studentService.getStudent(detail.id)
              setDetail(updated)
              editStudent.close()
              addToast({ variant: 'success', message: '학생 정보가 수정됐어요.' })
              onUpdated?.()
            } catch {
              addToast({ variant: 'error', message: '학생 정보 수정에 실패했어요.' })
            }
          }}
        />
      )}
    </>
  )
}
