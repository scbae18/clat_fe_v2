'use client'

import AttendanceFloatingBar from './AttendanceFloatingBar'
import AttendanceDetailModal from './AttendanceDetailModal'
import AttendanceEndedModal from './AttendanceEndedModal'
import ConfirmModal from '@/components/common/ConfirmModal'
import { useAttendanceFloatingBar } from '@/hooks/attendance/useAttendanceFloatingBar'
import { slotInnerStyle, slotStyle } from './AttendanceFloatingBarHost.css'

export default function AttendanceFloatingBarHost() {
  const bar = useAttendanceFloatingBar()

  return (
    <>
      {bar.active ? (
        <div className={slotStyle}>
          <div className={slotInnerStyle}>
            <AttendanceFloatingBar
              classLabel={bar.active.className}
              code={bar.active.code}
              presentCount={bar.present}
              lateCount={bar.late}
              absentCount={bar.absent}
              remainingLabel={bar.remainingLabel}
              onDetail={() => bar.setDetailOpen(true)}
              onEnd={() => bar.setEndConfirmOpen(true)}
            />
          </div>
        </div>
      ) : null}

      {bar.active ? (
        <AttendanceDetailModal
          isOpen={bar.detailOpen}
          onClose={() => bar.setDetailOpen(false)}
          sessionId={bar.active.sessionId}
          className={bar.active.className}
          prefetchedLinks={bar.active.studentLinks}
          onRequestEnd={() => {
            bar.setDetailOpen(false)
            bar.setEndConfirmOpen(true)
          }}
        />
      ) : null}

      <ConfirmModal
        isOpen={bar.endConfirmOpen}
        onClose={() => bar.setEndConfirmOpen(false)}
        onConfirm={() => void bar.handleEnd()}
        title="출결을 종료할까요?"
        descriptions={['종료 후에는 같은 수업에서 출결을 다시 시작할 수 없어요.']}
        confirmLabel="종료"
        confirmVariant="danger"
      />

      {bar.endedSummary ? (
        <AttendanceEndedModal
          isOpen={true}
          onClose={() => bar.setEndedSummary(null)}
          lessonRecordId={bar.endedSummary.lessonRecordId}
          presentCount={bar.endedSummary.present}
          lateCount={bar.endedSummary.late}
          absentCount={bar.endedSummary.absent}
        />
      ) : null}
    </>
  )
}
