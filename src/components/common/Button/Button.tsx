import { ReactNode, ButtonHTMLAttributes } from 'react'
import { buttonRecipe } from './Button.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outlined' | 'danger' | 'endClass' | 'deleteClass'
  size?: 'sm' | 'md' | 'lg'
  shape?: 'square' | 'capsule'
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children?: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  shape = 'square',
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${buttonRecipe({ variant, size, shape, fullWidth })}${className ? ` ${className}` : ''}`}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  )
}