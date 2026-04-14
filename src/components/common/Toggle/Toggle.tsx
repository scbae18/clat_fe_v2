import { trackStyle, thumbStyle } from './Toggle.css'

interface ToggleProps {
  checked: boolean
  onChange: () => void
  disabled?: boolean
}

export default function Toggle({ checked, onChange, disabled = false }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-checked={checked}
      data-disabled={disabled}
      className={trackStyle}
      onClick={disabled ? undefined : onChange}
    >
      <span className={thumbStyle} />
    </button>
  )
}
