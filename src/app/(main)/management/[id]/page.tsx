'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import useDisclosure from '@/hooks/useDisclosure'
import useToggleArray from '@/hooks/useToggleArray'
import Text from '@/components/common/Text'
import ClassInfoTable, { type ClassInfoField } from './_components/ClassInfoTable/ClassInfoTable'
import StudentTable from '../_components/StudentTable/StudentTable'
import DangerSection from './_components/DangerSection/DangerSection'
import { dangerRowStyle } from './_components/DangerSection/DangerSection.css'
import ArrowLeftIcon from '@/assets/icons/icon-arrow-left.svg'
import PencilIcon from '@/assets/icons/icon-pencil-01.svg'
import EnrollStudentsModal from '@/components/student/EnrollStudentsModal/EnrollStudentsModal'
import ConfirmModal from '@/components/common/ConfirmModal'
import { classService, type ClassDetail } from '@/services/class'
import { useToastStore } from '@/stores/toastStore'
import type { Student } from '@/types/student'
import { sortStudentsByNameKo } from '@/lib/sortStudents'
import { backButtonStyle } from '../management.css'
import {
  pageStyle,
  headerRowStyle,
  titleGroupStyle,
  headerActionsStyle,
  editButtonStyle,
  cancelButtonStyle,
  saveButtonStyle,
  sectionStyle,
  sectionHeaderStyle,
  rosterActionsStyle,
  selectAllButtonStyle,
  deleteStudentsButtonStyle,
  enrollButtonStyle,
} from './classDetail.css'

interface ClassDraft {
  name: string
  academyName: string
  dayOfWeek: number[]
  lessonTime: string
}

function draftFromClass(detail: ClassDetail): ClassDraft {
  return {
    name: detail.name,
    academyName: detail.academy_name,
    dayOfWeek: detail.schedules.map((schedule) => schedule.day_of_week),
    lessonTime: detail.lesson_time ?? '',
  }
}

export default function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const classId = Number(id)
  const router = useRouter()
  const addToast = useToastStore((s) => s.addToast)
  const addStudent = useDisclosure()
  const endClass = useDisclosure()
  const deleteClass = useDisclosure()

  const [classDetail, setClassDetail] = useState<ClassDetail | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [draft, setDraft] = useState<ClassDraft | null>(null)
  const [activeField, setActiveField] = useState<ClassInfoField | null>(null)
  const [removeStudentsOpen, setRemoveStudentsOpen] = useState(false)
  const {
    items: selectedStudentIds,
    toggle: toggleStudentSelect,
    set: setSelectedStudentIds,
  } = useToggleArray<number>()

  useEffect(() => {
    classService
      .getClass(classId)
      .then((data) => {
        setClassDetail(data)
        setStudents(sortStudentsByNameKo(data.students))
      })
      .catch(() => {
        addToast({ variant: 'error', message: '반 정보를 불러오지 못했어요.' })
        router.push('/management')
      })
      .finally(() => setIsLoading(false))
  }, [classId])

  const exitEdit = () => {
    setEditing(false)
    setDraft(null)
    setActiveField(null)
    setSelectedStudentIds([])
    setRemoveStudentsOpen(false)
  }

  const startEdit = () => {
    if (!classDetail) return
    setDraft(draftFromClass(classDetail))
    setActiveField(null)
    setSelectedStudentIds([])
    setEditing(true)
  }

  const handleSave = async () => {
    if (!draft) return
    const name = draft.name.trim()
    const academyName = draft.academyName.trim()
    if (!name) {
      addToast({ variant: 'error', message: '반 이름을 입력해 주세요.' })
      return
    }
    if (!academyName) {
      addToast({ variant: 'error', message: '학원명을 입력해 주세요.' })
      return
    }
    if (draft.dayOfWeek.length === 0) {
      addToast({ variant: 'error', message: '수업 요일을 선택해 주세요.' })
      return
    }
    setSaving(true)
    try {
      const updated = await classService.updateClass(classId, {
        name,
        academy_name: academyName,
        day_of_week: draft.dayOfWeek,
        lesson_time: draft.lessonTime.trim(),
      })
      setClassDetail((prev) => (prev ? { ...prev, ...updated } : prev))
      exitEdit()
      addToast({ variant: 'success', message: '반 정보가 저장됐어요.' })
    } catch {
      addToast({ variant: 'error', message: '반 정보 저장에 실패했어요.' })
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveSelected = async () => {
    if (selectedStudentIds.length === 0) return
    const removing = new Set(selectedStudentIds)
    try {
      await Promise.all([...removing].map((studentId) => classService.removeStudent(classId, studentId)))
      setStudents((prev) => prev.filter((student) => !removing.has(student.id)))
      setSelectedStudentIds([])
      addToast({ variant: 'success', message: `${removing.size}명의 학생이 제거됐어요.` })
    } catch {
      addToast({ variant: 'error', message: '학생 제거에 실패했어요.' })
      const updated = await classService.getClass(classId).catch(() => null)
      if (updated) {
        setClassDetail(updated)
        setStudents(sortStudentsByNameKo(updated.students))
      }
    } finally {
      setRemoveStudentsOpen(false)
    }
  }

  const handleEndClass = async () => {
    try {
      await classService.endClass(classId)
      addToast({ variant: 'success', message: '반이 종료됐어요.' })
      endClass.close()
      router.push('/management')
    } catch {
      addToast({ variant: 'error', message: '반 종료에 실패했어요.' })
    }
  }

  const handleDeleteClass = async () => {
    try {
      await classService.deleteClass(classId)
      addToast({ variant: 'success', message: '반이 삭제됐어요.' })
      deleteClass.close()
      router.push('/management')
    } catch {
      addToast({ variant: 'error', message: '반 삭제에 실패했어요.' })
    }
  }

  if (isLoading || !classDetail) return null

  const info = editing && draft ? draft : draftFromClass(classDetail)
  const selectableStudents = students.filter((student) => !student.locked)
  const allStudentsSelected =
    selectableStudents.length > 0 &&
    selectableStudents.every((student) => selectedStudentIds.includes(student.id))

  return (
    <div className={pageStyle}>
      <div className={headerRowStyle}>
        <div className={titleGroupStyle}>
          <button type="button" onClick={() => router.back()} className={backButtonStyle}>
            <ArrowLeftIcon width={24} height={24} />
          </button>
          <Text variant="display" as="h1">
            {info.name || classDetail.name}
          </Text>
        </div>
        <div className={headerActionsStyle}>
          {editing ? (
            <>
              <button type="button" className={cancelButtonStyle} onClick={exitEdit} disabled={saving}>
                취소하기
              </button>
              <button type="button" className={saveButtonStyle} onClick={handleSave} disabled={saving}>
                저장하기
              </button>
            </>
          ) : (
            <button type="button" className={editButtonStyle} onClick={startEdit}>
              <PencilIcon width={16} height={16} />
              수정
            </button>
          )}
        </div>
      </div>

      <section className={sectionStyle}>
        <Text variant="headingMd">반 정보</Text>
        <ClassInfoTable
          name={info.name}
          academyName={info.academyName}
          dayOfWeek={info.dayOfWeek}
          lessonTime={info.lessonTime}
          editing={editing}
          activeField={editing ? activeField : null}
          onEditField={setActiveField}
          onChangeName={(value) => setDraft((prev) => (prev ? { ...prev, name: value } : prev))}
          onChangeAcademy={(value) => setDraft((prev) => (prev ? { ...prev, academyName: value } : prev))}
          onChangeTime={(value) => setDraft((prev) => (prev ? { ...prev, lessonTime: value } : prev))}
          onToggleDay={(day) =>
            setDraft((prev) => {
              if (!prev) return prev
              const selected = prev.dayOfWeek.includes(day)
              return {
                ...prev,
                dayOfWeek: selected
                  ? prev.dayOfWeek.filter((value) => value !== day)
                  : [...prev.dayOfWeek, day],
              }
            })
          }
        />
      </section>

      <section className={sectionStyle}>
        <div className={sectionHeaderStyle}>
          <Text variant="headingMd">학생 명단</Text>
          {editing ? (
            <div className={rosterActionsStyle}>
              <button
                type="button"
                className={selectAllButtonStyle}
                disabled={selectableStudents.length === 0}
                onClick={() =>
                  setSelectedStudentIds(
                    allStudentsSelected ? [] : selectableStudents.map((student) => student.id),
                  )
                }
              >
                전체 선택
              </button>
              <button
                type="button"
                className={deleteStudentsButtonStyle}
                disabled={selectedStudentIds.length === 0}
                onClick={() => setRemoveStudentsOpen(true)}
              >
                삭제({selectedStudentIds.length})
              </button>
              <button type="button" className={enrollButtonStyle} onClick={addStudent.open}>
                학생 등록
              </button>
            </div>
          ) : null}
        </div>
        <StudentTable
          students={students}
          middleColumns={[]}
          separateSchoolGrade
          selectionMode={editing}
          showCheckbox={editing}
          selectedIds={selectedStudentIds}
          onToggleSelect={toggleStudentSelect}
          onRowClick={editing ? undefined : (studentId) => router.push(`/students/${studentId}`)}
        />
        <EnrollStudentsModal
          isOpen={addStudent.isOpen}
          onClose={addStudent.close}
          currentStudentIds={students.map((student) => student.id)}
          onConfirm={async (ids) => {
            try {
              await classService.addStudents(classId, ids)
              const updated = await classService.getClass(classId)
              setStudents(sortStudentsByNameKo(updated.students))
              setClassDetail(updated)
              addStudent.close()
              addToast({ variant: 'success', message: '학생이 추가됐어요.' })
            } catch {
              addToast({ variant: 'error', message: '학생 추가에 실패했어요.' })
            }
          }}
        />
      </section>

      {editing ? (
        <div className={dangerRowStyle}>
          <DangerSection
            variant="end"
            title="반 종료"
            description={'학기가 끝났거나 더 이상 수업이 없다면\n반을 종료할 수 있어요.'}
            buttonLabel="반 종료하기"
            onConfirm={endClass.open}
          />
          <DangerSection
            variant="delete"
            title="반 삭제"
            description={'반을 삭제하면 학생 배정이 해제되지만,\n수업 기록은 그대로 남아요.'}
            buttonLabel="반 삭제하기"
            onConfirm={deleteClass.open}
          />
        </div>
      ) : null}

      <ConfirmModal
        isOpen={removeStudentsOpen}
        onClose={() => setRemoveStudentsOpen(false)}
        onConfirm={handleRemoveSelected}
        title={`선택한 ${selectedStudentIds.length}명의 학생을 ${classDetail.name}에서 제거할까요?`}
        descriptions={['반에서 제거되지만 학생 정보는 그대로 남아요.']}
        confirmLabel="제거"
        confirmVariant="danger"
      />

      <ConfirmModal
        isOpen={endClass.isOpen}
        onClose={endClass.close}
        onConfirm={handleEndClass}
        title={`'${classDetail.name}'을 종료할까요?`}
        descriptions={['종료 후에는 수업 입력이 불가능해요.']}
        confirmLabel="종료"
        confirmVariant="primary"
      />

      <ConfirmModal
        isOpen={deleteClass.isOpen}
        onClose={deleteClass.close}
        onConfirm={handleDeleteClass}
        title={`'${classDetail.name}'을 삭제할까요?`}
        descriptions={['학생 배정이 해제되지만, 수업 기록은 그대로 남아요.']}
        confirmLabel="삭제"
        confirmVariant="danger"
      />
    </div>
  )
}
