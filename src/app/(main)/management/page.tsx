'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState, useEffect } from 'react'
import Text from '@/components/common/Text'
import useDisclosure from '@/hooks/useDisclosure'
import { classService, type Class } from '@/services/class'
import Button from '@/components/common/Button'
import PlusIcon from '@/assets/icons/icon-plus.svg'
import UploadIcon from '@/assets/icons/icon-upload.svg'
import AddCard from '@/components/common/AddCard'
import Dropdown from '@/components/common/Dropdown'
import ClassCard from './_components/ClassCard/ClassCard'
import PlusCircleIcon from '@/assets/icons/icon-plus-circle.svg'
import {
  tabStyle,
  tabActiveStyle,
  tabContainerStyle,
  tabActionsStyle,
  gridStyle,
} from './management.css'
import ClassFormModal from './_components/ClassFormModal/ClassFormModal'
import StudentTable from './_components/StudentTable/StudentTable'
import AddStudentFormModal from './_components/AddStudentFormModal/AddStudentFormModal'
import BulkUploadModal from './_components/BulkUploadModal/BulkUploadModal'
import ConfirmModal from '@/components/common/ConfirmModal'
import { studentService } from '@/services/student'
import type { Student } from '@/types/student'
import { useToastStore } from '@/stores/toastStore'
import StudentDetailModal from './_components/StudentDetailModal/StudentDetailModal'

const FILTER_OPTIONS = [
  { label: '전체', value: 'all' },
  { label: '진행 중', value: 'active' },
  { label: '종료', value: 'ended' },
]

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']

function ManagementContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') ?? 'class'
  const [filter, setFilter] = useState('all')

  const [students, setStudents] = useState<Student[]>([])
  const [isLoadingStudents, setIsLoadingStudents] = useState(false)
  const addToast = useToastStore((s) => s.addToast)
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)

  const formatSchedule = (schedules: { day_of_week: number }[]) =>
    schedules.map((s) => DAY_NAMES[s.day_of_week]).join('·')

  useEffect(() => {
    if (tab !== 'students') return
    setIsLoadingStudents(true)
    studentService
      .getStudents()
      .then((res) => setStudents(res.data))
      .catch((err) => console.error('학생 목록 조회 실패', err))
      .finally(() => setIsLoadingStudents(false))
  }, [tab])

  const [classes, setClasses] = useState<Class[]>([])
  const [isLoadingClasses, setIsLoadingClasses] = useState(false)

  useEffect(() => {
    if (tab !== 'class') return
    setIsLoadingClasses(true)
    classService
      .getClasses(filter === 'all' ? undefined : { status: filter as 'active' | 'ended' })
      .then((res) => setClasses(res.data))
      .catch((err) => console.error('반 목록 조회 실패', err))
      .finally(() => setIsLoadingClasses(false))
  }, [tab, filter])

  const addClass = useDisclosure()
  const addStudent = useDisclosure()
  const bulkUpload = useDisclosure()
  const [deleteStudentTarget, setDeleteStudentTarget] = useState<number | null>(null)

  const handleDeleteStudent = async () => {
    if (!deleteStudentTarget) return
    try {
      await studentService.deleteStudent(deleteStudentTarget)
      setStudents((prev) => prev.filter((s) => s.id !== deleteStudentTarget))
      addToast({ variant: 'success', message: '학생이 삭제됐어요.' })
    } catch (err) {
      console.error('학생 삭제 실패', err)
      addToast({ variant: 'error', message: '학생 삭제에 실패했어요.' })
    } finally {
      setDeleteStudentTarget(null)
    }
  }

  return (
    <>
      <Text variant="display" as="h1">
        학생·반 관리
      </Text>
      <div className={tabContainerStyle}>
        <button
          className={tab === 'class' ? tabActiveStyle : tabStyle}
          onClick={() => router.push('/management?tab=class')}
        >
          반별 보기
        </button>
        <button
          className={tab === 'students' ? tabActiveStyle : tabStyle}
          onClick={() => router.push('/management?tab=students')}
        >
          전체 학생
        </button>
        {tab === 'students' && (
          <div className={tabActionsStyle}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<UploadIcon width={20} height={20} />}
              onClick={bulkUpload.open}
            >
              일괄 등록
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusIcon width={20} height={20} />}
              onClick={addStudent.open}
            >
              학생 등록
            </Button>
          </div>
        )}
      </div>
      {tab === 'class' && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <Dropdown
              options={FILTER_OPTIONS}
              value={filter}
              onChange={setFilter}
              placeholder="전체"
            />
          </div>
          <div className={gridStyle}>
            {classes.map((cls) => (
              <ClassCard
                key={cls.id}
                id={cls.id}
                name={cls.name}
                academyName={cls.academy_name}
                schedule={formatSchedule(cls.schedules)}
                studentCount={cls.student_count}
                isEnded={!!cls.ended_at}
              />
            ))}
            <AddCard
              icon={<PlusCircleIcon width={36} height={36} />}
              label="반 추가"
              onClick={addClass.open}
            />

            <ClassFormModal
              isOpen={addClass.isOpen}
              onClose={addClass.close}
              onConfirm={async (data) => {
                try {
                  await classService.createClass({
                    academy_name: data.academyName,
                    name: data.name,
                    day_of_week: data.dayOfWeek,
                  })
                  const res = await classService.getClasses(
                    filter === 'all' ? undefined : { status: filter as 'active' | 'ended' }
                  )
                  setClasses(res.data)
                  addClass.close()
                  addToast({ variant: 'success', message: '반이 생성됐어요.' })
                } catch (err) {
                  console.error('반 생성 실패', err)
                  addToast({ variant: 'error', message: '반 생성에 실패했어요.' })
                }
              }}
              mode="add"
            />
          </div>
        </>
      )}
      {tab === 'students' && (
        <>
          <BulkUploadModal
            isOpen={bulkUpload.isOpen}
            onClose={bulkUpload.close}
            onConfirm={async (file) => {
              try {
                await studentService.bulkCreateStudents(file)
                addToast({ variant: 'success', message: '학생이 등록됐어요.' })
                studentService.getStudents().then((res) => setStudents(res.data))
              } catch {
                addToast({ variant: 'error', message: '엑셀 업로드에 실패했어요.' })
              }
            }}
          />
          <AddStudentFormModal
            isOpen={addStudent.isOpen}
            onClose={addStudent.close}
            onConfirm={async (data) => {
              try {
                const newStudent = await studentService.createStudent(data)
                setStudents((prev) => [...prev, newStudent])
                addStudent.close()
                addToast({ variant: 'success', message: '학생이 등록됐어요.' })
              } catch (err) {
                console.error('학생 등록 실패', err)
                addToast({ variant: 'error', message: '학생 등록에 실패했어요.' })
              }
            }}
          />
          <StudentTable
            students={students}
            middleColumns={[
              {
                header: '소속 반',
                render: (student) => student.classes.map((c) => c.name).join(', ') || '-',
              },
            ]}
            onDelete={(id) => setDeleteStudentTarget(id)}
            onRowClick={(id) => setSelectedStudentId(id)}
          />

          <ConfirmModal
            isOpen={!!deleteStudentTarget}
            onClose={() => setDeleteStudentTarget(null)}
            onConfirm={handleDeleteStudent}
            title={`'${students.find((s) => s.id === deleteStudentTarget)?.name}' 학생을 삭제할까요?`}
            descriptions={['삭제 후에는 복구할 수 없어요.']}
            confirmLabel="삭제"
            confirmVariant="danger"
          />

          <StudentDetailModal
            studentId={selectedStudentId}
            onClose={() => setSelectedStudentId(null)}
            onUpdated={() => studentService.getStudents().then((res) => setStudents(res.data))}
          />
        </>
      )}
    </>
  )
}

export default function ManagementPage() {
  return (
    <Suspense>
      <ManagementContent />
    </Suspense>
  )
}
