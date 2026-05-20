'use client'

import UsersIcon from '@/assets/icons/icon-users.svg'
import CloseIcon from '@/assets/icons/icon-close.svg'
import Chip from '@/components/common/Chip'
import {
  toolbarStyle,
  searchBarStyle,
  searchLeadingIconStyle,
  searchInputStyle,
  searchClearButtonStyle,
} from './StudentNameSearchBar.css'

interface StudentNameSearchBarProps {
  value: string
  onChange: (value: string) => void
  totalCount: number
  filteredCount: number
}

export default function StudentNameSearchBar({
  value,
  onChange,
  totalCount,
  filteredCount,
}: StudentNameSearchBarProps) {
  const trimmed = value.trim()
  const countLabel =
    trimmed.length > 0
      ? `${filteredCount}명 / 전체 ${totalCount}명`
      : `전체 ${totalCount}명`

  return (
    <div className={toolbarStyle}>
      <label className={searchBarStyle}>
        <UsersIcon width={18} height={18} className={searchLeadingIconStyle} aria-hidden />
        <input
          type="search"
          className={searchInputStyle}
          placeholder="학생 이름 검색"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="학생 이름 검색"
        />
        {value.length > 0 && (
          <button
            type="button"
            className={searchClearButtonStyle}
            onClick={() => onChange('')}
            aria-label="검색어 지우기"
          >
            <CloseIcon width={16} height={16} />
          </button>
        )}
      </label>
      <Chip variant={trimmed.length > 0 ? 'active' : 'default'} label={countLabel} />
    </div>
  )
}
