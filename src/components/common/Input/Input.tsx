import { forwardRef, InputHTMLAttributes, ReactNode } from 'react'
import { fieldWrapStyle, inputRecipe, trailingStyle } from './Input.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'gray'
  shape?: 'square' | 'capsule'
  hasError?: boolean
  trailing?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'default', shape = 'square', hasError = false, trailing, className, ...props }, ref) => {
    const field = (
      <input
        ref={ref}
        className={[inputRecipe({ variant, shape, hasError, hasTrailing: Boolean(trailing) }), className].filter(Boolean).join(' ')}
        {...props}
      />
    )
    if (!trailing) return field
    return (
      <div className={fieldWrapStyle}>
        {field}
        <span className={trailingStyle}>{trailing}</span>
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
