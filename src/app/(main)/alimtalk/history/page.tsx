'use client'

import * as baseStyles from '../alimtalkSettings.css'
import * as styles from './history.css'
import { AlimtalkTabs } from '../_components/AlimtalkTabs'
import { useAlimtalkBatches } from './_hooks/useAlimtalkBatches'
import { HistoryFilterChips } from './_components/HistoryFilterChips'
import { HistoryBatchTable } from './_components/HistoryBatchTable'

export default function AlimtalkHistoryPage() {
  const batches = useAlimtalkBatches()

  return (
    <div className={baseStyles.pageRoot}>
      <h1 className={baseStyles.pageTitle}>알림톡</h1>

      <AlimtalkTabs />

      <HistoryFilterChips
        chip={batches.chip}
        onChipChange={batches.setChip}
        stats={batches.stats}
      />

      {batches.loading ? (
        <div className={styles.emptyState}>불러오는 중…</div>
      ) : batches.filtered.length === 0 ? (
        <div className={styles.emptyState}>표시할 발송 내역이 없어요.</div>
      ) : (
        <HistoryBatchTable
          rows={batches.filtered}
          expandedId={batches.expandedId}
          details={batches.details}
          detailLoading={batches.detailLoading}
          detailSelectedStudentId={batches.detailSelectedStudentId}
          onToggleRow={(id) => void batches.toggleRow(id)}
          onSelectStudent={batches.setDetailSelectedStudentId}
          onResendClick={batches.onResendClick}
        />
      )}

      {batches.hasMore && !batches.loading && (
        <div className={styles.loadMoreRow}>
          <button
            type="button"
            className={styles.chipInactive}
            style={{
              cursor: batches.loadingMore ? 'wait' : 'pointer',
              padding: '10px 20px',
              borderRadius: 8,
            }}
            disabled={batches.loadingMore}
            onClick={() => void batches.loadPage(batches.page + 1, true)}
          >
            {batches.loadingMore
              ? '불러오는 중…'
              : `더 보기 (${batches.meta?.total ?? 0}건 중 ${batches.rows.length}건 로드)`}
          </button>
        </div>
      )}
    </div>
  )
}
