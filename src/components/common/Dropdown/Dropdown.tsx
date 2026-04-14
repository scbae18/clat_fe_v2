'use client'

import { useEffect, useRef, useState } from 'react'
import ChevronDownIcon from '@/assets/icons/icon-chevron-down.svg'
import {
  containerStyle,
  triggerStyle,
  triggerActiveStyle,
  menuStyle,
  menuLabelStyle,
  optionStyle,
  optionSelectedStyle,
  chevronStyle,
  chevronOpenStyle,
  triggerNoBorderStyle,
  triggerFullWidthStyle,
  containerFullWidthStyle,
  menuNoBorderStyle,
} from './Dropdown.css'

interface DropdownOption {
  label: string
  value: string
}

interface DropdownProps {
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  menuLabel?: string
  triggerClassName?: string
  noBorder?: boolean
  fullWidth?: boolean
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = '선택',
  menuLabel,
  triggerClassName,
  noBorder = false,
  fullWidth = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)
  const isSelected = !!selectedOption

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div
      className={[containerStyle, fullWidth ? containerFullWidthStyle : ''].join(' ').trim()}
      ref={containerRef}
    >
      <button
        className={[
          triggerStyle,
          noBorder ? triggerNoBorderStyle : '',
          fullWidth ? triggerFullWidthStyle : '',
          isSelected ? triggerActiveStyle : '',
          triggerClassName ?? '',
        ]
          .join(' ')
          .trim()}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <ChevronDownIcon
          width={16}
          height={16}
          className={`${chevronStyle}${isOpen ? ` ${chevronOpenStyle}` : ''}`}
        />
      </button>
      {isOpen && (
        <div className={[menuStyle, noBorder ? menuNoBorderStyle : ''].join(' ').trim()}>
          {menuLabel && <div className={menuLabelStyle}>{menuLabel}</div>}
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`${optionStyle}${opt.value === value ? ` ${optionSelectedStyle}` : ''}`}
              onClick={() => {
                onChange(opt.value)
                setIsOpen(false)
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
