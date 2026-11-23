'use client'

import SearchIcon from '@/assets/icons/icon-search.svg'
import CloseIcon from '@/assets/icons/icon-close.svg'
import Chip from '@/components/common/Chip'
import Dropdown from '@/components/common/Dropdown'
import {
  toolbarStyle,
  leadingClusterStyle,
  searchBarStyle,
  searchIconSlotStyle,
  searchInputStyle,
  searchClearButtonStyle,
  countClusterStyle,
  countActionButtonStyle,
  countActionDangerStyle,
  selectionHintStyle,
} from './StudentNameSearchBar.css'

export interface StudentSortOption {
  value: string
  label: string
}

interface StudentNameSearchBarProps {
  value: string
  onChange: (value: string) => void
  totalCount: number
  filteredCount: number
  selectionMode?: boolean
  selectedCount?: number
  onStartSelection?: () => void
  onCancelSelection?: () => void
  onSelectAll?: () => void
  onConfirmDelete?: () => void
  onAddStudent?: () => void
  sortValue?: string
  sortOptions?: StudentSortOption[]
  onSortChange?: (value: string) => void
}

export default function StudentNameSearchBar({
  value,
  onChange,
  totalCount,
  filteredCount,
  selectionMode = false,
  selectedCount = 0,
  onStartSelection,
  onCancelSelection,
  onSelectAll,
  onConfirmDelete,
  onAddStudent,
  sortValue,
  sortOptions,
  onSortChange,
}: StudentNameSearchBarProps) {
  const trimmed = value.trim()
  const countLabel =
    trimmed.length > 0
      ? `${filteredCount}명 / 전체 ${totalCount}명`
      : `전체 ${totalCount}명`

  const showSort = Boolean(onSortChange && sortOptions && sortOptions.length > 0)

  return (
    <div className={toolbarStyle}>
      <div className={leadingClusterStyle}>
        {showSort && sortOptions && sortValue ? (
          <Dropdown
            appearance="toggle"
            ariaLabel="정렬"
            options={sortOptions}
            value={sortValue}
            onChange={(next) => onSortChange?.(next)}
          />
        ) : null}
        <label className={searchBarStyle}>
          <input
            type="search"
            className={searchInputStyle}
            placeholder="학생 이름 검색"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label="학생 이름 검색"
          />
          {value.length > 0 ? (
            <button
              type="button"
              className={searchClearButtonStyle}
              onClick={() => onChange('')}
              aria-label="검색어 지우기"
            >
              <CloseIcon width={16} height={16} />
            </button>
          ) : null}
          <span className={searchIconSlotStyle}>
            <SearchIcon width={12} height={12} aria-hidden />
          </span>
        </label>
      </div>
      <div className={countClusterStyle}>
        <Chip variant={trimmed.length > 0 ? 'active' : 'default'} label={countLabel} />
        {!selectionMode && onAddStudent ? (
          <button type="button" className={countActionButtonStyle} onClick={onAddStudent}>
            학생 추가
          </button>
        ) : null}
        {!selectionMode ? (
          onStartSelection && totalCount > 0 ? (
            <button
              type="button"
              className={countActionButtonStyle}
              onClick={onStartSelection}
            >
              선택 삭제
            </button>
          ) : null
        ) : (
          <>
            <span className={selectionHintStyle}>
              {selectedCount > 0 ? `${selectedCount}명 선택` : '삭제할 학생을 선택하세요'}
            </span>
            {onSelectAll && filteredCount > 0 ? (
              <button type="button" className={countActionButtonStyle} onClick={onSelectAll}>
                전체 선택
              </button>
            ) : null}
            {onCancelSelection ? (
              <button type="button" className={countActionButtonStyle} onClick={onCancelSelection}>
                취소
              </button>
            ) : null}
            {onConfirmDelete ? (
              <button
                type="button"
                className={countActionDangerStyle}
                onClick={onConfirmDelete}
                disabled={selectedCount === 0}
              >
                삭제
              </button>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
