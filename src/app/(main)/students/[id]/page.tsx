'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import ArrowLeftIcon from '@/assets/icons/icon-arrow-left.svg'
import ChoiceConfirmModal from '@/components/common/ChoiceConfirmModal/ChoiceConfirmModal'
import AddStudentFormModal from '@/components/student/AddStudentFormModal/AddStudentFormModal'
import * as styles from './studentDashboard.css'
import { MSG } from './_lib/studentDashboardShared'
import { useStudentDashboard } from './_hooks/useStudentDashboard'
import { StudentProfileCard } from './_components/StudentProfileCard'
import { StudentStatsRow } from './_components/StudentStatsRow'
import { StudentIncompleteList } from './_components/StudentIncompleteList'
import { StudentDashboardTabs } from './_components/StudentDashboardTabs'

export default function StudentDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = use(params)
  const studentId = Number(idStr)
  const router = useRouter()

  const dash = useStudentDashboard(studentId)

  if (dash.loading || !dash.detail) {
    return (
      <div className={styles.pageRoot}>
        <p className={styles.emptyState}>{MSG.loading}</p>
      </div>
    )
  }

  const { detail } = dash

  return (
    <div className={styles.pageRoot}>
      <header className={styles.headerRow}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => router.back()}
          aria-label={MSG.back}
        >
          <ArrowLeftIcon width={24} height={24} />
        </button>
        <h1 className={styles.pageTitle}>{MSG.pageTitle}</h1>
      </header>

      <div className={styles.columns}>
        <div className={styles.leftCol}>
          <StudentProfileCard
            detail={detail}
            academyName={dash.academyName}
            classLabel={dash.classLabel}
            onEdit={dash.editStudent.open}
          />
          <StudentStatsRow
            monthlyCompletionPct={dash.monthlyCompletionPct}
            monthlyAttendancePct={dash.monthlyAttendancePct}
            completionDelta={dash.completionDelta}
            attendanceDelta={dash.attendanceDelta}
            recentScoreParsed={dash.recentScoreParsed}
            scoreDelta={dash.scoreDelta}
            scoreDeltaIsPercent={dash.scoreDeltaIsPercent}
          />
          <StudentIncompleteList
            items={detail.incomplete_items}
            overdueLabel={dash.overdueLabel}
            onSelect={dash.setCompletePending}
          />
        </div>

        <div className={styles.rightCol}>
          <StudentDashboardTabs
            mainTab={dash.mainTab}
            onTabChange={dash.setMainTab}
            period={dash.period}
            onPeriodChange={dash.setPeriod}
            scoreRows={dash.scoreRows}
            lessons={dash.lessons}
            alimRows={dash.alimRows}
            aiLoading={dash.aiLoading}
            aiText={dash.aiText}
            aiSections={dash.aiSections}
            onRefreshAi={() => void dash.loadAi(true)}
          />
        </div>
      </div>

      <ChoiceConfirmModal
        isOpen={dash.completePending != null}
        onClose={() => !dash.completeSubmitting && dash.setCompletePending(null)}
        onConfirm={dash.runCompletePending}
        title={MSG.confirmComplete}
        descriptions={[...MSG.confirmCompleteDesc]}
        confirmLabel={MSG.completeActionLabel}
        confirmTone="primary"
        confirmDisabled={dash.completeSubmitting}
      />

      <AddStudentFormModal
        isOpen={dash.editStudent.isOpen}
        onClose={dash.editStudent.close}
        mode="edit"
        defaultValues={{
          name: detail.name,
          phone: detail.phone,
          parent_phone: detail.parent_phone,
          school_name: detail.school_name,
          class_ids: detail.classes.map((c) => c.id),
        }}
        onConfirm={dash.updateStudent}
      />
    </div>
  )
}
